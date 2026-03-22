<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'category',
        'title',
        'description',
        'schedule',
        'location',
        'contact',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'bool',
    ];
}
