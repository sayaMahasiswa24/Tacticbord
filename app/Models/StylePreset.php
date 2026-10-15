<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StylePreset extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'emoji',
        'formation_code',
        'description',
        'parameters',
        'roles',
        'display_order',
    ];

    protected $casts = [
        'parameters' => 'array',
        'roles' => 'array',
        'display_order' => 'integer',
    ];
}
