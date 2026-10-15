<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'default_positions',
        'display_order',
    ];

    protected $casts = [
        'default_positions' => 'array',
        'display_order' => 'integer',
    ];

    public function savedTactics(): HasMany
    {
        return $this->hasMany(SavedTactic::class);
    }
}
