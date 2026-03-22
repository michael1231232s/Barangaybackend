<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CertificateRequest extends Model
{
    protected $fillable = [
        'user_id',
        'tracking_number',
        'type',
        'purpose',
        'delivery_method',
        'preferred_date',
        'notes',
        'status',
        'admin_notes',
        'processed_at',
        'released_at',
    ];

    protected $casts = [
        'preferred_date' => 'datetime',
        'processed_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
