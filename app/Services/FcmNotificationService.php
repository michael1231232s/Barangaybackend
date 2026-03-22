<?php

namespace App\Services;

use App\Models\DevicePushToken;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FcmNotificationService
{
    public function isConfigured(): bool
    {
        return $this->getJsonKey() !== null && $this->projectId() !== null;
    }

    protected function getJsonKey(): ?array
    {
        $envJson = env('FIREBASE_CREDENTIALS');
        if ($envJson) {
            $decoded = json_decode($envJson, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        $path = $this->credentialsPath();
        if ($path && is_readable($path)) {
            $decoded = json_decode((string) file_get_contents($path), true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    public function sendToUserId(int $userId, string $title, string $body, array $data = []): void
    {
        $tokens = DevicePushToken::query()
            ->where('user_id', $userId)
            ->pluck('token')
            ->unique()
            ->values();

        foreach ($tokens as $token) {
            $this->sendToToken((string) $token, $title, $body, $data);
        }
    }

    /**
     * Notify residents (mobile app users) about a newly published program.
     */
    public function broadcastToResidents(string $title, string $body, array $data = []): void
    {
        $tokens = DevicePushToken::query()
            ->whereHas('user', function ($q) {
                $q->where('role', 'resident');
            })
            ->pluck('token')
            ->unique()
            ->values();

        foreach ($tokens as $token) {
            $this->sendToToken((string) $token, $title, $body, $data);
        }
    }

    public function sendToToken(string $token, string $title, string $body, array $data = []): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $accessToken = $this->accessToken();
        if ($accessToken === null) {
            Log::warning('fcm: could not obtain access token');

            return;
        }

        $projectId = $this->projectId();
        $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";

        $stringData = [];
        foreach ($data as $k => $v) {
            $stringData[(string) $k] = is_scalar($v) ? (string) $v : json_encode($v);
        }

        $payload = [
            'message' => [
                'token' => $token,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                ],
                'data' => $stringData,
                'android' => [
                    'priority' => 'HIGH',
                ],
                'apns' => [
                    'payload' => [
                        'aps' => [
                            'sound' => 'default',
                        ],
                    ],
                ],
            ],
        ];

        $response = Http::withToken($accessToken)
            ->acceptJson()
            ->asJson()
            ->post($url, $payload);

        if (! $response->successful()) {
            $json = $response->json();
            $this->maybePruneInvalidToken($token, $json);
            Log::warning('fcm: send failed', [
                'status' => $response->status(),
                'body' => $json,
            ]);
        }
    }

    protected function maybePruneInvalidToken(string $token, ?array $body): void
    {
        $status = $body['error']['status'] ?? '';
        if ($status === 'NOT_FOUND') {
            DevicePushToken::query()->where('token', $token)->delete();

            return;
        }

        $details = $body['error']['details'] ?? [];
        foreach ($details as $detail) {
            $type = $detail['@type'] ?? '';
            if (str_contains((string) $type, 'ErrorInfo')) {
                $reason = $detail['reason'] ?? '';
                if (in_array($reason, ['UNREGISTERED', 'INVALID_ARGUMENT'], true)) {
                    DevicePushToken::query()->where('token', $token)->delete();
                }
            }
        }
    }

    protected function projectId(): ?string
    {
        $fromEnv = config('services.firebase.project_id');
        if ($fromEnv) {
            return $fromEnv;
        }

        $jsonKey = $this->getJsonKey();

        return $jsonKey['project_id'] ?? null;
    }

    protected function credentialsPath(): ?string
    {
        $p = config('services.firebase.service_account_path');

        return $p && is_string($p) ? $p : null;
    }

    protected function accessToken(): ?string
    {
        $jsonKey = $this->getJsonKey();
        if (! is_array($jsonKey)) {
            return null;
        }

        $scopes = ['https://www.googleapis.com/auth/firebase.messaging'];
        $creds = new ServiceAccountCredentials($scopes, $jsonKey);
        $token = $creds->fetchAuthToken();

        return $token['access_token'] ?? null;
    }
}
