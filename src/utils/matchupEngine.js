import { ROLE_MASTER } from '../data/tacticData';

// 1. Formation Counter Mapping
const COUNTER_FORMATION_MAP = {
  '433': '4231',
  '442': '352',
  '4231': '433',
  '352': '433',
  '343': '4231',
  '4132': '352',
  '541': '343'
};

// 2. Comprehensive 45 Roles Counter Mapping
const COUNTER_ROLE_MAP = {
  // GK (2)
  'goalkeeper': 'goalkeeper',
  'sweeper_keeper': 'sweeper_keeper',
  
  // CB (5)
  'central_defender': 'trequartista', // Needs creativity to break
  'ball_playing_defender': 'pressing_forward', // Press them to force mistakes
  'no_nonsense_centre_back': 'false_nine', // Pull them out
  'libero': 'advanced_forward', // Fast striker behind
  'wide_centre_back': 'inside_forward', // Exploit wide gaps
  
  // FB/WB (6)
  'full_back': 'winger', 
  'wing_back': 'winger',
  'no_nonsense_full_back': 'raumdeuter', // Sneaky movement
  'complete_wing_back': 'defensive_winger', // Track their runs
  'inverted_wing_back': 'winger', // Keep them wide
  'inverted_full_back': 'winger', 

  // DM (5)
  'defensive_midfielder': 'advanced_playmaker',
  'deep_lying_playmaker': 'box_to_box_midfielder',
  'anchor': 'shadow_striker',
  'half_back': 'attacking_midfielder',
  'regista': 'pressing_forward',

  // CM (5)
  'central_midfielder': 'roaming_playmaker',
  'ball_winning_midfielder': 'advanced_playmaker',
  'roaming_playmaker': 'ball_winning_midfielder',
  'box_to_box_midfielder': 'central_midfielder',
  'mezzala': 'carrilero',
  
  // Wide Midfielders / Wingers (8)
  'winger': 'full_back',
  'inverted_winger': 'inverted_full_back',
  'inside_forward': 'no_nonsense_full_back',
  'wide_playmaker': 'wing_back',
  'defensive_winger': 'complete_wing_back',
  'wide_target_forward': 'no_nonsense_full_back',
  'raumdeuter': 'inverted_full_back',
  'wide_midfielder': 'full_back',

  // AM (4)
  'attacking_midfielder': 'half_back',
  'advanced_playmaker': 'anchor',
  'enganche': 'ball_winning_midfielder',
  'shadow_striker': 'half_back',

  // CF (9)
  'advanced_forward': 'no_nonsense_centre_back',
  'deep_lying_forward': 'ball_playing_defender',
  'poacher': 'libero',
  'target_forward': 'central_defender',
  'complete_forward': 'central_defender',
  'pressing_forward': 'central_defender',
  'false_nine': 'anchor',
  'trequartista': 'ball_playing_defender',
  
  // Missing CM/DM from 45 count
  'carrilero': 'mezzala',
  'segundo_volante': 'central_midfielder'
};

// Fallback roles for enemy positions if we don't have a direct counter match
const DEFAULT_ROLES_PER_POS = {
  'GK': 'goalkeeper',
  'CB': 'central_defender',
  'FB': 'full_back',
  'WB': 'wing_back',
  'DM': 'defensive_midfielder',
  'CM': 'central_midfielder',
  'W': 'winger',
  'AM': 'attacking_midfielder',
  'CF': 'advanced_forward'
};

export function getCounterFormation(userFId) {
  return COUNTER_FORMATION_MAP[userFId] || '442'; // default 4-4-2
}

/**
 * Generates an adaptive shadow enemy team based on user's formation and assigned roles.
 */
export function getAdaptiveEnemy(userFId, userAssignedRoles, FORMATIONS) {
  const enemyFId = getCounterFormation(userFId);
  const enemyFormation = FORMATIONS[enemyFId];
  
  if (!enemyFormation) return { enemyPlayers: [], enemyRoles: {} };

  // Mirror the positions
  const enemyPlayers = enemyFormation.players.map(p => ({
    ...p,
    id: `e_${p.id}`,
    x: 1 - p.x, // Mirror horizontally
    y: 1 - p.y  // Mirror vertically
  }));

  const enemyRoles = {};

  // Find all roles the user has assigned
  const userRolesList = Object.values(userAssignedRoles).map(roleId => ROLE_MASTER.find(r => r.id === roleId)).filter(Boolean);

  enemyPlayers.forEach(ep => {
    // Determine the role for this enemy player
    // First, let's see if the user has an attacking role that this defensive enemy position should counter, or vice versa.
    
    // Example logic: if enemy is a CB, look for user's CF roles
    let matchedRole = null;
    
    const possibleUserPosTargets = {
      'CB': ['CF', 'AM'],
      'FB': ['W'],
      'WB': ['W'],
      'DM': ['AM', 'CF'],
      'CM': ['CM', 'DM'],
      'W': ['FB', 'WB'],
      'AM': ['DM', 'CM'],
      'CF': ['CB', 'FB'],
      'GK': ['CF']
    };

    const targets = possibleUserPosTargets[ep.posType] || [];
    
    for (const targetPos of targets) {
      const userTargetRoleObj = userRolesList.find(r => r.posType === targetPos);
      if (userTargetRoleObj) {
        const counterRoleId = COUNTER_ROLE_MAP[userTargetRoleObj.id];
        // Ensure the counter role matches the enemy's position type!
        const counterRoleObj = ROLE_MASTER.find(r => r.id === counterRoleId);
        if (counterRoleObj && counterRoleObj.posType === ep.posType) {
          matchedRole = counterRoleId;
          break;
        }
      }
    }

    if (!matchedRole) {
      matchedRole = DEFAULT_ROLES_PER_POS[ep.posType];
    }
    
    enemyRoles[ep.id] = matchedRole;
  });

  return { enemyPlayers, enemyRoles };
}
