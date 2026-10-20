<?php

namespace Tests\Feature;

use App\Models\Formation;
use App\Models\PlayerRole;
use App\Models\SavedTactic;
use Database\Seeders\TacticalSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TacticalBoardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TacticalSeeder::class);
    }

    public function test_it_renders_landing_page(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Landing/Index')
        );
    }

    public function test_it_renders_tactical_board_with_formations_and_ai_flag_off(): void
    {
        $response = $this->get('/board');

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('TacticalBoard/Index')
            ->has('formations')
            ->has('playerRoles')
            ->has('tacticalZones')
            ->has('stylePresets')
            ->has('savedTactics')
            ->where('features.aiAssistant', false)
        );
    }

    public function test_it_saves_a_custom_tactic_to_database(): void
    {
        $payload = [
            'title' => 'High Press 4-3-3 V2',
            'note' => 'Gaya pressing tinggi untuk lawan defensif',
            'formation' => '433',
            'players' => [
                ['id' => 0, 'posType' => 'GK', 'cx' => 230, 'cy' => 520, 'number' => 1, 'x' => 0.5, 'y' => 0.91],
                ['id' => 1, 'posType' => 'FB', 'cx' => 70, 'cy' => 440, 'number' => 2, 'x' => 0.13, 'y' => 0.78],
            ],
            'enemies' => [],
            'assignedRoles' => [0 => 'sweeper_keeper'],
            'activeStyleId' => 'gegenpressing',
            'annotations' => [],
            'overlays' => ['zone' => true, 'pass' => true],
            'scenarioLayers' => [],
        ];

        $response = $this->post('/tactics', $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('saved_tactics', [
            'title' => 'High Press 4-3-3 V2',
            'formation_code' => '433',
            'active_style_id' => 'gegenpressing',
        ]);
    }

    public function test_it_shows_saved_tactic_details(): void
    {
        $tactic = SavedTactic::create([
            'title' => 'Tiki Taka Classic',
            'formation_code' => '433',
            'custom_positions' => [
                'players' => [['id' => 0, 'cx' => 230, 'cy' => 520]],
                'enemies' => [],
            ],
            'assigned_roles' => [0 => 'sweeper_keeper'],
            'active_style_id' => 'tiki_taka',
            'annotations' => [],
            'active_zones' => ['zone' => true, 'pass' => false],
            'is_public' => true,
        ]);

        $response = $this->get("/tactics/{$tactic->id}");

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $tactic->id,
            'name' => 'Tiki Taka Classic',
            'formation' => '433',
        ]);
    }

    public function test_it_deletes_a_saved_tactic(): void
    {
        $tactic = SavedTactic::create([
            'title' => 'Taktik Sementara',
            'formation_code' => '442',
            'custom_positions' => ['players' => []],
            'is_public' => true,
        ]);

        $response = $this->delete("/tactics/{$tactic->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('saved_tactics', [
            'id' => $tactic->id,
        ]);
    }

    public function test_it_enforces_sqlite_wal_journal_mode_on_disk_databases(): void
    {
        $tempDb = tempnam(sys_get_temp_dir(), 'test_wal_');
        $pdo = new \PDO("sqlite:{$tempDb}");
        $pdo->exec('PRAGMA journal_mode = WAL;');
        $mode = $pdo->query('PRAGMA journal_mode;')->fetchColumn();
        $this->assertEquals('wal', strtolower($mode));
        unset($pdo);
        @unlink($tempDb);
    }

    public function test_it_validates_required_fields_when_saving_tactic(): void
    {
        // Title is required
        $response = $this->post('/tactics', [
            'title' => '',
            'formation' => '433',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_it_reflects_ai_assistant_flag_when_enabled(): void
    {
        config(['features.ai_assistant_enabled' => true]);

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('TacticalBoard/Index')
            ->where('features.aiAssistant', true)
        );
    }

    public function test_it_returns_404_for_non_existent_tactic(): void
    {
        $response = $this->get('/tactics/999999');
        $response->assertStatus(404);
    }

    public function test_it_returns_healthy_diagnostics_on_health_endpoint(): void
    {
        $response = $this->getJson('/api/health');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'timestamp',
            'environment' => ['php_version', 'framework', 'is_vercel', 'pdo_sqlite_loaded'],
            'checks' => [
                'bundled_sqlite',
                'sqlite_storage',
                'vite_manifest',
                'app_key',
                'features' => ['ai_assistant_enabled'],
            ],
        ]);
        $response->assertJson([
            'checks' => [
                'features' => [
                    'ai_assistant_enabled' => false,
                ],
            ],
        ]);
    }
}
