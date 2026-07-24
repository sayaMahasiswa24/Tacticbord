-- ════════════════════════════════════════════════════════
--  TacticBord Database Schema
-- ════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS role_master (
  role_id             TEXT PRIMARY KEY,
  role_name           TEXT NOT NULL,
  short_name          TEXT NOT NULL,
  pos_type            TEXT NOT NULL,
  pos_group           TEXT NOT NULL,
  valid_side          TEXT NOT NULL,
  valid_formations    TEXT NOT NULL,
  width_tendency      REAL NOT NULL,
  depth_tendency      REAL NOT NULL,
  attacking_run       INTEGER NOT NULL DEFAULT 0,
  drops_deep          INTEGER NOT NULL DEFAULT 0,
  overlap_tendency    TEXT NOT NULL DEFAULT 'none',
  pressing_intensity  TEXT NOT NULL DEFAULT 'hold',
  fills_runner_space  INTEGER NOT NULL DEFAULT 0,
  attack_set_piece    INTEGER NOT NULL DEFAULT 0,
  defend_set_piece    TEXT NOT NULL DEFAULT 'zonal',
  description         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS zone_coordinate_map (
  zone_key    TEXT PRIMARY KEY,
  zone_name   TEXT NOT NULL,
  side        TEXT NOT NULL,
  base_rel_x  REAL NOT NULL,
  base_rel_y  REAL NOT NULL,
  x_variance  REAL NOT NULL DEFAULT 0.05,
  y_variance  REAL NOT NULL DEFAULT 0.05,
  depth_line  TEXT
);

-- ════════════════════════════════════════════════════════
--  FORMASI — dipisah jadi 2 tabel karena satu formasi
--  punya banyak slot pemain (relasi one-to-many)
-- ════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS formations (
  formation_id   TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  display_order  INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS formation_players (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  formation_id   TEXT NOT NULL,
  player_slot    INTEGER NOT NULL,
  pos_type       TEXT NOT NULL,
  side           TEXT NOT NULL,
  base_rel_x     REAL NOT NULL,
  base_rel_y     REAL NOT NULL,
  UNIQUE(formation_id, player_slot),
  FOREIGN KEY(formation_id) REFERENCES formations(formation_id)
);

-- ════════════════════════════════════════════════════════
--  PRESET GAYA BERMAIN — sama polanya: satu gaya (Tiki-Taka,
--  dst) punya banyak penugasan peran per slot formasi
-- ════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS style_presets (
  style_id       TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  emoji          TEXT,
  formation_id   TEXT NOT NULL,
  description    TEXT NOT NULL,
  width_mult     REAL NOT NULL DEFAULT 1.0,
  depth_mult     REAL NOT NULL DEFAULT 1.0,
  tempo_mult     REAL NOT NULL DEFAULT 1.0,
  press_boost    REAL NOT NULL DEFAULT 0.0,
  display_order  INTEGER DEFAULT 0,
  FOREIGN KEY(formation_id) REFERENCES formations(formation_id)
);

CREATE TABLE IF NOT EXISTS style_preset_roles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  style_id     TEXT NOT NULL,
  player_slot  INTEGER NOT NULL,
  role_id      TEXT NOT NULL,
  UNIQUE(style_id, player_slot),
  FOREIGN KEY(style_id) REFERENCES style_presets(style_id),
  FOREIGN KEY(role_id) REFERENCES role_master(role_id)
);

-- Diisi bertahap saat prompt-prompt lanjutan (03-11) selesai kamu jalankan
CREATE TABLE IF NOT EXISTS role_phase_movement (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id               TEXT NOT NULL,
  phase                 TEXT NOT NULL,
  primary_zone          TEXT,
  secondary_zone        TEXT,
  depth_line            TEXT,
  lateral_bias          REAL,
  vertical_bias         REAL,
  start_delay_sec       REAL,
  move_duration_sec     REAL,
  easing                TEXT,
  max_displacement      REAL,
  transition_movement   TEXT,
  golden_window_behavior TEXT,
  win_ball_delay_sec    REAL,
  lose_ball_delay_sec   REAL,
  UNIQUE(role_id, phase),
  FOREIGN KEY(role_id) REFERENCES role_master(role_id)
);

CREATE TABLE IF NOT EXISTS role_conditional_rules (
  rule_id                 TEXT PRIMARY KEY,
  role_id                 TEXT NOT NULL,
  phase                   TEXT NOT NULL,
  priority                INTEGER DEFAULT 1,
  watch_side              TEXT,
  watch_pos_type          TEXT,
  partner_roles_trigger   TEXT,
  override_primary_zone   TEXT,
  override_depth_line     TEXT,
  override_lateral_bias   REAL,
  override_vertical_bias  REAL,
  override_start_delay    REAL,
  notes                   TEXT,
  FOREIGN KEY(role_id) REFERENCES role_master(role_id)
);

CREATE TABLE IF NOT EXISTS role_formation_override (
  override_id           TEXT PRIMARY KEY,
  role_id                TEXT NOT NULL,
  formation_id           TEXT NOT NULL,
  phase                  TEXT NOT NULL,
  override_lateral_bias  REAL,
  override_vertical_bias REAL,
  override_depth_line    TEXT,
  override_start_delay   REAL,
  override_duration      REAL,
  notes                  TEXT,
  FOREIGN KEY(role_id) REFERENCES role_master(role_id)
);

CREATE TABLE IF NOT EXISTS player_squad (
  player_id       INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  jersey_number   INTEGER,
  pos_type        TEXT NOT NULL,
  assigned_role_id TEXT,
  rating          INTEGER,
  pace            INTEGER,
  shooting        INTEGER,
  passing         INTEGER,
  dribbling       INTEGER,
  defending       INTEGER,
  physical        INTEGER,
  preferred_foot  TEXT,
  nationality     TEXT,
  FOREIGN KEY(assigned_role_id) REFERENCES role_master(role_id)
);

-- Taktik tersimpan milik user (menggantikan localStorage browser)
CREATE TABLE IF NOT EXISTS saved_tactics (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  note            TEXT,
  formation_id    TEXT NOT NULL,
  formation_name  TEXT,
  roles_json      TEXT NOT NULL,
  positions_json  TEXT NOT NULL,
  drawings_json   TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

-- Log percakapan AI agent (opsional, untuk audit/analytics)
CREATE TABLE IF NOT EXISTS chat_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL,
  role        TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_phase_movement_role ON role_phase_movement(role_id);
CREATE INDEX IF NOT EXISTS idx_conditional_role ON role_conditional_rules(role_id);
CREATE INDEX IF NOT EXISTS idx_override_role_formation ON role_formation_override(role_id, formation_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_formation_players_formation ON formation_players(formation_id);
CREATE INDEX IF NOT EXISTS idx_style_preset_roles_style ON style_preset_roles(style_id);
