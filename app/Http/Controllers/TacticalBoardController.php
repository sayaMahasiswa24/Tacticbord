<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\PlayerRole;
use App\Models\SavedTactic;
use App\Models\StylePreset;
use App\Models\TacticalZone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TacticalBoardController extends Controller
{
    /**
     * Display the main tactical board interface.
     */
    public function index(): Response
    {
        $formations = Formation::orderBy('display_order')->get()->mapWithKeys(function ($f) {
            return [
                $f->code => [
                    'id' => $f->id,
                    'code' => $f->code,
                    'name' => $f->name,
                    'description' => $f->description,
                    'players' => $f->default_positions ?? [],
                ],
            ];
        });

        $playerRoles = PlayerRole::all()->mapWithKeys(function ($r) {
            return [
                $r->code => [
                    'id' => $r->code,
                    'name' => $r->name,
                    'category' => $r->category,
                    'posType' => $r->attributes['posType'] ?? '',
                    'short' => $r->attributes['short'] ?? '',
                    'side' => $r->attributes['side'] ?? 'center',
                    'desc' => $r->description,
                    'width' => $r->movement_vectors['width'] ?? 0.5,
                    'depth' => $r->movement_vectors['depth'] ?? 0.5,
                    'attackingRun' => $r->movement_vectors['attackingRun'] ?? false,
                    'dropsDeep' => $r->movement_vectors['dropsDeep'] ?? false,
                    'overlap' => $r->movement_vectors['overlap'] ?? 'none',
                    'pressing' => $r->attributes['pressing'] ?? 'hold',
                    'fillsSpace' => $r->attributes['fillsSpace'] ?? false,
                    'attackSP' => $r->attributes['attackSP'] ?? false,
                    'defendSP' => $r->attributes['defendSP'] ?? 'stay_back',
                ],
            ];
        });

        $tacticalZones = TacticalZone::all()->map(function ($z) {
            return [
                'id' => $z->id,
                'key' => $z->zone_key,
                'name' => $z->name,
                'zone_type' => $z->zone_type,
                'coordinates' => $z->coordinates,
                'color_hex' => $z->color_hex,
                'description' => $z->description,
            ];
        });

        $stylePresets = StylePreset::orderBy('display_order')->get()->mapWithKeys(function ($sp) {
            return [
                $sp->code => [
                    'id' => $sp->id,
                    'style_id' => $sp->code,
                    'name' => $sp->name,
                    'emoji' => $sp->emoji,
                    'formation' => $sp->formation_code,
                    'description' => $sp->description,
                    'parameters' => $sp->parameters,
                    'roles' => $sp->roles,
                ],
            ];
        });

        $savedTactics = SavedTactic::latest()->get()->map(function ($st) {
            return [
                'id' => $st->id,
                'name' => $st->title,
                'note' => $st->note,
                'formation' => $st->formation_code,
                'players' => $st->custom_positions['players'] ?? $st->custom_positions ?? [],
                'enemies' => $st->custom_positions['enemies'] ?? [],
                'assignedRoles' => $st->assigned_roles ?? [],
                'activeStyleId' => $st->active_style_id,
                'annotations' => $st->annotations ?? [],
                'overlays' => $st->active_zones ?? ['zone' => true, 'pass' => false],
                'scenarioLayers' => $st->scenario_layers ?? [],
                'savedAt' => $st->created_at?->timestamp ? $st->created_at->timestamp * 1000 : null,
            ];
        });

        return Inertia::render('TacticalBoard/Index', [
            'formations' => $formations,
            'playerRoles' => $playerRoles,
            'tacticalZones' => $tacticalZones,
            'stylePresets' => $stylePresets,
            'savedTactics' => $savedTactics,
        ]);
    }

    /**
     * Store a newly created tactic in database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'note' => 'nullable|string|max:1000',
            'formation' => 'required|string',
            'players' => 'required|array',
            'enemies' => 'nullable|array',
            'assignedRoles' => 'nullable|array',
            'activeStyleId' => 'nullable|string',
            'annotations' => 'nullable|array',
            'overlays' => 'nullable|array',
            'scenarioLayers' => 'nullable|array',
        ]);

        $formationModel = Formation::where('code', $validated['formation'])->first();

        SavedTactic::create([
            'title' => $validated['title'],
            'note' => $validated['note'] ?? null,
            'formation_id' => $formationModel?->id,
            'formation_code' => $validated['formation'],
            'custom_positions' => [
                'players' => $validated['players'],
                'enemies' => $validated['enemies'] ?? [],
            ],
            'assigned_roles' => $validated['assignedRoles'] ?? [],
            'active_style_id' => $validated['activeStyleId'] ?? null,
            'annotations' => $validated['annotations'] ?? [],
            'active_zones' => $validated['overlays'] ?? ['zone' => true, 'pass' => false],
            'scenario_layers' => $validated['scenarioLayers'] ?? [],
            'is_public' => true,
        ]);

        return redirect()->back()->with('success', 'Taktik berhasil disimpan ke database SQLite.');
    }

    /**
     * Show a specific saved tactic.
     */
    public function show(SavedTactic $savedTactic): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'id' => $savedTactic->id,
            'name' => $savedTactic->title,
            'note' => $savedTactic->note,
            'formation' => $savedTactic->formation_code,
            'players' => $savedTactic->custom_positions['players'] ?? $savedTactic->custom_positions ?? [],
            'enemies' => $savedTactic->custom_positions['enemies'] ?? [],
            'assignedRoles' => $savedTactic->assigned_roles ?? [],
            'activeStyleId' => $savedTactic->active_style_id,
            'annotations' => $savedTactic->annotations ?? [],
            'overlays' => $savedTactic->active_zones ?? ['zone' => true, 'pass' => false],
            'scenarioLayers' => $savedTactic->scenario_layers ?? [],
            'savedAt' => $savedTactic->created_at?->timestamp ? $savedTactic->created_at->timestamp * 1000 : null,
        ]);
    }

    /**
     * Remove the specified tactic from database.
     */
    public function destroy(SavedTactic $savedTactic): RedirectResponse
    {
        $savedTactic->delete();

        return redirect()->back()->with('success', 'Taktik berhasil dihapus dari database.');
    }
}
