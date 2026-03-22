<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermitAssistanceRequest extends Model
{
    protected $fillable = [
        'user_id',
        'tracking_number',
        'permit_type',
        'business_name',
        'location',
        'details',
        'notes',
        'status',
        'admin_notes',
        'scheduled_at',
        'resolved_at',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
