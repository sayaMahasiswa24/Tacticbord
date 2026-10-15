<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\PlayerRole;
use App\Models\StylePreset;
use App\Models\TacticalZone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class TacticalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedFormations();
        $this->seedPlayerRoles();
        $this->seedTacticalZones();
        $this->seedStylePresets();
    }

    protected function seedFormations(): void
    {
        $formations = [
            '433' => [
                'name' => '4-3-3',
                'description' => 'Formasi seimbang dengan 4 bek, 1 gelandang bertahan, 2 gelandang sentral, dan 3 penyerang.',
                'display_order' => 1,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'FB', 'side' => 'left', 'x' => 0.13, 'y' => 0.78],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'left', 'x' => 0.37, 'y' => 0.79],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.63, 'y' => 0.79],
                    ['id' => 4, 'posType' => 'FB', 'side' => 'right', 'x' => 0.87, 'y' => 0.78],
                    ['id' => 5, 'posType' => 'DM', 'side' => 'center', 'x' => 0.50, 'y' => 0.63],
                    ['id' => 6, 'posType' => 'CM', 'side' => 'left', 'x' => 0.32, 'y' => 0.52],
                    ['id' => 7, 'posType' => 'CM', 'side' => 'right', 'x' => 0.68, 'y' => 0.52],
                    ['id' => 8, 'posType' => 'W', 'side' => 'left', 'x' => 0.10, 'y' => 0.29],
                    ['id' => 9, 'posType' => 'CF', 'side' => 'center', 'x' => 0.50, 'y' => 0.21],
                    ['id' => 10, 'posType' => 'W', 'side' => 'right', 'x' => 0.90, 'y' => 0.29],
                ],
            ],
            '442' => [
                'name' => '4-4-2',
                'description' => 'Formasi klasik dengan dua lini empat pemain yang solid dan duet penyerang di lini depan.',
                'display_order' => 2,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'FB', 'side' => 'left', 'x' => 0.13, 'y' => 0.78],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'left', 'x' => 0.37, 'y' => 0.79],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.63, 'y' => 0.79],
                    ['id' => 4, 'posType' => 'FB', 'side' => 'right', 'x' => 0.87, 'y' => 0.78],
                    ['id' => 5, 'posType' => 'W', 'side' => 'left', 'x' => 0.10, 'y' => 0.57],
                    ['id' => 6, 'posType' => 'CM', 'side' => 'left', 'x' => 0.37, 'y' => 0.57],
                    ['id' => 7, 'posType' => 'CM', 'side' => 'right', 'x' => 0.63, 'y' => 0.57],
                    ['id' => 8, 'posType' => 'W', 'side' => 'right', 'x' => 0.90, 'y' => 0.57],
                    ['id' => 9, 'posType' => 'CF', 'side' => 'left', 'x' => 0.37, 'y' => 0.27],
                    ['id' => 10, 'posType' => 'CF', 'side' => 'right', 'x' => 0.63, 'y' => 0.27],
                ],
            ],
            '4231' => [
                'name' => '4-2-3-1',
                'description' => 'Formasi modern dengan double pivot di lini tengah dan gelandang serang di belakang penyerang tunggal.',
                'display_order' => 3,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'FB', 'side' => 'left', 'x' => 0.13, 'y' => 0.78],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'left', 'x' => 0.37, 'y' => 0.79],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.63, 'y' => 0.79],
                    ['id' => 4, 'posType' => 'FB', 'side' => 'right', 'x' => 0.87, 'y' => 0.78],
                    ['id' => 5, 'posType' => 'DM', 'side' => 'left', 'x' => 0.37, 'y' => 0.64],
                    ['id' => 6, 'posType' => 'DM', 'side' => 'right', 'x' => 0.63, 'y' => 0.64],
                    ['id' => 7, 'posType' => 'W', 'side' => 'left', 'x' => 0.12, 'y' => 0.44],
                    ['id' => 8, 'posType' => 'AM', 'side' => 'center', 'x' => 0.50, 'y' => 0.44],
                    ['id' => 9, 'posType' => 'W', 'side' => 'right', 'x' => 0.88, 'y' => 0.44],
                    ['id' => 10, 'posType' => 'CF', 'side' => 'center', 'x' => 0.50, 'y' => 0.22],
                ],
            ],
            '4132' => [
                'name' => '4-1-3-2 (Diamond)',
                'description' => 'Struktur lini tengah berbentuk intan dengan gelandang bertahan tunggal dan playmaker sentral.',
                'display_order' => 4,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'FB', 'side' => 'left', 'x' => 0.13, 'y' => 0.78],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'left', 'x' => 0.37, 'y' => 0.79],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.63, 'y' => 0.79],
                    ['id' => 4, 'posType' => 'FB', 'side' => 'right', 'x' => 0.87, 'y' => 0.78],
                    ['id' => 5, 'posType' => 'DM', 'side' => 'center', 'x' => 0.50, 'y' => 0.66],
                    ['id' => 6, 'posType' => 'CM', 'side' => 'left', 'x' => 0.30, 'y' => 0.52],
                    ['id' => 7, 'posType' => 'AM', 'side' => 'center', 'x' => 0.50, 'y' => 0.40],
                    ['id' => 8, 'posType' => 'CM', 'side' => 'right', 'x' => 0.70, 'y' => 0.52],
                    ['id' => 9, 'posType' => 'CF', 'side' => 'left', 'x' => 0.38, 'y' => 0.25],
                    ['id' => 10, 'posType' => 'CF', 'side' => 'right', 'x' => 0.62, 'y' => 0.25],
                ],
            ],
            '352' => [
                'name' => '3-5-2',
                'description' => 'Formasi dengan 3 bek sentral dan wing-back yang mendominasi koridor sayap lapangan.',
                'display_order' => 5,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'CB', 'side' => 'left', 'x' => 0.27, 'y' => 0.80],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'center', 'x' => 0.50, 'y' => 0.82],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.73, 'y' => 0.80],
                    ['id' => 4, 'posType' => 'WB', 'side' => 'left', 'x' => 0.08, 'y' => 0.62],
                    ['id' => 5, 'posType' => 'CM', 'side' => 'left', 'x' => 0.32, 'y' => 0.53],
                    ['id' => 6, 'posType' => 'DM', 'side' => 'center', 'x' => 0.50, 'y' => 0.62],
                    ['id' => 7, 'posType' => 'CM', 'side' => 'right', 'x' => 0.68, 'y' => 0.53],
                    ['id' => 8, 'posType' => 'WB', 'side' => 'right', 'x' => 0.92, 'y' => 0.62],
                    ['id' => 9, 'posType' => 'CF', 'side' => 'left', 'x' => 0.37, 'y' => 0.27],
                    ['id' => 10, 'posType' => 'CF', 'side' => 'right', 'x' => 0.63, 'y' => 0.27],
                ],
            ],
            '343' => [
                'name' => '3-4-3',
                'description' => 'Formasi ofensif dengan lebar sayap ganda dan tekanan tinggi di sepertiga akhir lawan.',
                'display_order' => 6,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'CB', 'side' => 'left', 'x' => 0.27, 'y' => 0.80],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'center', 'x' => 0.50, 'y' => 0.82],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'right', 'x' => 0.73, 'y' => 0.80],
                    ['id' => 4, 'posType' => 'WB', 'side' => 'left', 'x' => 0.08, 'y' => 0.58],
                    ['id' => 5, 'posType' => 'CM', 'side' => 'left', 'x' => 0.36, 'y' => 0.53],
                    ['id' => 6, 'posType' => 'CM', 'side' => 'right', 'x' => 0.64, 'y' => 0.53],
                    ['id' => 7, 'posType' => 'WB', 'side' => 'right', 'x' => 0.92, 'y' => 0.58],
                    ['id' => 8, 'posType' => 'W', 'side' => 'left', 'x' => 0.16, 'y' => 0.28],
                    ['id' => 9, 'posType' => 'CF', 'side' => 'center', 'x' => 0.50, 'y' => 0.21],
                    ['id' => 10, 'posType' => 'W', 'side' => 'right', 'x' => 0.84, 'y' => 0.28],
                ],
            ],
            '541' => [
                'name' => '5-4-1',
                'description' => 'Pertahanan solid berlapis lima bek dengan blok tengah rapat untuk serangan balik cepat.',
                'display_order' => 7,
                'players' => [
                    ['id' => 0, 'posType' => 'GK', 'side' => 'center', 'x' => 0.50, 'y' => 0.91],
                    ['id' => 1, 'posType' => 'WB', 'side' => 'left', 'x' => 0.08, 'y' => 0.70],
                    ['id' => 2, 'posType' => 'CB', 'side' => 'left', 'x' => 0.27, 'y' => 0.80],
                    ['id' => 3, 'posType' => 'CB', 'side' => 'center', 'x' => 0.50, 'y' => 0.82],
                    ['id' => 4, 'posType' => 'CB', 'side' => 'right', 'x' => 0.73, 'y' => 0.80],
                    ['id' => 5, 'posType' => 'WB', 'side' => 'right', 'x' => 0.92, 'y' => 0.70],
                    ['id' => 6, 'posType' => 'CM', 'side' => 'left', 'x' => 0.12, 'y' => 0.57],
                    ['id' => 7, 'posType' => 'DM', 'side' => 'left', 'x' => 0.37, 'y' => 0.64],
                    ['id' => 8, 'posType' => 'DM', 'side' => 'right', 'x' => 0.63, 'y' => 0.64],
                    ['id' => 9, 'posType' => 'CM', 'side' => 'right', 'x' => 0.88, 'y' => 0.57],
                    ['id' => 10, 'posType' => 'CF', 'side' => 'center', 'x' => 0.50, 'y' => 0.24],
                ],
            ],
        ];

        foreach ($formations as $code => $data) {
            Formation::updateOrCreate(
                ['code' => $code],
                [
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'default_positions' => $data['players'],
                    'display_order' => $data['display_order'],
                ]
            );
        }
    }

    protected function seedPlayerRoles(): void
    {
        $jsonPath = file_exists(database_path('data/roles-data.json'))
            ? database_path('data/roles-data.json')
            : base_path('backend/db/seed/roles-data.json');

        if (!File::exists($jsonPath)) {
            return;
        }

        $roles = json_decode(File::get($jsonPath), true);
        if (!is_array($roles)) {
            return;
        }

        foreach ($roles as $r) {
            PlayerRole::updateOrCreate(
                ['code' => $r['id']],
                [
                    'name' => $r['name'],
                    'category' => $r['posGroup'] ?? 'MID',
                    'description' => $r['desc'] ?? '',
                    'movement_vectors' => [
                        'width' => $r['width'] ?? 0.5,
                        'depth' => $r['depth'] ?? 0.5,
                        'attackingRun' => $r['attackingRun'] ?? false,
                        'dropsDeep' => $r['dropsDeep'] ?? false,
                        'overlap' => $r['overlap'] ?? 'none',
                    ],
                    'attributes' => [
                        'short' => $r['short'] ?? '',
                        'posType' => $r['posType'] ?? '',
                        'side' => $r['side'] ?? 'center',
                        'pressing' => $r['pressing'] ?? 'hold',
                        'fillsSpace' => $r['fillsSpace'] ?? false,
                        'attackSP' => $r['attackSP'] ?? false,
                        'defendSP' => $r['defendSP'] ?? 'stay_back',
                        'formations' => $r['formations'] ?? '',
                    ],
                ]
            );
        }
    }

    protected function seedTacticalZones(): void
    {
        $jsonPath = file_exists(database_path('data/zones-data.json'))
            ? database_path('data/zones-data.json')
            : base_path('backend/db/seed/zones-data.json');

        if (!File::exists($jsonPath)) {
            return;
        }

        $zones = json_decode(File::get($jsonPath), true);
        if (!is_array($zones)) {
            return;
        }

        foreach ($zones as $z) {
            $zoneType = 'transition';
            if (str_contains($z['name'], 'box') || str_contains($z['name'], 'attacking') || str_contains($z['name'], 'zone_14') || str_contains($z['name'], 'zone_10')) {
                $zoneType = 'attacking';
            } elseif (str_contains($z['name'], 'defensive') || str_contains($z['name'], 'low_block') || str_contains($z['name'], 'own_penalty')) {
                $zoneType = 'defensive';
            } elseif (str_contains($z['name'], 'half_space')) {
                $zoneType = 'half_space';
            }

            TacticalZone::updateOrCreate(
                ['zone_key' => $z['key']],
                [
                    'name' => ucwords(str_replace('_', ' ', $z['name'])),
                    'zone_type' => $zoneType,
                    'coordinates' => [
                        'x' => $z['x'],
                        'y' => $z['y'],
                        'xv' => $z['xv'] ?? 0.05,
                        'yv' => $z['yv'] ?? 0.05,
                        'side' => $z['side'] ?? 'center',
                        'depthLine' => $z['depthLine'] ?? 'central_mid',
                    ],
                    'color_hex' => match ($zoneType) {
                        'attacking' => 'rgba(239, 68, 68, 0.25)',
                        'defensive' => 'rgba(59, 130, 246, 0.25)',
                        'half_space' => 'rgba(245, 158, 11, 0.25)',
                        default => 'rgba(16, 185, 129, 0.25)',
                    },
                    'description' => "Zona taktis {$z['name']} di area {$z['side']}.",
                ]
            );
        }
    }

    protected function seedStylePresets(): void
    {
        $presetsPath = file_exists(database_path('data/style-presets-data.json'))
            ? database_path('data/style-presets-data.json')
            : base_path('backend/db/seed/style-presets-data.json');

        $presetRolesPath = file_exists(database_path('data/style-preset-roles-data.json'))
            ? database_path('data/style-preset-roles-data.json')
            : base_path('backend/db/seed/style-preset-roles-data.json');

        if (!File::exists($presetsPath) || !File::exists($presetRolesPath)) {
            return;
        }

        $presets = json_decode(File::get($presetsPath), true);
        $presetRoles = json_decode(File::get($presetRolesPath), true);

        if (!is_array($presets) || !is_array($presetRoles)) {
            return;
        }

        $rolesByPreset = [];
        foreach ($presetRoles as $pr) {
            $rolesByPreset[$pr['style_id']][$pr['player_slot']] = $pr['role_id'];
        }

        foreach ($presets as $sp) {
            StylePreset::updateOrCreate(
                ['code' => $sp['style_id']],
                [
                    'name' => $sp['name'],
                    'emoji' => $sp['emoji'] ?? '⚽',
                    'formation_code' => $sp['formation_id'],
                    'description' => $sp['description'] ?? '',
                    'parameters' => [
                        'width_mult' => $sp['width_mult'] ?? 1.0,
                        'depth_mult' => $sp['depth_mult'] ?? 1.0,
                        'tempo_mult' => $sp['tempo_mult'] ?? 1.0,
                        'press_boost' => $sp['press_boost'] ?? 0.0,
                    ],
                    'roles' => $rolesByPreset[$sp['style_id']] ?? [],
                    'display_order' => $sp['display_order'] ?? 0,
                ]
            );
        }
    }
}
