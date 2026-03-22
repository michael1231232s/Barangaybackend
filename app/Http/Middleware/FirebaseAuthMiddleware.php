<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Response;

class FirebaseAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $projectId = config('services.firebase.project_id');
        if (!$projectId) {
            abort(500, 'Firebase project id not configured.');
        }

        $authHeader = $request->header('authorization');
        if (!$authHeader || !preg_match('/^Bearer\s+(.*)$/i', $authHeader, $m)) {
            return response()->json(['message' => 'Missing bearer token.'], 401);
        }

        $token = trim($m[1]);

        if (substr_count($token, '.') !== 2) {
            return response()->json(['message' => 'Malformed bearer token.'], 401);
        }

        $keys = Cache::remember('firebase_public_keys', 60 * 60, function () {
            $res = Http::get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
            if (!$res->successful()) {
                abort(500, 'Failed to fetch Firebase public keys.');
            }

            return $res->json();
        });

        try {
            $keySet = [];
            foreach ($keys as $kid => $cert) {
                $pubKey = openssl_pkey_get_public($cert);
                if ($pubKey) {
                    $keySet[$kid] = new Key($pubKey, 'RS256');
                }
            }

            if (empty($keySet)) {
                abort(500, 'Failed to parse Firebase public keys.');
            }

            JWT::$leeway = 60;
            $decoded = (array) JWT::decode($token, $keySet);
        } catch (\Throwable $e) {
            $msg = config('app.debug') ? ('Invalid token: '.$e->getMessage()) : 'Invalid token.';
            return response()->json(['message' => $msg], 401);
        }

        $iss = 'https://securetoken.google.com/'.$projectId;

        if (($decoded['iss'] ?? null) !== $iss) {
            return response()->json(['message' => 'Invalid token issuer.'], 401);
        }

        if (($decoded['aud'] ?? null) !== $projectId) {
            return response()->json(['message' => 'Invalid token audience.'], 401);
        }

        $uid = $decoded['user_id'] ?? $decoded['sub'] ?? null;
        if (!$uid) {
            return response()->json(['message' => 'Token missing uid.'], 401);
        }

        $email = $decoded['email'] ?? null;
        $name = $decoded['name'] ?? ($decoded['email'] ?? 'Resident');

        $user = User::query()->where('firebase_uid', $uid)->first();
        if (!$user && $email) {
            $user = User::query()->where('email', $email)->first();
        }

        if (!$user) {
            $user = User::query()->create([
                'name' => $name,
                'email' => $email ?? ($uid.'@firebase.local'),
                'firebase_uid' => $uid,
                'role' => 'resident',
                'password' => bcrypt(Str::random(40)),
            ]);
        } else {
            $user->forceFill([
                'firebase_uid' => $user->firebase_uid ?: $uid,
                'name' => $user->name ?: $name,
            ])->save();
        }

        Auth::setUser($user);

        return $next($request);
    }
}
