<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Formations Master Data
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->index(); // e.g. "4-3-3", "433"
            $table->text('description')->nullable();
            $table->json('default_positions'); // [{ slot, role_code, x, y, pos_type, side }]
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 2. Player Roles Master Data
        Schema::create('player_roles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. "SK", "BPD", "CDM", "IW", "CF" or "sweeper_keeper"
            $table->string('name');
            $table->string('category'); // "GK", "DEF", "MID", "FWD"
            $table->text('description');
            $table->json('movement_vectors')->nullable();
            $table->json('attributes')->nullable(); // width, depth, pressing, etc.
            $table->timestamps();
        });

        // 3. Tactical Zones Master Data
        Schema::create('tactical_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('zone_key')->nullable()->unique();
            $table->string('zone_type'); // "attacking", "defensive", "transition", "half_space"
            $table->json('coordinates'); // { x, y, width, height } or base coords { x, y, xv, yv, depthLine }
            $table->string('color_hex')->default('#0ea5e9');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 4. Style Presets Master Data (Tiki-Taka, Gegenpressing, etc.)
        Schema::create('style_presets', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. "tiki_taka"
            $table->string('name');
            $table->string('emoji')->nullable();
            $table->string('formation_code'); // references formation code
            $table->text('description')->nullable();
            $table->json('parameters')->nullable(); // width_mult, depth_mult, tempo_mult, press_boost
            $table->json('roles'); // { "p_gk": "sweeper_keeper", ... }
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 5. User Saved Tactics
        Schema::create('saved_tactics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('note')->nullable();
            $table->foreignId('formation_id')->nullable()->constrained('formations')->nullOnDelete();
            $table->string('formation_code')->nullable();
            $table->json('custom_positions'); // home players, away/enemy players, ball
            $table->json('assigned_roles')->nullable();
            $table->string('active_style_id')->nullable();
            $table->json('annotations')->nullable(); // strokes, arrows, drawings
            $table->json('active_zones')->nullable(); // active overlays / zones
            $table->json('scenario_layers')->nullable();
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_tactics');
        Schema::dropIfExists('style_presets');
        Schema::dropIfExists('tactical_zones');
        Schema::dropIfExists('player_roles');
        Schema::dropIfExists('formations');
    }
};
