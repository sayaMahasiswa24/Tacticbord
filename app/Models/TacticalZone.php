<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TacticalZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'zone_key',
        'zone_type',
        'coordinates',
        'color_hex',
        'description',
    ];

    protected $casts = [
        'coordinates' => 'array',
    ];
}
