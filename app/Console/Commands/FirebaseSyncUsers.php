<?php

namespace App\Console\Commands;

use App\Models\FirebaseUser;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;


class FirebaseSyncUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:firebase-sync-users {--page-size=200}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Firestore users collection into MySQL (firebase_users table)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $projectId = config('services.firebase.project_id');
        $serviceAccountPath = config('services.firebase.service_account_path');
        $collection = config('services.firebase.firestore_users_collection', 'users');

        if (!$projectId) {
            $this->error('Missing FIREBASE_PROJECT_ID.');
            return self::FAILURE;
        }

        if (!$serviceAccountPath || !is_file($serviceAccountPath)) {
            $this->error('Missing/invalid FIREBASE_SERVICE_ACCOUNT_PATH (must be a file path to service account JSON).');
            return self::FAILURE;
        }

        $pageSize = (int) $this->option('page-size');
        if ($pageSize < 1 || $pageSize > 1000) {
            $pageSize = 200;
        }

        $scopes = ['https://www.googleapis.com/auth/datastore'];
        $creds = new ServiceAccountCredentials($scopes, $serviceAccountPath);
        $token = $creds->fetchAuthToken();

        if (!is_array($token) || empty($token['access_token'])) {
            $this->error('Failed to get access token from service account.');
            return self::FAILURE;
        }

        $accessToken = $token['access_token'];
        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/{$collection}?pageSize={$pageSize}";

        $total = 0;
        $nextToken = null;

        do {
            $reqUrl = $url.($nextToken ? '&pageToken='.urlencode($nextToken) : '');

            $res = Http::withToken($accessToken)->get($reqUrl);
            if (!$res->successful()) {
                $this->error('Firestore request failed: '.$res->status().' '.$res->body());
                return self::FAILURE;
            }

            $payload = $res->json();
            $docs = $payload['documents'] ?? [];

            foreach ($docs as $doc) {
                $fullName = $doc['name'] ?? '';
                $docId = $fullName ? basename($fullName) : null;
                $fields = $doc['fields'] ?? [];

                $data = $this->decodeFirestoreFields($fields);

                $firebaseUid = $data['uid'] ?? $data['firebase_uid'] ?? $data['firebaseUid'] ?? $docId;
                if (!$firebaseUid) {
                    continue;
                }

                FirebaseUser::query()->updateOrCreate(
                    ['firebase_uid' => $firebaseUid],
                    [
                        'email' => $data['email'] ?? null,
                        'display_name' => $data['displayName'] ?? ($data['name'] ?? null),
                        'phone_number' => $data['phoneNumber'] ?? ($data['phone'] ?? null),
                        'photo_url' => $data['photoURL'] ?? ($data['photoUrl'] ?? null),
                        'firestore_data' => $data,
                        'synced_at' => Carbon::now(),
                    ],
                );

                $total++;
            }

            $nextToken = $payload['nextPageToken'] ?? null;
        } while ($nextToken);

        $this->info("Synced {$total} firebase users.");
        return self::SUCCESS;
    }

    private function decodeFirestoreFields(array $fields): array
    {
        $out = [];
        foreach ($fields as $key => $value) {
            $out[$key] = $this->decodeFirestoreValue($value);
        }

        return $out;
    }

    private function decodeFirestoreValue(mixed $value): mixed
    {
        if (!is_array($value) || count($value) === 0) {
            return null;
        }

        if (array_key_exists('nullValue', $value)) {
            return null;
        }
        if (array_key_exists('stringValue', $value)) {
            return $value['stringValue'];
        }
        if (array_key_exists('booleanValue', $value)) {
            return (bool) $value['booleanValue'];
        }
        if (array_key_exists('integerValue', $value)) {
            return (int) $value['integerValue'];
        }
        if (array_key_exists('doubleValue', $value)) {
            return (float) $value['doubleValue'];
        }
        if (array_key_exists('timestampValue', $value)) {
            return $value['timestampValue'];
        }
        if (array_key_exists('mapValue', $value)) {
            $fields = $value['mapValue']['fields'] ?? [];
            return $this->decodeFirestoreFields($fields);
        }
        if (array_key_exists('arrayValue', $value)) {
            $vals = $value['arrayValue']['values'] ?? [];
            return array_map(fn ($v) => $this->decodeFirestoreValue($v), $vals);
        }

        return $value;
    }
}
