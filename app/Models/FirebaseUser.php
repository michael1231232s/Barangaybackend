<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FirebaseUser extends Model
{
    protected $fillable = [
        'firebase_uid',
        'email',
        'display_name',
        'phone_number',
        'photo_url',
        'firestore_data',
        'synced_at',
    ];

    protected $casts = [
        'firestore_data' => 'array',
        'synced_at' => 'datetime',
    ];
}
