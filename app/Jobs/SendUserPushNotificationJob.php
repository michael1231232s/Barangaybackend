<?php

namespace App\Jobs;

use App\Services\FcmNotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendUserPushNotificationJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $userId,
        public string $title,
        public string $body,
        public array $data = [],
    ) {}

    public function handle(FcmNotificationService $fcm): void
    {
        if (! $fcm->isConfigured()) {
            return;
        }

        $fcm->sendToUserId($this->userId, $this->title, $this->body, $this->data);
    }
}
