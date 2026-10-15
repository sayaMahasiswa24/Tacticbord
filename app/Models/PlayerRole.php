<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'description',
        'movement_vectors',
        'attributes',
    ];

    protected $casts = [
        'movement_vectors' => 'array',
        'attributes' => 'array',
    ];
}
