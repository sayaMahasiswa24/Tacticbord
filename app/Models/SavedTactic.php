<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedTactic extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'note',
        'formation_id',
        'formation_code',
        'custom_positions',
        'assigned_roles',
        'active_style_id',
        'annotations',
        'active_zones',
        'scenario_layers',
        'is_public',
    ];

    protected $casts = [
        'custom_positions' => 'array',
        'assigned_roles' => 'array',
        'annotations' => 'array',
        'active_zones' => 'array',
        'scenario_layers' => 'array',
        'is_public' => 'boolean',
    ];

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
