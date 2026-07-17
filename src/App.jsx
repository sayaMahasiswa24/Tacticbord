import React, { useState, useEffect, useRef, useCallback } from 'react';

// ════════════════════════════════════════════════════════
// 1. DATA MASTER & CONSTANTS
// ════════════════════════════════════════════════════════
const ROLE_MASTER = [
  {"id":"advanced_forward","name":"Advanced Forward","short":"AF","posType":"CF","posGroup":"FWD","side":"center","formations":"433,4231,442","width":0.5,"depth":0.9,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":false,"attackSP":true,"defendSP":"edge_box","desc":"Titik fokus serangan yang bertugas mencetak gol dan mengejar bola di lini depan."},
  {"id":"inside_forward","name":"Inside Forward","short":"IF","posType":"W","posGroup":"FWD","side":"both","formations":"433,4231","width":0.3,"depth":0.85,"attackingRun":true,"dropsDeep":false,"overlap":"underlap","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"edge_box","desc":"Penyerang sayap yang menusuk ke dalam kotak penalti untuk mencetak gol."},
  {"id":"inverted_winger","name":"Inverted Winger","short":"IW","posType":"W","posGroup":"FWD","side":"both","formations":"433,4231","width":0.4,"depth":0.8,"attackingRun":true,"dropsDeep":false,"overlap":"underlap","pressing":"delayed","fillsSpace":true,"attackSP":false,"defendSP":"edge_box","desc":"Pemain sayap yang menusuk ke dalam untuk menciptakan peluang dan memberikan umpan silang."},
  {"id":"mezzala","name":"Mezzala","short":"MEZ","posType":"CM","posGroup":"MID","side":"both","formations":"433,352,442_diamond","width":0.65,"depth":0.75,"attackingRun":true,"dropsDeep":false,"overlap":"overlap","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"zonal","desc":"Gelandang tengah yang bergerak melebar ke area sayap (half-space) untuk menyerang."},
  {"id":"box_to_box_midfielder","name":"Box to Box Midfielder","short":"BBM","posType":"CM","posGroup":"MID","side":"center","formations":"433,442,4231","width":0.5,"depth":0.5,"attackingRun":true,"dropsDeep":true,"overlap":"none","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"zonal","desc":"Gelandang dinamis yang berkontribusi penuh baik saat bertahan maupun menyerang."},
  {"id":"ball_playing_defender","name":"Ball Playing Defender","short":"BPD","posType":"CB","posGroup":"DEF","side":"center","formations":"433,4231,352,343","width":0.2,"depth":0.1,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"near_post","desc":"Bek tengah yang bertugas menghentikan serangan sekaligus memulai serangan dengan umpan akurat."},
  {"id":"libero","name":"Libero","short":"L","posType":"CB","posGroup":"DEF","side":"center","formations":"433,4231,352,343,532","width":0.2,"depth":0.4,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"delayed","fillsSpace":true,"attackSP":true,"defendSP":"far_post","desc":"Bek yang maju ke lini tengah saat tim menguasai bola untuk membantu sirkulasi."},
  {"id":"full_back","name":"Full Back","short":"FB","posType":"FB","posGroup":"DEF","side":"both","formations":"442,433,4231","width":0.8,"depth":0.4,"attackingRun":true,"dropsDeep":false,"overlap":"overlap","pressing":"delayed","fillsSpace":false,"attackSP":false,"defendSP":"zonal","desc":"Bek sayap klasik yang seimbang antara bertahan dan membantu serangan di sisi lapangan."},
  {"id":"sweeper_keeper","name":"Sweeper Keeper","short":"SK","posType":"GK","posGroup":"GK","side":"center","formations":"all","width":0.0,"depth":0.2,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":false,"attackSP":false,"defendSP":"zonal","desc":"Kiper yang aktif keluar dari sarangnya untuk menyapu bola dan terlibat dalam build-up."},
  {"id":"false_nine","name":"False Nine","short":"F9","posType":"CF","posGroup":"FWD","side":"center","formations":"433,4231","width":0.3,"depth":0.7,"attackingRun":false,"dropsDeep":true,"overlap":"none","pressing":"delayed","fillsSpace":true,"attackSP":false,"defendSP":"edge_box","desc":"Penyerang yang turun ke tengah untuk menarik bek lawan dan membuka ruang."},
  {"id":"trequartista","name":"Trequartista","short":"T","posType":"AM","posGroup":"MID","side":"center","formations":"4231,4411,4312","width":0.5,"depth":0.85,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"edge_box","desc":"Playmaker murni yang bebas berkeliaran tanpa tanggung jawab bertahan."},
  {"id":"deep_lying_playmaker","name":"Deep Lying Playmaker","short":"DLP","posType":"DM","posGroup":"MID","side":"center","formations":"433,4231,352","width":0.35,"depth":0.35,"attackingRun":false,"dropsDeep":true,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":false,"defendSP":"zonal","desc":"Playmaker kreatif yang beroperasi dari posisi dalam untuk mengatur tempo serangan."},
  {"id":"inverted_full_back","name":"Inverted Full Back","short":"IFB","posType":"FB","posGroup":"DEF","side":"both","formations":"433,4231","width":0.2,"depth":0.1,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":true,"attackSP":false,"defendSP":"near_post","desc":"Bek sayap yang masuk ke tengah membentuk tiga bek sejajar saat menyerang."},
  {"id":"inverted_wing_back","name":"Inverted Wing Back","short":"IWB","posType":"WB","posGroup":"DEF","side":"both","formations":"433,4231","width":0.3,"depth":0.5,"attackingRun":true,"dropsDeep":false,"overlap":"underlap","pressing":"immediate","fillsSpace":true,"attackSP":false,"defendSP":"zonal","desc":"Bek sayap yang masuk ke lini tengah untuk menambah jumlah pemain di tengah."},
  {"id":"pressing_forward","name":"Pressing Forward","short":"PF","posType":"CF","posGroup":"FWD","side":"center","formations":"433,442","width":0.5,"depth":0.85,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":false,"attackSP":false,"defendSP":"edge_box","desc":"Penyerang yang bertugas menekan bek lawan agar melakukan kesalahan."},
  {"id":"target_forward","name":"Target Forward","short":"TF","posType":"CF","posGroup":"FWD","side":"center","formations":"442,451,541","width":0.5,"depth":0.95,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"near_post","desc":"Penyerang fisik yang menjadi tumpuan bola udara dan menahan bola untuk rekan."},
  {"id":"poacher","name":"Poacher","short":"P","posType":"CF","posGroup":"FWD","side":"center","formations":"442,4231","width":0.45,"depth":0.99,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"none","desc":"Predator kotak penalti yang hanya fokus pada penyelesaian akhir."},
  {"id":"roaming_playmaker","name":"Roaming Playmaker","short":"RPM","posType":"CM","posGroup":"MID","side":"center","formations":"433,4231","width":0.5,"depth":0.6,"attackingRun":true,"dropsDeep":true,"overlap":"none","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"edge_box","desc":"Playmaker dinamis yang menjelajahi lapangan untuk mengatur serangan."},
  {"id":"raumdeuter","name":"Raumdeuter","short":"RD","posType":"W","posGroup":"FWD","side":"both","formations":"433,4231","width":0.5,"depth":0.9,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"none","desc":"Penyelidik ruang yang mencari celah di pertahanan lawan untuk mencetak gol."},
  {"id":"ball_winning_midfielder","name":"Ball Winning Midfielder","short":"BWM","posType":"DM","posGroup":"MID","side":"center","formations":"433,442,4231","width":0.5,"depth":0.4,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":true,"attackSP":false,"defendSP":"zonal","desc":"Gelandang pengangkut air yang bertugas merebut bola melalui tekel agresif."},
  {"id":"shadow_striker","name":"Shadow Striker","short":"SS","posType":"AM","posGroup":"MID","side":"center","formations":"4231,4411","width":0.5,"depth":0.9,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":false,"attackSP":true,"defendSP":"edge_box","desc":"Gelandang serang yang menyerang kotak penalti layaknya striker kedua."},
  {"id":"regista","name":"Regista","short":"R","posType":"DM","posGroup":"MID","side":"center","formations":"433","width":0.4,"depth":0.35,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":false,"defendSP":"zonal","desc":"Direktur permainan di depan bek yang mendikte ritme serangan dengan visi luas."},
  {"id":"anchor_man","name":"Anchor","short":"A","posType":"DM","posGroup":"MID","side":"center","formations":"433,4231","width":0.3,"depth":0.25,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":true,"attackSP":false,"defendSP":"near_post","desc":"Gelandang bertahan statis yang bertugas sebagai jangkar dan pelindung bek."},
  {"id":"segundo_volante","name":"Segundo Volante","short":"VOL","posType":"DM","posGroup":"MID","side":"both","formations":"4231,442_diamond","width":0.5,"depth":0.7,"attackingRun":true,"dropsDeep":false,"overlap":"none","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"zonal","desc":"Gelandang bertahan yang menyerang dari kedalaman hingga kotak penalti lawan."},
  {"id":"carrilero","name":"Carrilero","short":"CAR","posType":"CM","posGroup":"MID","side":"both","formations":"4312,442_diamond","width":0.7,"depth":0.5,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":true,"attackSP":false,"defendSP":"zonal","desc":"Gelandang antar-ruang (shuttler) yang bergerak menyamping untuk menutup ruang sayap."},
  {"id":"wide_target_man","name":"Wide Target Man","short":"WTM","posType":"W","posGroup":"FWD","side":"both","formations":"442,4231","width":0.9,"depth":0.85,"attackingRun":false,"dropsDeep":false,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":true,"defendSP":"near_post","desc":"Pemain sayap fisik yang menjadi sasaran umpan silang dan duel udara."},
  {"id":"complete_forward","name":"Complete Forward","short":"CF","posType":"CF","posGroup":"FWD","side":"center","formations":"4231,433","width":0.5,"depth":0.9,"attackingRun":true,"dropsDeep":true,"overlap":"none","pressing":"immediate","fillsSpace":true,"attackSP":true,"defendSP":"edge_box","desc":"Penyerang serba bisa yang menggabungkan semua peran striker dalam satu paket."},
  {"id":"half_back","name":"Half Back","short":"HB","posType":"DM","posGroup":"MID","side":"center","formations":"433","width":0.3,"depth":0.2,"attackingRun":false,"dropsDeep":true,"overlap":"none","pressing":"hold","fillsSpace":true,"attackSP":false,"defendSP":"near_post","desc":"Gelandang yang turun di antara bek tengah untuk membentuk tiga bek saat membangun serangan."},
  {"id":"enganche","name":"Enganche","short":"EG","posType":"AM","posGroup":"MID","side":"center","formations":"4231,4312","width":0.4,"depth":0.75,"attackingRun":false,"dropsDeep":true,"overlap":"none","pressing":"hold","fillsSpace":false,"attackSP":false,"defendSP":"edge_box","desc":"Playmaker statis yang menjadi poros serangan di area sepertiga akhir lawan."}
];

const FORMATIONS = {
  '433': { name:'4-3-3', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'FB',side:'left',x:.13,y:.78},{id:2,posType:'CB',side:'left',x:.37,y:.79},
    {id:3,posType:'CB',side:'right',x:.63,y:.79},{id:4,posType:'FB',side:'right',x:.87,y:.78},
    {id:5,posType:'DM',side:'center',x:.50,y:.63},
    {id:6,posType:'CM',side:'left',x:.32,y:.52},{id:7,posType:'CM',side:'right',x:.68,y:.52},
    {id:8,posType:'W',side:'left',x:.10,y:.29},{id:9,posType:'CF',side:'center',x:.50,y:.21},
    {id:10,posType:'W',side:'right',x:.90,y:.29},
  ]},
  '442': { name:'4-4-2', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'FB',side:'left',x:.13,y:.78},{id:2,posType:'CB',side:'left',x:.37,y:.79},
    {id:3,posType:'CB',side:'right',x:.63,y:.79},{id:4,posType:'FB',side:'right',x:.87,y:.78},
    {id:5,posType:'W',side:'left',x:.10,y:.57},{id:6,posType:'CM',side:'left',x:.37,y:.57},
    {id:7,posType:'CM',side:'right',x:.63,y:.57},{id:8,posType:'W',side:'right',x:.90,y:.57},
    {id:9,posType:'CF',side:'left',x:.37,y:.27},{id:10,posType:'CF',side:'right',x:.63,y:.27},
  ]},
  '4231': { name:'4-2-3-1', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'FB',side:'left',x:.13,y:.78},{id:2,posType:'CB',side:'left',x:.37,y:.79},
    {id:3,posType:'CB',side:'right',x:.63,y:.79},{id:4,posType:'FB',side:'right',x:.87,y:.78},
    {id:5,posType:'DM',side:'left',x:.37,y:.64},{id:6,posType:'DM',side:'right',x:.63,y:.64},
    {id:7,posType:'W',side:'left',x:.12,y:.44},{id:8,posType:'AM',side:'center',x:.50,y:.44},
    {id:9,posType:'W',side:'right',x:.88,y:.44},{id:10,posType:'CF',side:'center',x:.50,y:.22},
  ]},
  '4132': { name:'4-1-3-2 (Diamond)', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'FB',side:'left',x:.13,y:.78},{id:2,posType:'CB',side:'left',x:.37,y:.79},
    {id:3,posType:'CB',side:'right',x:.63,y:.79},{id:4,posType:'FB',side:'right',x:.87,y:.78},
    {id:5,posType:'DM',side:'center',x:.50,y:.66},
    {id:6,posType:'CM',side:'left',x:.30,y:.52},{id:7,posType:'AM',side:'center',x:.50,y:.40},
    {id:8,posType:'CM',side:'right',x:.70,y:.52},
    {id:9,posType:'CF',side:'left',x:.38,y:.25},{id:10,posType:'CF',side:'right',x:.62,y:.25},
  ]},
  '352': { name:'3-5-2', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'CB',side:'left',x:.27,y:.80},{id:2,posType:'CB',side:'center',x:.50,y:.82},
    {id:3,posType:'CB',side:'right',x:.73,y:.80},
    {id:4,posType:'WB',side:'left',x:.08,y:.62},{id:5,posType:'CM',side:'left',x:.32,y:.53},
    {id:6,posType:'DM',side:'center',x:.50,y:.62},{id:7,posType:'CM',side:'right',x:.68,y:.53},
    {id:8,posType:'WB',side:'right',x:.92,y:.62},
    {id:9,posType:'CF',side:'left',x:.37,y:.27},{id:10,posType:'CF',side:'right',x:.63,y:.27},
  ]},
  '343': { name:'3-4-3', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'CB',side:'left',x:.27,y:.80},{id:2,posType:'CB',side:'center',x:.50,y:.82},
    {id:3,posType:'CB',side:'right',x:.73,y:.80},
    {id:4,posType:'WB',side:'left',x:.08,y:.58},{id:5,posType:'CM',side:'left',x:.36,y:.53},
    {id:6,posType:'CM',side:'right',x:.64,y:.53},{id:7,posType:'WB',side:'right',x:.92,y:.58},
    {id:8,posType:'W',side:'left',x:.16,y:.28},{id:9,posType:'CF',side:'center',x:.50,y:.21},
    {id:10,posType:'W',side:'right',x:.84,y:.28},
  ]},
  '541': { name:'5-4-1', players:[
    {id:0,posType:'GK',side:'center',x:.50,y:.91},
    {id:1,posType:'WB',side:'left',x:.08,y:.70},{id:2,posType:'CB',side:'left',x:.27,y:.80},
    {id:3,posType:'CB',side:'center',x:.50,y:.82},{id:4,posType:'CB',side:'right',x:.73,y:.80},
    {id:5,posType:'WB',side:'right',x:.92,y:.70},
    {id:6,posType:'CM',side:'left',x:.12,y:.57},{id:7,posType:'DM',side:'left',x:.37,y:.64},
    {id:8,posType:'DM',side:'right',x:.63,y:.64},{id:9,posType:'CM',side:'right',x:.88,y:.57},
    {id:10,posType:'CF',side:'center',x:.50,y:.26},
  ]},
};

const TC = {GK:'#2563eb',CB:'#0891b2',FB:'#0ea5e9',WB:'#0284c7',DM:'#7c3aed',CM:'#6366f1',AM:'#9333ea',W:'#ea580c',CF:'#dc2626'};
const TB = {GK:'#1e40af',CB:'#0e7490',FB:'#0369a1',WB:'#075985',DM:'#4c1d95',CM:'#3730a3',AM:'#7e22ce',W:'#c2410c',CF:'#991b1b'};
const POS_LABEL = {GK:'GK',CB:'CB',FB:'FB',WB:'WB',DM:'DM',CM:'CM',AM:'AM',W:'W',CF:'CF'};

const ICON_R_NORMAL = 18;
const ICON_R_DRAG = 21;
const HIT_RADIUS = 24;
const WT = 0.28;

const ZBANDS = [
  {m:.28,bg:'rgba(220,38,38,.07)',tc:'rgba(248,113,113,.5)',l:'CF · W (att)'},
  {m:.44,bg:'rgba(234,88,12,.07)',tc:'rgba(251,146,60,.5)',l:'AM · W'},
  {m:.58,bg:'rgba(99,102,241,.08)',tc:'rgba(165,180,252,.5)',l:'CM'},
  {m:.72,bg:'rgba(124,58,237,.08)',tc:'rgba(196,181,253,.5)',l:'DM · WB'},
  {m:.88,bg:'rgba(8,145,178,.08)',tc:'rgba(103,232,249,.5)',l:'CB · FB'},
  {m:1,bg:'rgba(37,99,235,.12)',tc:'rgba(147,197,253,.5)',l:'GK'},
];

// ════════════════════════════════════════════════════════
// 2. HELPER FUNCTIONS
// ════════════════════════════════════════════════════════
function getRole(roleId) {
  return ROLE_MASTER.find(r => r.id === roleId) || null;
}
function rolesForPosType(posType) {
  return ROLE_MASTER.filter(r => r.posType === posType);
}
function lighten(h) {
  const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
  return `rgb(${Math.min(255,r+40)},${Math.min(255,g+40)},${Math.min(255,b+40)})`;
}
function ease(t, fn) {
  t = Math.max(0, Math.min(1, t));
  if(fn === 'linear') return t;
  if(fn === 'ease-out') return 1 - Math.pow(1-t, 2);
  return t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
}
function detectPosType(rx, ry, curPosType) {
  if(curPosType === 'GK') return { posType:'GK', side:'center' };
  const L = rx < WT, R = rx > (1-WT);
  const side = L ? 'left' : R ? 'right' : 'center';
  if(ry < 0.28) return { posType: (L||R) ? 'W' : 'CF', side };
  if(ry < 0.44) return { posType: (L||R) ? 'W' : 'AM', side };
  if(ry < 0.58) return { posType: 'CM', side };
  if(ry < 0.72) return { posType: (L||R) ? 'WB' : 'DM', side };
  if(ry < 0.88) return { posType: (L||R) ? 'FB' : 'CB', side };
  return { posType:'CB', side:'center' };
}
function widthToX(width, side) {
  if(side === 'left')  return 0.50 - width * 0.45;
  if(side === 'right') return 0.50 + width * 0.45;
  return 0.50;
}
function depthToY(depth) {
  return 0.90 - depth * 0.85;
}
function computePlayerTarget(player, role, phase) {
  if(!role || player.posType === 'GK') {
    let y = 0.91;
    if(role) {
      if(role.id === 'sweeper_keeper') y = phase === 'defense' ? 0.86 : 0.80;
      if(role.id === 'ball_playing_gk') y = phase === 'possession' ? 0.82 : 0.89;
    }
    if(phase === 'transition_neg') y = 0.90;
    return { x: 0.50, y, delay: 0, duration: 0.5, easing: 'ease-in-out' };
  }

  const side = player.side;
  let width = role.width;
  let depth = role.depth;
  let delay = 0.15, duration = 0.85, easing = 'ease-in-out';

  if(phase === 'possession') {
    if(role.dropsDeep) {
      depth = Math.max(0.15, depth - 0.30);
      delay = 0.30; duration = 0.95; easing = 'ease-in-out';
    }
    if(role.overlap === 'overlap') {
      width = Math.min(1, width + 0.08);
      delay = 0.25; duration = 1.05; easing = 'ease-out';
    }
    if(role.overlap === 'underlap') {
      width = Math.max(0, width - 0.15);
      delay = 0.25; duration = 0.95; easing = 'ease-in-out';
    }
    if(role.attackingRun && !role.dropsDeep) {
      depth = Math.min(1, depth + 0.05);
    }
  } else if(phase === 'transition_pos') {
    if(role.attackingRun) {
      depth = Math.min(1, depth + 0.12);
      delay = 0.05; duration = 0.45; easing = 'linear';
    } else if(role.pressing === 'hold') {
      delay = 0; duration = 0.3; easing = 'linear';
    } else {
      delay = 0.15; duration = 0.55; easing = 'ease-out';
    }
    if(role.overlap === 'overlap') { width = Math.min(1, width + 0.05); }
  } else if(phase === 'transition_neg') {
    if(role.pressing === 'immediate') {
      depth = Math.min(1, depth + 0.05);
      delay = 0; duration = 0.35; easing = 'linear';
    } else if(role.pressing === 'delayed') {
      depth = Math.max(0, depth - 0.05);
      delay = 0.15; duration = 0.55; easing = 'linear';
    } else {
      delay = 0; duration = 0.3; easing = 'linear';
    }
  } else if(phase === 'defense') {
    width = width * 0.55;
    depth = Math.max(0, depth - 0.45);
    delay = 0.1; duration = 0.9; easing = 'ease-in-out';
    if(role.fillsSpace) {
      depth = Math.max(0, depth - 0.05);
    }
  }

  let x = widthToX(Math.max(0, Math.min(1, width)), side);
  let y = depthToY(Math.max(0, Math.min(1, depth)));
  return { x, y, delay, duration, easing };
}

// ════════════════════════════════════════════════════════
// 3. KOMPONEN UTAMA (APP)
// ════════════════════════════════════════════════════════
export default function App() {
  const CW = 460, CH = 580;
  const PX = 18, PY = 14, PW = CW - PX * 2, PH = CH - PY * 2;
  const gx = (r) => PX + r * PW;
  const gy = (r) => PY + r * PH;
  const toRel = (cx, cy) => ({ rx: (cx - PX) / PW, ry: (cy - PY) / PH });

  // ── STATE REACT ──
  const [curFId, setCurFId] = useState('433');
  const [players, setPlayers] = useState(() =>
    FORMATIONS['433'].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }))
  );
  const [assignedRoles, setAssignedRoles] = useState({});
  const [overlays, setOverlays] = useState({ zone: true, pass: false });
  const [phase, setPhase] = useState(null);
  const [simSpd, setSimSpd] = useState(1);
  const [activeTab, setActiveTab] = useState('sim');
  const [drawTool, setDrawTool] = useState('select');
  const [drawColor, setDrawColor] = useState('#fbbf24');
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [roleSearch, setRoleSearch] = useState('');
  
  // Modals & Seleksi
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Input Save Taktik
  const [saveName, setSaveName] = useState('');
  const [saveNote, setSaveNote] = useState('');

  // AI Chat State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tb_api_key') || '');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);

  // Toast
  const [toastData, setToastData] = useState({ show: false, msg: '', col: '#0ea5e9' });
  const toastTimerRef = useRef(null);

  // Golden Window State
  const [gwRemain, setGwRemain] = useState(0);
  const [isGwActive, setIsGwActive] = useState(false);
  const gwTimerRef = useRef(null);

  // Hold-to-Reset
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const [isHoldingReset, setIsHoldingReset] = useState(false);
  const resetHoldRef = useRef({ start: null, raf: null });

  // ── REFS UNTUK PERFORMANCE (CANVAS & ANIMATION LOOP) ──
  const mcRef = useRef(null);
  const drawcRef = useRef(null);
  const trashRef = useRef(null);

  // Mutable State untuk Drag & Animasi
  const dragRef = useRef({ id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null });
  const animRef = useRef({ pAnim: {}, running: false, start: null, rafId: null });
  const drawRef = useRef({ active: false, currentPath: null });

  // Sinkronisasi ref dengan state agar loop canvas dapat membacanya tanpa closure stale
  const stateRef = useRef({ players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor });
  useEffect(() => {
    stateRef.current = { players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor };
  }, [players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor]);

  // ── TOAST HELPER ──
  const showToast = useCallback((msg, col = '#0ea5e9') => {
    setToastData({ show: true, msg, col });
    if(toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastData(prev => ({ ...prev, show: false }));
    }, 2600);
  }, []);

  // ── DRAWING ENGINE (CANVAS 1 - PITCH) ──
  const renderPitch = useCallback(() => {
    const canvas = mcRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const { players: curPlayers, assignedRoles: curRoles, overlays: curOverlays, phase: curPhase } = stateRef.current;
    const { id: dragPid, dragging, preview, overTrash, hoverId } = dragRef.current;

    ctx.clearRect(0, 0, CW, CH);

    // 1. Gambar Lapangan Hijau
    ctx.fillStyle = '#1a5c2e'; ctx.fillRect(0,0,CW,CH);
    for(let i=0;i<6;i++){ ctx.fillStyle = i%2 ? '#1a5c2e' : '#1e6834'; ctx.fillRect(PX, PY+i*PH/6, PW, PH/6); }
    ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 1.3;
    ctx.strokeRect(PX, PY, PW, PH);
    ctx.beginPath(); ctx.moveTo(PX, PY+PH/2); ctx.lineTo(PX+PW, PY+PH/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 36, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+PW/2, PY+PH/2, 2.5, 0, Math.PI*2); ctx.fillStyle='rgba(255,255,255,.45)'; ctx.fill();
    const paw=PW*.46, pah=PH*.12;
    ctx.strokeRect(PX+(PW-paw)/2, PY, paw, pah); ctx.strokeRect(PX+(PW-paw)/2, PY+PH-pah, paw, pah);
    ctx.strokeRect(PX+(PW-paw*.48)/2, PY, paw*.48, 24); ctx.strokeRect(PX+(PW-paw*.48)/2, PY+PH-24, paw*.48, 24);
    ctx.beginPath(); ctx.arc(PX+(PW-paw)/2+paw/2, PY+pah, 18, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(PX+(PW-paw)/2+paw/2, PY+PH-pah, 18, Math.PI, Math.PI*2); ctx.stroke();
    ctx.strokeRect(PX+(PW-paw*.3)/2, PY-7, paw*.3, 9); ctx.strokeRect(PX+(PW-paw*.3)/2, PY+PH-2, paw*.3, 9);

    // 2. Gambar Zona
    if(curOverlays.zone) {
      let prev = 0;
      ZBANDS.forEach((b,i) => {
        const y0 = PY+prev*PH, h = (b.m-prev)*PH;
        ctx.fillStyle = b.bg; ctx.fillRect(PX, y0, PW, h);
        ctx.font = '9px Poppins,sans-serif'; ctx.fillStyle = b.tc; ctx.textAlign='right'; ctx.textBaseline='middle';
        ctx.fillText(b.l, PX+PW-5, y0+h/2);
        if(i < ZBANDS.length-1){
          ctx.strokeStyle='rgba(255,255,255,.07)'; ctx.lineWidth=.6; ctx.setLineDash([3,4]);
          ctx.beginPath(); ctx.moveTo(PX, PY+b.m*PH); ctx.lineTo(PX+PW, PY+b.m*PH); ctx.stroke(); ctx.setLineDash([]);
        }
        prev = b.m;
      });
      ctx.strokeStyle='rgba(255,255,255,.09)'; ctx.lineWidth=.7; ctx.setLineDash([2,4]);
      [WT, 1-WT].forEach(rx => { ctx.beginPath(); ctx.moveTo(gx(rx),PY); ctx.lineTo(gx(rx),PY+PH); ctx.stroke(); });
      ctx.setLineDash([]);
    }

    // 3. Gambar Umpan (Passing Lanes)
    if(curOverlays.pass) {
      const t = Date.now()/1200;
      for(let i=0;i<curPlayers.length;i++) for(let j=i+1;j<curPlayers.length;j++){
        const a=curPlayers[i], b=curPlayers[j], d=Math.hypot(a.cx-b.cx, a.cy-b.cy);
        if(d>185) continue;
        const al = Math.max(.06, .30-(d/185)*.20);
        ctx.beginPath(); ctx.moveTo(a.cx,a.cy); ctx.lineTo(b.cx,b.cy);
        ctx.strokeStyle=`rgba(250,204,21,${al})`; ctx.lineWidth=.8; ctx.setLineDash([3,4]); ctx.stroke(); ctx.setLineDash([]);
        const tv = ((t+(i*.13+j*.07))%1);
        ctx.beginPath(); ctx.arc(a.cx+(b.cx-a.cx)*tv, a.cy+(b.cy-a.cy)*tv, 2.5, 0, Math.PI*2);
        ctx.fillStyle=`rgba(250,204,21,${al*1.8})`; ctx.fill();
      }
    }

    // 4. Gambar Panah Pergerakan Fase
    if(curPhase && animRef.current.pAnim) {
      curPlayers.forEach(p => {
        const d = animRef.current.pAnim[p.id]; if(!d) return;
        const dist = Math.hypot(d.tx-p.cx, d.ty-p.cy); if(dist<5) return;
        const col = TC[p.posType] || '#aaa';
        ctx.beginPath(); ctx.moveTo(p.cx,p.cy); ctx.lineTo(d.tx,d.ty);
        ctx.strokeStyle=col+'55'; ctx.lineWidth=1.2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
        const ang = Math.atan2(d.ty-p.cy, d.tx-p.cx), hs=7;
        ctx.beginPath(); ctx.moveTo(d.tx,d.ty);
        ctx.lineTo(d.tx-hs*Math.cos(ang-.38), d.ty-hs*Math.sin(ang-.38));
        ctx.lineTo(d.tx-hs*Math.cos(ang+.38), d.ty-hs*Math.sin(ang+.38));
        ctx.closePath(); ctx.fillStyle=col+'77'; ctx.fill();
      });
    }

    // 5. Gambar Pemain (Pion)
    [...curPlayers].sort((a,b)=>(a.id===dragPid?1:b.id===dragPid?-1:0)).forEach(p => {
      const roleId = curRoles[p.id];
      const isD = dragPid===p.id && dragging, isH = hoverId===p.id && !dragging;
      const col = TC[p.posType] || '#888', bdr = TB[p.posType] || '#444';
      const R = isD ? ICON_R_DRAG : ICON_R_NORMAL;

      if(isD){
        ctx.beginPath(); ctx.arc(p.cx+3,p.cy+5,R,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,.35)'; ctx.fill();
        if(preview && preview.posType !== p.posType && !overTrash){
          const pc = TC[preview.posType] || '#aaa';
          ctx.beginPath(); ctx.arc(p.cx,p.cy,R+8,0,Math.PI*2); ctx.strokeStyle=pc; ctx.lineWidth=2.5; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);
          ctx.font='bold 10px Poppins,sans-serif'; ctx.fillStyle=pc; ctx.textAlign='center'; ctx.textBaseline='bottom';
          ctx.shadowColor='rgba(0,0,0,.8)'; ctx.shadowBlur=4;
          ctx.fillText('→ '+preview.posType, p.cx, p.cy-R-4);
          ctx.shadowBlur=0;
        }
        if(overTrash){
          ctx.beginPath(); ctx.arc(p.cx,p.cy,R+8,0,Math.PI*2); ctx.strokeStyle='#f87171'; ctx.lineWidth=2.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
        }
      }
      if(isH){ ctx.beginPath(); ctx.arc(p.cx,p.cy,R+6,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,.12)'; ctx.fill(); }

      ctx.beginPath(); ctx.arc(p.cx,p.cy,R,0,Math.PI*2);
      if(roleId){
        ctx.fillStyle = overTrash&&isD ? '#dc2626' : (isD?lighten(col):col);
        ctx.fill(); ctx.strokeStyle=bdr; ctx.lineWidth=isD?2.6:2.2; ctx.stroke();
      } else {
        ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.lineWidth=1.8; ctx.setLineDash([5,3]); ctx.stroke(); ctx.setLineDash([]);
      }

      const lbl = POS_LABEL[p.posType] || p.posType;
      ctx.font='800 11.5px "JetBrains Mono",monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(0,0,0,.85)'; ctx.shadowBlur=3; ctx.shadowOffsetY=0.5;
      ctx.fillStyle= roleId ? '#ffffff' : 'rgba(255,255,255,.7)';
      ctx.fillText(lbl, p.cx, p.cy);
      ctx.shadowBlur=0; ctx.shadowOffsetY=0;

      if(roleId){
        const r = getRole(roleId);
        if(r){
          ctx.font='700 9.5px Poppins,sans-serif';
          ctx.shadowColor='rgba(0,0,0,.85)'; ctx.shadowBlur=3;
          ctx.fillStyle='rgba(255,255,255,.95)';
          ctx.fillText(r.short, p.cx, p.cy+(isD?24:21));
          ctx.shadowBlur=0;
        }
      } else if(isH){
        ctx.font='700 10px Poppins,sans-serif'; ctx.fillStyle='rgba(255,255,255,.6)';
        ctx.fillText('+ peran', p.cx, p.cy+22);
      }
    });
  }, []);

  // ── DRAWING ENGINE (CANVAS 2 - SPIDOL) ──
  const renderDrawings = useCallback(() => {
    const canvas = drawcRef.current;
    if(!canvas) return;
    const dctx = canvas.getContext('2d');
    const { drawingPaths: curPaths } = stateRef.current;
    const { currentPath } = drawRef.current;

    dctx.clearRect(0, 0, CW, CH);

    const renderPath = (p) => {
      if(!p || p.points.length < 2) return;
      dctx.strokeStyle = p.color;
      dctx.lineWidth = p.type==='arrow' ? 3.5 : 4;
      dctx.lineCap = 'round'; dctx.lineJoin = 'round';
      dctx.shadowColor = 'rgba(0,0,0,.5)'; dctx.shadowBlur = 3;
      if(p.type === 'pen'){
        dctx.beginPath();
        dctx.moveTo(p.points[0].x, p.points[0].y);
        for(let i=1;i<p.points.length;i++) dctx.lineTo(p.points[i].x, p.points[i].y);
        dctx.stroke();
      } else if(p.type === 'arrow'){
        const a = p.points[0], b = p.points[p.points.length-1];
        dctx.beginPath(); dctx.moveTo(a.x,a.y); dctx.lineTo(b.x,b.y); dctx.stroke();
        const ang = Math.atan2(b.y-a.y, b.x-a.x), hs=14;
        dctx.beginPath(); dctx.moveTo(b.x,b.y);
        dctx.lineTo(b.x-hs*Math.cos(ang-.4), b.y-hs*Math.sin(ang-.4));
        dctx.lineTo(b.x-hs*Math.cos(ang+.4), b.y-hs*Math.sin(ang+.4));
        dctx.closePath(); dctx.fillStyle = p.color; dctx.shadowBlur=0; dctx.fill();
      }
      dctx.shadowBlur = 0;
    };

    curPaths.forEach(p => renderPath(p));
    if(currentPath) renderPath(currentPath);
  }, []);

  // ── ANIMATION LOOP ──
  const startLoop = useCallback(() => {
    if(animRef.current.rafId) return;
    const loop = (time) => {
      animRef.current.rafId = null;
      let need = false;
      if(animRef.current.running) {
        if(animRef.current.start === null) animRef.current.start = time;
        const el = (time - animRef.current.start) / 1000;
        let done = true;
        const curPlayers = [...stateRef.current.players];
        curPlayers.forEach(p => {
          const d = animRef.current.pAnim[p.id]; if(!d) return;
          const prog = d.dr <= 0 ? 1 : Math.max(0, Math.min(1, (el - d.dl) / d.dr));
          if(prog < 1) done = false;
          const et = ease(prog, d.e);
          p.cx = d.sx + (d.tx - d.sx) * et;
          p.cy = d.sy + (d.ty - d.sy) * et;
        });
        setPlayers(curPlayers);
        if(done) animRef.current.running = false; else need = true;
      }
      if(stateRef.current.overlays.pass) need = true;
      renderPitch();
      if(need) animRef.current.rafId = requestAnimationFrame(loop);
    };
    animRef.current.rafId = requestAnimationFrame(loop);
  }, [renderPitch]);

  useEffect(() => {
    renderPitch();
    renderDrawings();
  }, [players, assignedRoles, overlays, drawingPaths, renderPitch, renderDrawings]);

  // ── FITUR GOLDEN WINDOW ──
  const stopGW = useCallback(() => {
    if(gwTimerRef.current) clearInterval(gwTimerRef.current);
    setIsGwActive(false);
  }, []);

  const startGW = useCallback((ph) => {
    setGwRemain(6);
    setIsGwActive(true);
    if(gwTimerRef.current) clearInterval(gwTimerRef.current);
    let rem = 6;
    gwTimerRef.current = setInterval(() => {
      rem = Math.max(0, rem - 0.1);
      setGwRemain(rem);
      if(rem <= 0) {
        clearInterval(gwTimerRef.current);
        setIsGwActive(false);
      }
    }, 100);
  }, []);

  // ── TRIGGER FASE TAKTIS ──
  const triggerPhase = useCallback((ph) => {
    setPhase(ph);
    const { players: curPlayers, assignedRoles: curRoles, simSpd: curSpd } = stateRef.current;
    const targets = {};
    curPlayers.forEach(p => {
      const r = getRole(curRoles[p.id]);
      targets[p.id] = computePlayerTarget(p, r, ph);
    });
    const pAnim = {};
    curPlayers.forEach(p => {
      const t = targets[p.id]; if(!t) return;
      pAnim[p.id] = { sx:p.cx, sy:p.cy, tx:gx(t.x), ty:gy(t.y), dl:t.delay/curSpd, dr:t.duration/curSpd, e:t.easing };
    });
    animRef.current.pAnim = pAnim;
    animRef.current.start = null;
    animRef.current.running = true;

    if(ph === 'transition_pos' || ph === 'transition_neg') startGW(ph);
    else stopGW();

    startLoop();
  }, [startGW, stopGW, startLoop]);

  const stopSim = useCallback(() => {
    animRef.current.running = false;
    setPhase(null);
    stopGW();
    renderPitch();
  }, [stopGW, renderPitch]);

  // ── RESET & HOLD-TO-RESET ──
  const doFullReset = useCallback(() => {
    stopSim();
    setAssignedRoles({});
    const basePlayers = FORMATIONS[curFId].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
    setPlayers(basePlayers);
    setIsResetConfirmOpen(false);
    showToast('Formasi & peran direset ke awal', '#16a34a');
  }, [curFId, stopSim, showToast]);

  const startHoldReset = () => {
    setIsHoldingReset(true);
    resetHoldRef.current.start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - resetHoldRef.current.start;
      const pct = Math.min(100, (elapsed / 1000) * 100);
      setResetHoldProgress(pct);
      if(pct >= 100) {
        doFullReset();
        cancelHoldReset();
        return;
      }
      resetHoldRef.current.raf = requestAnimationFrame(tick);
    };
    resetHoldRef.current.raf = requestAnimationFrame(tick);
  };

  const cancelHoldReset = () => {
    setIsHoldingReset(false);
    setResetHoldProgress(0);
    if(resetHoldRef.current.raf) cancelAnimationFrame(resetHoldRef.current.raf);
  };

  // ── DRAG & DROP HANDLERS (CANVAS 1) ──
  const getScale = () => {
    const r = mcRef.current.getBoundingClientRect();
    return { sx: CW / r.width, sy: CH / r.height, rect: r };
  };
  const hitP = (mx, my) => {
    const curPlayers = stateRef.current.players;
    for(let i = curPlayers.length - 1; i >= 0; i--) {
      if(Math.hypot(curPlayers[i].cx - mx, curPlayers[i].cy - my) < HIT_RADIUS) return curPlayers[i];
    }
    return null;
  };
  const isOverTrash = (clientX, clientY) => {
    if(!trashRef.current) return false;
    const r = trashRef.current.getBoundingClientRect();
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
  };

  const onDown = (mx, my) => {
    const h = hitP(mx, my); if(!h) return false;
    animRef.current.running = false;
    dragRef.current = { id: h.id, dOX: mx - h.cx, dOY: my - h.cy, dragging: false, moved: false, preview: null, overTrash: false, hoverId: dragRef.current.hoverId };
    return true;
  };

  const onMove = (mx, my, clientX, clientY) => {
    const { id: dragPid, dOX, dOY } = dragRef.current;
    if(dragPid !== null) {
      const curPlayers = [...stateRef.current.players];
      const p = curPlayers.find(x => x.id === dragPid);
      if(p) {
        p.cx = Math.max(PX + 13, Math.min(PX + PW - 13, mx - dOX));
        p.cy = Math.max(PY + 13, Math.min(PY + PH - 13, my - dOY));
        dragRef.current.dragging = true;
        dragRef.current.moved = true;
        const { rx, ry } = toRel(p.cx, p.cy);
        dragRef.current.preview = detectPosType(rx, ry, p.posType);
        if(clientX !== undefined) {
          dragRef.current.overTrash = isOverTrash(clientX, clientY);
        }
      }
      setPlayers(curPlayers);
      if(mcRef.current) mcRef.current.style.cursor = 'grabbing';
      startLoop();
    } else {
      const h = hitP(mx, my);
      dragRef.current.hoverId = h ? h.id : null;
      if(mcRef.current) mcRef.current.style.cursor = h ? 'grab' : 'default';
      if(!animRef.current.rafId) renderPitch();
    }
  };

  const onUp = (mx, my, clientX, clientY) => {
    const { id: dragPid, moved, overTrash } = dragRef.current;
    if(dragPid !== null) {
      const curPlayers = [...stateRef.current.players];
      const p = curPlayers.find(x => x.id === dragPid);
      const droppedOnTrash = clientX !== undefined && isOverTrash(clientX, clientY);

      if(droppedOnTrash && p) {
        setAssignedRoles(prev => {
          const next = { ...prev }; delete next[p.id]; return next;
        });
        const base = FORMATIONS[curFId].players.find(bp => bp.id === p.id);
        if(base) { p.cx = gx(base.x); p.cy = gy(base.y); p.posType = base.posType; p.side = base.side; }
        setPlayers(curPlayers);
        showToast('Peran & posisi pemain direset', '#f87171');
      } else if(moved && p && p.posType !== 'GK') {
        const { rx, ry } = toRel(p.cx, p.cy);
        const res = detectPosType(rx, ry, p.posType);
        if(res.posType !== p.posType || res.side !== p.side) {
          const old = p.posType;
          p.posType = res.posType; p.side = res.side;
          if(stateRef.current.assignedRoles[p.id]) {
            const r = getRole(stateRef.current.assignedRoles[p.id]);
            if(!r || r.posType !== res.posType) {
              setAssignedRoles(prev => { const next = { ...prev }; delete next[p.id]; return next; });
            }
          }
          setPlayers(curPlayers);
          showToast(`${old} → ${res.posType}`, TC[res.posType]);
        }
      }
      if(!moved && !droppedOnTrash && p) {
        setSelectedPlayer(p);
        setPendingRole(stateRef.current.assignedRoles[p.id] || null);
      }

      dragRef.current = { id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null };
      if(mcRef.current) mcRef.current.style.cursor = 'grab';
      renderPitch();
    }
  };

  // Attach touch listeners (non-passive agar e.preventDefault bekerja optimal di mobile)
  useEffect(() => {
    const canvas = mcRef.current;
    if(!canvas) return;
    const handleTouchStart = (e) => {
      const { sx, sy, rect } = getScale();
      const t = e.touches[0];
      if(onDown((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy)) e.preventDefault();
    };
    const handleTouchMove = (e) => {
      const { sx, sy, rect } = getScale();
      const t = e.touches[0];
      onMove((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY);
      e.preventDefault();
    };
    const handleTouchEnd = (e) => {
      const { sx, sy, rect } = getScale();
      const t = e.changedTouches[0];
      onUp((t.clientX - rect.left) * sx, (t.clientY - rect.top) * sy, t.clientX, t.clientY);
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [curFId]);

  // ── DRAWING HANDLERS (CANVAS 2 - SPIDOL) ──
  const drawXY = (e) => {
    const rect = drawcRef.current.getBoundingClientRect();
    const sx = CW / rect.width, sy = CH / rect.height;
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
  };

  const onDrawDown = (e) => {
    if(stateRef.current.drawTool === 'select') return;
    const { x, y } = drawXY(e);
    drawRef.current.active = true;
    drawRef.current.currentPath = { type: stateRef.current.drawTool, color: stateRef.current.drawColor, points: [{ x, y }] };
  };

  const onDrawMove = (e) => {
    if(!drawRef.current.active || !drawRef.current.currentPath) return;
    const { x, y } = drawXY(e);
    if(drawRef.current.currentPath.type === 'pen') drawRef.current.currentPath.points.push({ x, y });
    else drawRef.current.currentPath.points = [drawRef.current.currentPath.points[0], { x, y }];
    renderDrawings();
  };

  const onDrawUp = () => {
    if(drawRef.current.currentPath && drawRef.current.currentPath.points.length > 1) {
      setDrawingPaths(prev => [...prev, drawRef.current.currentPath]);
    }
    drawRef.current.currentPath = null;
    drawRef.current.active = false;
    renderDrawings();
  };

  useEffect(() => {
    const canvas = drawcRef.current;
    if(!canvas) return;
    const handleTStart = (e) => { if(stateRef.current.drawTool !== 'select') { e.preventDefault(); onDrawDown(e); } };
    const handleTMove = (e) => { if(drawRef.current.active && drawRef.current.currentPath) { e.preventDefault(); onDrawMove(e); } };
    canvas.addEventListener('touchstart', handleTStart, { passive: false });
    canvas.addEventListener('touchmove', handleTMove, { passive: false });
    canvas.addEventListener('touchend', onDrawUp);
    return () => {
      canvas.removeEventListener('touchstart', handleTStart);
      canvas.removeEventListener('touchmove', handleTMove);
      canvas.removeEventListener('touchend', onDrawUp);
    };
  }, []);

  // ── FITUR EXPORT / IMPORT / SAVE / LOAD ──
  const clearDrawings = () => {
    setDrawingPaths([]);
    drawRef.current.currentPath = null;
    showToast('Coretan dihapus (posisi tim tidak berubah)', '#6b7280');
  };

  const changeFormation = (fid) => {
    stopSim();
    setCurFId(fid);
    setAssignedRoles({});
    const newPlayers = FORMATIONS[fid].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
    setPlayers(newPlayers);
  };

  const saveTacticToStorage = () => {
    if(!saveName.trim()) { showToast('Masukkan nama taktik!', '#dc2626'); return; }
    const data = {
      name: saveName.trim(), note: saveNote.trim(), formation: curFId, formationName: FORMATIONS[curFId].name,
      roles: { ...assignedRoles },
      playerPositions: players.map(p => ({ id: p.id, posType: p.posType, side: p.side, relX: (p.cx - PX) / PW, relY: (p.cy - PY) / PH })),
      drawingPaths: drawingPaths.map(dp => ({ ...dp })),
      savedAt: new Date().toISOString(),
    };
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    saves.unshift(data);
    localStorage.setItem('tacticbord_v2', JSON.stringify(saves.slice(0, 20)));
    setIsSaveOpen(false);
    setSaveName(''); setSaveNote('');
    showToast('Taktik disimpan: ' + data.name, '#16a34a');
  };

  const loadTacticFromStorage = (idx) => {
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    const data = saves[idx]; if(!data) return;
    setCurFId(data.formation);
    setAssignedRoles({ ...data.roles });
    const basePlayers = FORMATIONS[data.formation].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
    if(data.playerPositions) {
      data.playerPositions.forEach(sv => {
        const p = basePlayers.find(x => x.id === sv.id);
        if(p) { p.posType = sv.posType; p.side = sv.side; p.cx = PX + sv.relX * PW; p.cy = PY + sv.relY * PH; }
      });
    }
    setPlayers(basePlayers);
    setDrawingPaths(data.drawingPaths ? data.drawingPaths.map(dp => ({ ...dp })) : []);
    setIsLoadOpen(false);
    showToast('Taktik dimuat: ' + data.name, '#0ea5e9');
  };

  const deleteSaveFromStorage = (e, idx) => {
    e.stopPropagation();
    const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
    saves.splice(idx, 1);
    localStorage.setItem('tacticbord_v2', JSON.stringify(saves));
    showToast('Taktik dihapus', '#6b7280');
    if(saves.length === 0) setIsLoadOpen(false);
  };

  const exportJSON = () => {
    const data = {
      version: '2.1', app: 'TacticBord', exportedAt: new Date().toISOString(),
      formation: curFId, formationName: FORMATIONS[curFId].name, roles: { ...assignedRoles },
      players: players.map(p => ({ id: p.id, posType: p.posType, side: p.side, relX: ((p.cx - PX) / PW).toFixed(3), relY: ((p.cy - PY) / PH).toFixed(3) })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `TacticBord-${FORMATIONS[curFId].name}-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob); link.click();
    showToast('Diekspor sebagai JSON', '#16a34a');
  };

  const importJSON = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if(!data.formation || !FORMATIONS[data.formation]) { showToast('Format file tidak valid', '#dc2626'); return; }
        setCurFId(data.formation);
        setAssignedRoles({ ...data.roles });
        const basePlayers = FORMATIONS[data.formation].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
        if(data.players) {
          data.players.forEach(sv => {
            const p = basePlayers.find(x => x.id === sv.id);
            if(p) { p.posType = sv.posType || p.posType; p.side = sv.side || p.side; if(sv.relX && sv.relY) { p.cx = PX + parseFloat(sv.relX) * PW; p.cy = PY + parseFloat(sv.relY) * PH; } }
          });
        }
        setPlayers(basePlayers);
        showToast('Taktik berhasil diimpor!', '#16a34a');
      } catch { showToast('Gagal membaca file JSON', '#dc2626'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  // ── AI TACTICAL ASSISTANT (ANTHROPIC API) ──
  const saveChatAPIKey = () => {
    if(!apiKey.trim()) { showToast('Masukkan API key terlebih dulu', '#dc2626'); return; }
    localStorage.setItem('tb_api_key', apiKey.trim());
    showToast('API key tersimpan di browser ini', '#16a34a');
  };

  const buildTacticContext = () => {
    const fname = FORMATIONS[curFId].name;
    const lines = players.map(p => {
      const r = getRole(assignedRoles[p.id]);
      if(!r) return `- ${POS_LABEL[p.posType]} (sisi ${p.side}): belum ada peran`;
      return `- ${POS_LABEL[p.posType]} (sisi ${p.side}): ${r.name} [width=${r.width}, depth=${r.depth}, pressing=${r.pressing}, overlap=${r.overlap}, attacking_run=${r.attackingRun}, drops_deep=${r.dropsDeep}]`;
    }).join('\n');
    const phaseTxt = phase ? `Fase yang sedang aktif: ${phase}` : 'Belum ada fase yang dipicu (posisi dasar).';
    return `Formasi: ${fname}\n${phaseTxt}\n\nSusunan peran saat ini:\n${lines}`;
  };

  const sendChatMessage = async (customText) => {
    const textToSend = customText || chatInput;
    if(!textToSend.trim() || chatBusy) return;
    const keyToUse = apiKey.trim() || localStorage.getItem('tb_api_key');
    if(!keyToUse) { showToast('Masukkan API key Anthropic dulu di atas', '#dc2626'); return; }

    const newHistory = [...chatHistory, { role: 'user', content: textToSend.trim() }];
    setChatHistory(newHistory);
    if(!customText) setChatInput('');
    setChatBusy(true);

    const systemPrompt = `Kamu adalah asisten taktik sepak bola untuk pelatih yang sedang menyusun formasi di aplikasi TacticBord.
Jawab dalam Bahasa Indonesia, ringkas (maks 150 kata), langsung ke saran/solusi praktis — hindari basa-basi panjang.
Gunakan **teks tebal** untuk istilah taktis penting.

Konteks papan taktik saat ini:
${buildTacticContext()}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': keyToUse,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 500,
          system: systemPrompt,
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setChatBusy(false);
      if(data.error) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${data.error.message || 'Gagal menghubungi API'}` }]);
      } else {
        const txt = data.content?.[0]?.text || 'Tidak ada respons dari asisten.';
        setChatHistory(prev => [...prev, { role: 'assistant', content: txt }]);
      }
    } catch {
      setChatBusy(false);
      setChatHistory(prev => [...prev, { role: 'assistant', content: '⚠️ Gagal menghubungi API. Periksa API key dan koneksi internet.' }]);
    }
  };

  // ── KALKULASI KOMPOSISI TIM ──
  const getCompStats = () => {
    const cnt = {}, tot = {};
    players.forEach(p => { tot[p.posType] = (tot[p.posType] || 0) + 1; if(assignedRoles[p.id]) cnt[p.posType] = (cnt[p.posType] || 0) + 1; });
    const filled = Object.keys(assignedRoles).filter(id => players.find(p => p.id == id)).length;
    return { cnt, tot, filled };
  };
  const compStats = getCompStats();

  // ════════════════════════════════════════════════════════
  // 4. RENDER TEMPLATE & STYLES (PURE INLINE + MODULE CSS)
  // ════════════════════════════════════════════════════════
  return (
    <div className="app-container">
      {/* GLOBAL CSS STYLES */}
      <style>{`
        :root{
          --bg:#070d16;--bg2:#0d1826;--bg3:#12203352;--card:#101b2a;--card2:#152438;
          --border:#1d2f45;--border2:#28405c;
          --txt:#e7eefc;--txt2:#8ea3c2;--txt3:#5a7292;
          --green:#16a34a;--green2:#22c55e;
          --blue:#0ea5e9;--blue2:#38bdf8;
          --amber:#d97706;--amber2:#fbbf24;
          --purple:#7c3aed;--purple2:#a78bfa;
          --red:#dc2626;--red2:#f87171;
          --cyan:#0891b2;--orange:#ea580c;--indigo:#6366f1;
          --r:8px;--r2:14px;
          --shadow:0 8px 32px rgba(0,0,0,.45);
          --thumb-h:64px;
        }
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        body{font-family:'Poppins',sans-serif;background:var(--bg);color:var(--txt);font-size:13.5px;overflow:hidden;user-select:none}
        ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
        .app-container{display:flex;flex-direction:column;height:100vh}
        .header{background:linear-gradient(120deg,var(--bg2),#0f1d2f);border-bottom:1px solid var(--border);padding:9px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0}
        .logo{display:flex;align-items:center;gap:9px}
        .logo-icon{width:34px;height:34px;background:linear-gradient(135deg,var(--green),var(--blue));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
        .logo-text{font-size:17px;font-weight:800;letter-spacing:-.4px;background:linear-gradient(90deg,var(--green2),var(--blue2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .logo-sub{font-size:10px;color:var(--txt3);margin-top:0px}
        .header-mid{margin-left:6px;display:flex;align-items:center;gap:6px}
        .fsel{font-size:12.5px;padding:6px 10px;border-radius:var(--r);border:1px solid var(--border2);background:var(--card2);color:var(--txt);font-family:inherit;font-weight:600}
        .header-right{margin-left:auto;display:flex;align-items:center;gap:6px;position:relative}
        .hbtn{display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:var(--r);border:1px solid var(--border2);font-size:12px;cursor:pointer;font-family:inherit;font-weight:500;background:var(--card2);color:var(--txt2);transition:all .15s}
        .hbtn:hover{border-color:var(--blue);color:var(--blue2)}
        .settings-btn{width:38px;height:38px;padding:0;justify-content:center;font-size:17px;border-radius:50%}
        .settings-menu{display:none;position:absolute;top:46px;right:0;background:var(--card);border:1px solid var(--border2);border-radius:var(--r2);box-shadow:var(--shadow);min-width:210px;z-index:150;overflow:hidden}
        .settings-menu.open{display:block}
        .sm-item{display:flex;align-items:center;gap:9px;padding:11px 14px;font-size:12.5px;color:var(--txt2);cursor:pointer;border-bottom:1px solid var(--border);transition:all .12s;font-weight:500}
        .sm-item:last-child{border-bottom:none}
        .sm-item:hover{background:var(--card2);color:var(--txt)}
        .sm-item input[type=file]{display:none}
        .phasebar{background:var(--bg2);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;flex-shrink:0}
        .pb-label{font-size:9.5px;text-transform:uppercase;letter-spacing:.8px;color:var(--txt3);font-weight:700;white-space:nowrap;margin-right:2px}
        .phbtn{display:flex;align-items:center;gap:7px;padding:10px 16px;border-radius:var(--r);border:1px solid var(--border2);font-size:13px;cursor:pointer;font-family:inherit;font-weight:700;background:var(--card);color:var(--txt2);transition:all .18s;white-space:nowrap;min-height:44px}
        .phbtn:hover{background:var(--card2)}
        .phbtn .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .phbtn.on-poss{background:#0a2942;border-color:var(--blue);color:var(--blue2)}
        .phbtn.on-tp{background:#2b1a02;border-color:var(--amber);color:var(--amber2)}
        .phbtn.on-tn{background:#1c1140;border-color:var(--purple);color:var(--purple2)}
        .phbtn.on-def{background:#2b0a0a;border-color:var(--red);color:var(--red2)}
        .pb-right{margin-left:auto;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .mini-lbl{font-size:9.5px;color:var(--txt3);text-transform:uppercase;letter-spacing:.6px;white-space:nowrap}
        .spd-group{display:flex;border:1px solid var(--border2);border-radius:99px;overflow:hidden;background:var(--card)}
        .spd{padding:7px 12px;font-size:11.5px;cursor:pointer;background:transparent;color:var(--txt3);font-family:'JetBrains Mono',monospace;border:none;font-weight:600;min-height:36px}
        .spd.on{background:var(--blue);color:#fff}
        .ovbtn{display:flex;align-items:center;gap:4px;padding:7px 11px;border-radius:var(--r);border:1px solid var(--border2);font-size:11.5px;cursor:pointer;background:transparent;color:var(--txt3);font-family:inherit;min-height:36px}
        .ovbtn.on{background:var(--card2);color:var(--txt)}
        .main{flex:1;display:flex;overflow:hidden}
        .pitch-col{flex:1;display:flex;align-items:center;justify-content:center;padding:12px;overflow:hidden;position:relative}
        .pitch-wrap{position:relative;border-radius:var(--r2);overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow)}
        canvas#mc,canvas#drawc{display:block;width:100%;max-width:480px;touch-action:none}
        canvas#mc{cursor:grab}
        canvas#drawc{position:absolute;top:0;left:0;pointer-events:none}
        canvas#drawc.pen-active{pointer-events:auto;cursor:crosshair}
        .hint-bar{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:10.5px;color:var(--txt3);background:rgba(7,13,22,.75);padding:4px 12px;border-radius:99px;white-space:nowrap;backdrop-filter:blur(4px)}
        .trash-zone{position:absolute;bottom:74px;left:50%;transform:translateX(-50%) scale(.7);width:64px;height:64px;border-radius:50%;background:rgba(220,38,38,.15);border:2px dashed var(--red2);display:flex;align-items:center;justify-content:center;font-size:26px;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s;z-index:40}
        .trash-zone.show{opacity:1;transform:translateX(-50%) scale(1)}
        .trash-zone.hover{background:rgba(220,38,38,.35);transform:translateX(-50%) scale(1.15);border-color:#fff}
        .sidebar{width:262px;flex-shrink:0;border-left:1px solid var(--border);background:var(--bg2);display:flex;flex-direction:column;overflow:hidden}
        .sbtabs{display:flex;border-bottom:1px solid var(--border);flex-shrink:0}
        .sbtab{flex:1;padding:9px 4px;font-size:10.5px;font-weight:600;text-align:center;cursor:pointer;color:var(--txt3);background:var(--card);border-right:1px solid var(--border);transition:all .12s}
        .sbtab:last-child{border-right:none}
        .sbtab.active{background:var(--bg2);color:var(--txt)}
        .sbscroll{flex:1;overflow-y:auto;padding:11px}
        .sc{background:var(--card);border:1px solid var(--border);border-radius:var(--r2);overflow:hidden;margin-bottom:9px}
        .sh{font-size:9.5px;text-transform:uppercase;letter-spacing:.7px;font-weight:700;color:var(--txt3);padding:8px 11px;background:var(--card2);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:6px}
        .sh i{font-size:13px}
        .sb{padding:10px 11px}
        .info-row{display:flex;align-items:flex-start;gap:7px;font-size:11.5px;color:var(--txt2);margin-bottom:5px;line-height:1.45}
        .info-row:last-child{margin-bottom:0}
        .phase-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:4px 10px;border-radius:99px;font-weight:700;margin-bottom:8px;border:1px solid}
        .pbadge-base{background:rgba(255,255,255,.04);color:var(--txt3);border-color:var(--border2)}
        .pbadge-poss{background:rgba(14,165,233,.14);color:var(--blue2);border-color:var(--blue)}
        .pbadge-tp{background:rgba(217,119,6,.14);color:var(--amber2);border-color:var(--amber)}
        .pbadge-tn{background:rgba(124,58,237,.14);color:var(--purple2);border-color:var(--purple)}
        .pbadge-def{background:rgba(220,38,38,.14);color:var(--red2);border-color:var(--red)}
        .gw-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin:6px 0}
        .gw-fill{height:100%;border-radius:2px;transition:width .1s linear}
        .role-name{font-size:13px;font-weight:700;margin-bottom:4px}
        .role-desc{font-size:11.5px;color:var(--txt2);line-height:1.55;margin-bottom:9px}
        .role-tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:99px;font-weight:700;border:1px solid;margin-right:4px;margin-bottom:4px}
        .attr-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
        .attr-item{background:var(--card2);border-radius:6px;padding:6px 8px}
        .attr-lbl{font-size:9.5px;color:var(--txt3);text-transform:uppercase;letter-spacing:.4px}
        .attr-val{font-size:12px;font-weight:700;color:var(--txt);margin-top:2px}
        .sum-row{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:var(--txt2);margin-bottom:5px;padding-bottom:4px;border-bottom:1px solid rgba(29,47,69,.5)}
        .sum-row:last-child{border-bottom:none;margin-bottom:0}
        .sum-val{color:var(--txt);font-weight:700;font-family:'JetBrains Mono',monospace;font-size:11px}
        .sum-dot{width:8px;height:8px;border-radius:50%;margin-right:5px;flex-shrink:0}
        .pbar{height:3px;border-radius:2px;background:var(--border);margin-top:5px;overflow:hidden}
        .pfill{height:100%;border-radius:2px;background:var(--green2);transition:width .3s}
        .leg-item{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--txt2);margin-bottom:5px}
        .leg-item:last-child{margin-bottom:0}
        .ldot{width:11px;height:11px;border-radius:50%;flex-shrink:0;border:1.5px solid rgba(0,0,0,.3)}
        .hint{font-size:11px;color:var(--txt2);line-height:1.6;padding:9px 10px;background:var(--bg3);border-radius:var(--r);border:1px solid var(--border)}
        .hint b{color:var(--txt)}
        .zone-bar{font-size:9.5px;padding:5px 9px;border-radius:6px;text-align:center;margin-bottom:3px;font-weight:700;border:1px solid transparent}
        .rolelist-search{width:100%;padding:7px 10px;border-radius:var(--r);border:1px solid var(--border2);background:var(--card2);color:var(--txt);font-family:inherit;font-size:12px;margin-bottom:8px;outline:none}
        .rolelist-search:focus{border-color:var(--blue)}
        .rl-card{border:1px solid var(--border);border-radius:var(--r);padding:8px 10px;margin-bottom:6px;background:var(--card2);cursor:pointer;transition:all .12s}
        .rl-card:hover{border-color:var(--border2)}
        .rl-head{display:flex;align-items:center;gap:7px;margin-bottom:3px}
        .rl-badge{font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;color:#fff;flex-shrink:0}
        .rl-name{font-size:12px;font-weight:600;color:var(--txt)}
        .rl-pos{font-size:9.5px;color:var(--txt3);margin-left:auto}
        .rl-desc{font-size:10.5px;color:var(--txt2);line-height:1.4}
        .bottombar{flex-shrink:0;background:var(--bg2);border-top:1px solid var(--border);padding:8px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:var(--thumb-h)}
        .bb-group{display:flex;align-items:center;gap:5px;padding-right:10px;border-right:1px solid var(--border)}
        .bb-group:last-child{border-right:none}
        .bb-label{font-size:9px;text-transform:uppercase;letter-spacing:.6px;color:var(--txt3);font-weight:700;margin-right:2px;white-space:nowrap}
        .pen-btn{display:flex;align-items:center;gap:6px;padding:9px 13px;border-radius:var(--r);border:1.5px solid var(--border2);font-size:12.5px;cursor:pointer;font-family:inherit;font-weight:600;background:var(--card);color:var(--txt2);transition:all .15s;min-height:44px;min-width:44px;justify-content:center}
        .pen-btn:hover{border-color:var(--border2);background:var(--card2)}
        .pen-btn.on{background:var(--card2);border-color:var(--blue);color:var(--txt)}
        .color-swatch{width:26px;height:26px;border-radius:50%;border:2px solid var(--border2);cursor:pointer;flex-shrink:0;transition:all .12s;padding:0}
        .color-swatch.active{border-color:#fff;transform:scale(1.15)}
        .bb-action{display:flex;align-items:center;gap:6px;padding:10px 16px;border-radius:var(--r);border:1.5px solid var(--border2);font-size:13px;cursor:pointer;font-family:inherit;font-weight:700;background:var(--card);color:var(--txt2);transition:all .15s;min-height:44px;white-space:nowrap}
        .bb-action:hover{border-color:var(--blue);color:var(--blue2)}
        .bb-action.primary{background:linear-gradient(135deg,var(--green),#0d9668);border:none;color:#fff}
        .bb-action.primary:hover{opacity:.9}
        .reset-btn{margin-left:auto;position:relative;display:flex;align-items:center;gap:7px;padding:10px 16px;border-radius:var(--r);border:1.5px solid var(--border);font-size:12.5px;cursor:pointer;font-family:inherit;font-weight:600;background:var(--card);color:var(--txt3);transition:color .15s,border-color .15s;min-height:44px;overflow:hidden;user-select:none;-webkit-user-select:none}
        .reset-btn .reset-progress{position:absolute;top:0;left:0;bottom:0;width:0%;background:rgba(220,38,38,.35);transition:none;pointer-events:none}
        .reset-btn.holding{color:var(--red2);border-color:var(--red)}
        .reset-btn span, .reset-btn i{position:relative;z-index:1}
        .toast{position:fixed;bottom:calc(var(--thumb-h) + 18px);left:50%;transform:translateX(-50%) translateY(80px);background:var(--card);border:1px solid var(--border2);border-radius:var(--r2);padding:9px 17px;font-size:12px;box-shadow:var(--shadow);z-index:300;transition:transform .25s cubic-bezier(.34,1.56,.64,1),opacity .25s;opacity:0;pointer-events:none;display:flex;align-items:center;gap:8px;white-space:nowrap}
        .toast.show{transform:translateX(-50%) translateY(0);opacity:1}
        .t-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .gw-overlay{display:none;position:fixed;top:110px;left:50%;transform:translateX(-50%);background:var(--card);border:1.5px solid;border-radius:var(--r2);padding:11px 20px;z-index:50;min-width:210px;box-shadow:var(--shadow);text-align:center}
        .gw-overlay.show{display:block}
        .overlay{display:none;position:fixed;inset:0;background:rgba(3,7,13,.72);z-index:250;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
        .overlay.open{display:flex}
        .modal{background:var(--card);border:1px solid var(--border2);border-radius:var(--r2);width:390px;max-height:600px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 80px rgba(0,0,0,.6)}
        .modal.wide{width:520px}
        .mh{display:flex;align-items:center;padding:15px 17px;border-bottom:1px solid var(--border);background:var(--card2);gap:11px}
        .mbadge{width:40px;height:40px;border-radius:var(--r);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;flex-shrink:0;font-family:'JetBrains Mono',monospace}
        .mtitle{font-size:15px;font-weight:700}
        .msub{font-size:11.5px;color:var(--txt3);margin-top:2px}
        .mclose{margin-left:auto;background:none;border:none;cursor:pointer;font-size:19px;color:var(--txt3);line-height:1;padding:2px;flex-shrink:0}
        .mclose:hover{color:var(--txt)}
        .mb{overflow-y:auto;padding:13px 15px;flex:1}
        .rg{margin-bottom:15px}
        .rl{font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:var(--txt3);font-weight:700;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--border)}
        .ro{width:100%;text-align:left;padding:10px 12px;border-radius:var(--r);border:1px solid var(--border);background:var(--card2);cursor:pointer;margin-bottom:6px;display:flex;flex-direction:column;gap:4px;transition:all .12s;font-family:inherit}
        .ro:hover{background:var(--bg3);border-color:var(--border2)}
        .ro.sel{border-color:var(--blue);background:rgba(14,165,233,.08)}
        .ro-n{font-size:12.5px;font-weight:700;color:var(--txt);display:flex;align-items:center;gap:6px}
        .ro-d{font-size:11.5px;color:var(--txt2);line-height:1.45}
        .ro-tags{display:flex;gap:5px;margin-top:3px;flex-wrap:wrap}
        .ro-tag{font-size:9px;padding:1.5px 6px;border-radius:99px;font-weight:700;background:var(--bg3);color:var(--txt3)}
        .mf{padding:11px 15px;border-top:1px solid var(--border);display:flex;gap:8px;background:var(--card2)}
        .mf button{flex:1;font-size:12.5px;padding:9px;border-radius:var(--r);border:1px solid var(--border);cursor:pointer;font-family:inherit;font-weight:600;background:var(--card);color:var(--txt2);transition:all .12s}
        .mf button:hover{border-color:var(--border2);color:var(--txt)}
        .mf .ok{background:var(--blue);color:#fff;border-color:var(--blue)}
        .mf .ok:hover{background:#0284c7}
        .mf .danger{background:var(--red);color:#fff;border-color:var(--red)}
        .save-input-row{display:flex;flex-direction:column;gap:8px;margin-bottom:13px}
        .save-input-row label{font-size:12px;color:var(--txt2);font-weight:600}
        .save-input-row input{padding:9px 11px;border-radius:var(--r);border:1px solid var(--border2);background:var(--bg3);color:var(--txt);font-size:13px;font-family:inherit;outline:none}
        .save-input-row input:focus{border-color:var(--blue)}
        .save-item{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:var(--r);border:1px solid var(--border);background:var(--card2);margin-bottom:6px;cursor:pointer;transition:all .12s}
        .save-item:hover{border-color:var(--border2);background:var(--bg3)}
        .save-item-name{font-size:12.5px;font-weight:600;color:var(--txt);flex:1}
        .save-item-info{font-size:10.5px;color:var(--txt3);font-family:'JetBrains Mono',monospace}
        .save-item-del{font-size:14px;color:var(--txt3);cursor:pointer;padding:2px;flex-shrink:0;background:none;border:none}
        .save-item-del:hover{color:var(--red2)}
        .empty-saves{font-size:12.5px;color:var(--txt3);text-align:center;padding:20px 0;font-style:italic}
        .modal.chat-modal{width:420px;height:600px}
        .chat-apikey-row{display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--card2)}
        .chat-apikey-row input{flex:1;font-size:11.5px;padding:7px 9px;border-radius:var(--r);border:1px solid var(--border2);background:var(--bg3);color:var(--txt);font-family:'JetBrains Mono',monospace;outline:none}
        .chat-apikey-row input:focus{border-color:var(--purple)}
        .chat-apikey-row button{padding:7px 10px;border-radius:var(--r);border:1px solid var(--purple);background:rgba(124,58,237,.15);color:var(--purple2);font-size:11.5px;cursor:pointer;font-family:inherit;font-weight:600;white-space:nowrap}
        .chat-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}
        .chat-msg{max-width:85%;padding:9px 12px;border-radius:12px;font-size:12.5px;line-height:1.55;white-space:pre-wrap}
        .chat-msg.user{align-self:flex-end;background:var(--blue);color:#fff;border-bottom-right-radius:3px}
        .chat-msg.ai{align-self:flex-start;background:var(--card2);color:var(--txt2);border:1px solid var(--border);border-bottom-left-radius:3px}
        .chat-msg.ai b{color:var(--txt)}
        .chat-loading{align-self:flex-start;display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--txt3);padding:6px 4px}
        .chat-spinner{width:13px;height:13px;border:2px solid var(--border2);border-top-color:var(--purple2);border-radius:50%;animation:chatspin .7s linear infinite}
        @keyframes chatspin{to{transform:rotate(360deg)}}
        .chat-empty{text-align:center;padding:30px 20px;color:var(--txt3);font-size:12px;line-height:1.6}
        .chat-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 10px}
        .chat-chip{font-size:11px;padding:6px 11px;border-radius:99px;border:1px solid var(--border2);background:var(--card2);color:var(--txt2);cursor:pointer;transition:all .12s;white-space:nowrap}
        .chat-chip:hover{border-color:var(--purple);color:var(--purple2)}
        .chat-input-row{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--border);background:var(--card2)}
        .chat-input-row textarea{flex:1;resize:none;padding:9px 11px;border-radius:var(--r);border:1px solid var(--border2);background:var(--bg3);color:var(--txt);font-size:12.5px;font-family:inherit;outline:none;max-height:70px}
        .chat-input-row textarea:focus{border-color:var(--blue)}
        .chat-send-btn{padding:0 16px;border-radius:var(--r);border:none;background:linear-gradient(135deg,var(--purple),var(--blue));color:#fff;font-size:13px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0}
        .chat-send-btn:disabled{opacity:.5;cursor:not-allowed}
      `}</style>

      {/* ════ HEADER ════ */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">⚽</div>
          <div>
            <div className="logo-text">TacticBord</div>
            <div className="logo-sub">On-Field Coaching Mode (React)</div>
          </div>
        </div>
        <div className="header-mid">
          <select value={curFId} onChange={(e) => changeFormation(e.target.value)} className="fsel">
            <option value="433">4-3-3</option><option value="442">4-4-2</option>
            <option value="4231">4-2-3-1</option><option value="4132">4-1-3-2 Diamond</option>
            <option value="352">3-5-2</option><option value="343">3-4-3</option>
            <option value="541">5-4-1</option>
          </select>
        </div>
        <div className="header-right">
          <button className="hbtn settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)} aria-label="Menu pengaturan"><i className="ti ti-dots-vertical"></i></button>
          <div className={`settings-menu ${isSettingsOpen ? 'open' : ''}`}>
            <div className="sm-item" onClick={() => { setIsAIChatOpen(true); setIsSettingsOpen(false); }}><i className="ti ti-message-chatbot"></i>Asisten Taktik AI</div>
            <div className="sm-item" onClick={() => { setIsBrowserOpen(true); setIsSettingsOpen(false); }}><i className="ti ti-books"></i>Role Database (29 role)</div>
            <div className="sm-item" onClick={() => { exportJSON(); setIsSettingsOpen(false); }}><i className="ti ti-file-export"></i>Export JSON</div>
            <label className="sm-item"><i className="ti ti-file-import"></i>Import JSON<input type="file" accept=".json" onChange={(e) => { importJSON(e); setIsSettingsOpen(false); }} /></label>
          </div>
        </div>
      </header>

      {/* ════ PHASE TOOLBAR ════ */}
      <div className="phasebar">
        <span className="pb-label">Fase:</span>
        <button className={`phbtn ${phase === 'possession' ? 'on-poss' : ''}`} onClick={() => triggerPhase('possession')}><div className="dot" style={{background:'#0ea5e9'}}></div>⚽ In Poss</button>
        <button className={`phbtn ${phase === 'transition_pos' ? 'on-tp' : ''}`} onClick={() => triggerPhase('transition_pos')}><div className="dot" style={{background:'#d97706'}}></div>↗ Counter</button>
        <button className={`phbtn ${phase === 'transition_neg' ? 'on-tn' : ''}`} onClick={() => triggerPhase('transition_neg')}><div className="dot" style={{background:'#7c3aed'}}></div>🔄 Gegen</button>
        <button className={`phbtn ${phase === 'defense' ? 'on-def' : ''}`} onClick={() => triggerPhase('defense')}><div className="dot" style={{background:'#dc2626'}}></div>🛡 Out Poss</button>
        <div className="pb-right">
          <span className="mini-lbl">Speed:</span>
          <div className="spd-group">
            <button className={`spd ${simSpd === 0.5 ? 'on' : ''}`} onClick={() => setSimSpd(0.5)}>0.5×</button>
            <button className={`spd ${simSpd === 1 ? 'on' : ''}`} onClick={() => setSimSpd(1)}>1×</button>
            <button className={`spd ${simSpd === 2 ? 'on' : ''}`} onClick={() => setSimSpd(2)}>2×</button>
          </div>
          <button className={`ovbtn ${overlays.zone ? 'on' : ''}`} onClick={() => setOverlays(p => ({...p, zone: !p.zone}))}><i className="ti ti-layout-rows" style={{fontSize:13}}></i>Zona</button>
          <button className={`ovbtn ${overlays.pass ? 'on' : ''}`} onClick={() => setOverlays(p => ({...p, pass: !p.pass}))}><i className="ti ti-arrows-exchange" style={{fontSize:13}}></i>Pass</button>
        </div>
      </div>

      {/* ════ MAIN BODY ════ */}
      <div className="main">
        <div className="pitch-col">
          <div className="pitch-wrap">
            <canvas ref={mcRef} width={460} height={580} id="mc"
              onMouseDown={(e) => {
                const { sx, sy, rect } = getScale();
                if(onDown((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy)) e.preventDefault();
              }}
              onMouseMove={(e) => {
                const { sx, sy, rect } = getScale();
                onMove((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY);
              }}
              onMouseUp={(e) => {
                const { sx, sy, rect } = getScale();
                onUp((e.clientX - rect.left)*sx, (e.clientY - rect.top)*sy, e.clientX, e.clientY);
              }}
              onMouseLeave={() => {
                if(dragRef.current.id !== null) {
                  dragRef.current = { id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null };
                }
                renderPitch();
              }}
            />
            <canvas ref={drawcRef} width={460} height={580} id="drawc" className={drawTool !== 'select' ? 'pen-active' : ''}
              onMouseDown={(e) => { if(drawTool !== 'select') onDrawDown(e); }}
              onMouseMove={(e) => { if(drawRef.current.active && drawRef.current.currentPath) onDrawMove(e); }}
              onMouseUp={onDrawUp}
            />
          </div>
          <div className="hint-bar"><i className="ti ti-drag-drop" style={{fontSize:12, verticalAlign:'middle'}}></i> Seret pion (auto-ubah posisi) · Ketuk pilih peran</div>
          <div ref={trashRef} className={`trash-zone ${dragRef.current.id !== null ? 'show' : ''} ${dragRef.current.overTrash ? 'hover' : ''}`}><i className="ti ti-trash"></i></div>
          <div className={`gw-overlay ${isGwActive ? 'show' : ''}`} style={{borderColor: phase === 'transition_pos' ? '#d97706' : '#7c3aed'}}>
            <div style={{fontSize:11, fontWeight:700, marginBottom:4, color: phase === 'transition_pos' ? '#fbbf24' : '#a78bfa'}}>
              {phase === 'transition_pos' ? 'Golden Window — Counter-attack' : 'Golden Window — Gegenpressing'}
            </div>
            <div style={{fontSize:22, fontWeight:800, fontFamily:'"JetBrains Mono",monospace'}}>{gwRemain.toFixed(1)}s</div>
            <div className="gw-bar" style={{width:170, margin:'7px auto 0'}}><div className="gw-fill" style={{width:`${(gwRemain/6)*100}%`, background: phase === 'transition_pos' ? '#d97706' : '#7c3aed'}}></div></div>
          </div>
        </div>

        {/* ════ SIDEBAR ════ */}
        <div className="sidebar">
          <div className="sbtabs">
            <div className={`sbtab ${activeTab === 'sim' ? 'active' : ''}`} onClick={() => setActiveTab('sim')}>SIMULASI</div>
            <div className={`sbtab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>TIM</div>
            <div className={`sbtab ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>ROLE DB</div>
          </div>

          {activeTab === 'sim' && (
            <div className="sbscroll">
              <div className="sc">
                <div className="sh"><i className="ti ti-activity"></i>Status Simulasi</div>
                <div className="sb">
                  {phase ? (
                    <>
                      <div className={`phase-badge ${phase==='possession'?'pbadge-poss':phase==='transition_pos'?'pbadge-tp':phase==='transition_neg'?'pbadge-tn':'pbadge-def'}`}>
                        {phase==='possession' && '⚽ In Possession'}
                        {phase==='transition_pos' && '↗ Counter-attack (Golden Window)'}
                        {phase==='transition_neg' && '🔄 Gegenpressing (Golden Window)'}
                        {phase==='defense' && '🛡 Out of Possession'}
                      </div>
                      <div id="phase-rows">
                        {phase === 'possession' && [
                          ['Width & depth dihitung dari width_tendency/depth_tendency role','#0ea5e9'],
                          ['overlap → dorong lebar; underlap → masuk half-space','#38bdf8'],
                          ['drops_deep=true → role narik mundur (False Nine, Enganche, dst)','#a78bfa']
                        ].map(([txt,col], idx) => <div key={idx} className="info-row"><i className="ti ti-arrow-right" style={{color:col, fontSize:13}}></i><span style={{color:col}}>{txt}</span></div>)}
                        {phase === 'transition_pos' && [
                          ['attacking_run=true → sprint depth+0.12, delay 0.05s','#fbbf24'],
                          ['pressing=hold → tetap jadi jangkar build-up cepat','#d97706'],
                          ['6 detik kritis untuk eksploitasi ruang kosong','#92400e']
                        ].map(([txt,col], idx) => <div key={idx} className="info-row"><i className="ti ti-arrow-right" style={{color:col, fontSize:13}}></i><span style={{color:col}}>{txt}</span></div>)}
                        {phase === 'transition_neg' && [
                          ['pressing=immediate → maju & sprint rebut bola','#a78bfa'],
                          ['pressing=delayed → geser moderat, jaga jarak','#7c3aed'],
                          ['pressing=hold → bek/anchor tetap di posisi','#4c1d95']
                        ].map(([txt,col], idx) => <div key={idx} className="info-row"><i className="ti ti-arrow-right" style={{color:col, fontSize:13}}></i><span style={{color:col}}>{txt}</span></div>)}
                        {phase === 'defense' && [
                          ['Compactness: width ×0.55, depth ditarik dalam','#f87171'],
                          ['fills_space=true → cover ruang partner yang naik','#dc2626'],
                          ['Seluruh unit merapat membentuk blok pertahanan','#991b1b']
                        ].map(([txt,col], idx) => <div key={idx} className="info-row"><i className="ti ti-arrow-right" style={{color:col, fontSize:13}}></i><span style={{color:col}}>{txt}</span></div>)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="phase-badge pbadge-base">⬛ Posisi Dasar</div>
                      <div><div className="hint"><b>Pilih fase</b> untuk melihat pergerakan tiap role dihitung dari width/depth tendency dan flags taktisnya masing-masing.</div></div>
                    </>
                  )}
                </div>
              </div>

              <div className="sc">
                <div className="sh"><i className="ti ti-map"></i>Peta Zona (54 titik)</div>
                <div className="sb" style={{padding:'6px 10px'}}>
                  <div className="zone-bar" style={{background:'rgba(220,38,38,.12)',color:'#f87171'}}>attacking_box · zone_14</div>
                  <div className="zone-bar" style={{background:'rgba(234,88,12,.10)',color:'#fb923c'}}>zone_10 · half_space_inner</div>
                  <div className="zone-bar" style={{background:'rgba(99,102,241,.12)',color:'#a5b4fc'}}>central_corridor</div>
                  <div className="zone-bar" style={{background:'rgba(124,58,237,.10)',color:'#c4b5fd'}}>half_space_outer · mid_block</div>
                  <div className="zone-bar" style={{background:'rgba(8,145,178,.10)',color:'#67e8f9'}}>defensive_wide · low_block</div>
                  <div className="zone-bar" style={{background:'rgba(37,99,235,.12)',color:'#93c5fd'}}>deep_build_up · own_penalty</div>
                </div>
              </div>

              <div className="sc">
                <div className="sh"><i className="ti ti-users"></i>Komposisi Tim</div>
                <div className="sb">
                  {['GK','CB','FB','WB','DM','CM','AM','W','CF'].map(pt => (
                    <div key={pt} className="sum-row">
                      <span style={{display:'flex', alignItems:'center'}}><span className="sum-dot" style={{background:TC[pt]}}></span>{pt}</span>
                      <span className="sum-val">{`${compStats.cnt[pt]||0}/${compStats.tot[pt]||0}`}</span>
                    </div>
                  ))}
                  <div style={{marginTop:7, paddingTop:7, borderTop:'1px solid var(--border)'}}>
                    <div className="sum-row" style={{border:'none', margin:0}}><span>Peran terisi</span><span className="sum-val">{`${compStats.filled}/${players.length}`}</span></div>
                    <div className="pbar"><div className="pfill" style={{width:`${(compStats.filled/players.length)*100}%`}}></div></div>
                  </div>
                </div>
              </div>

              {selectedPlayer && assignedRoles[selectedPlayer.id] && (
                <div className="sc">
                  <div className="sh"><i className="ti ti-user-check"></i>Peran Aktif</div>
                  <div className="sb">
                    {(() => {
                      const r = getRole(assignedRoles[selectedPlayer.id]);
                      if(!r) return null;
                      const col = TC[selectedPlayer.posType] || '#888';
                      return (
                        <>
                          <div className="role-name">{r.name}</div>
                          <div className="role-desc">{r.desc}</div>
                          <div>
                            <span className="role-tag" style={{background:`${col}22`, color:col, borderColor:`${col}55`}}>{r.posType}</span>
                            <span className="role-tag" style={{background:'#ffffff11', color:'var(--txt2)', borderColor:'var(--border2)'}}>{r.pressing}</span>
                            {r.overlap !== 'none' && <span className="role-tag" style={{background:'#ffffff11', color:'var(--txt2)', borderColor:'var(--border2)'}}>{r.overlap}</span>}
                          </div>
                          <div className="attr-grid">
                            <div className="attr-item"><div className="attr-lbl">Width</div><div className="attr-val">{r.width}</div></div>
                            <div className="attr-item"><div className="attr-lbl">Depth</div><div className="attr-val">{r.depth}</div></div>
                            <div className="attr-item"><div className="attr-lbl">Attacking Run</div><div className="attr-val">{r.attackingRun?'Ya':'Tidak'}</div></div>
                            <div className="attr-item"><div className="attr-lbl">Drops Deep</div><div className="attr-val">{r.dropsDeep?'Ya':'Tidak'}</div></div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="sc">
                <div className="sh"><i className="ti ti-color-swatch"></i>Legenda</div>
                <div className="sb">
                  {[
                    ['GK','Kiper'],['CB','Bek Tengah'],['FB','Bek Sayap'],['WB','Wing-back'],
                    ['DM','Gelandang Bertahan'],['CM','Gelandang Tengah'],['AM','Gelandang Serang'],
                    ['W','Winger'],['CF','Striker']
                  ].map(([pt, desc]) => (
                    <div key={pt} className="leg-item"><div className="ldot" style={{background:TC[pt]}}></div>{`${pt} — ${desc}`}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="sbscroll">
              <div className="sc">
                <div className="sh"><i className="ti ti-clipboard-list"></i>Susunan Pemain</div>
                <div className="sb">
                  {players.map(p => {
                    const r = getRole(assignedRoles[p.id]);
                    const col = TC[p.posType];
                    return (
                      <div key={p.id} className="rl-card" onClick={() => { setSelectedPlayer(p); setPendingRole(assignedRoles[p.id] || null); }} style={{cursor:'pointer'}}>
                        <div className="rl-head">
                          <span className="rl-badge" style={{background:col}}>{POS_LABEL[p.posType]}</span>
                          <span className="rl-name">{r ? r.name : '— Belum ada peran —'}</span>
                        </div>
                        {r && <div className="rl-desc">{r.desc}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="sbscroll">
              <input type="text" className="rolelist-search" value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} placeholder="Cari role (mis: winger, press, false)..." />
              <div>
                {ROLE_MASTER.filter(r => !roleSearch || r.name.toLowerCase().includes(roleSearch.toLowerCase()) || r.desc.toLowerCase().includes(roleSearch.toLowerCase()) || r.posType.toLowerCase().includes(roleSearch.toLowerCase())).map(r => (
                  <div key={r.id} className="rl-card">
                    <div className="rl-head">
                      <span className="rl-badge" style={{background:TC[r.posType]}}>{r.short}</span>
                      <span className="rl-name">{r.name}</span>
                      <span className="rl-pos">{r.posType}</span>
                    </div>
                    <div className="rl-desc">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════ BOTTOM ACTION BAR ════ */}
      <div className="bottombar">
        <div className="bb-group">
          <span className="bb-label">Spidol:</span>
          <button className={`pen-btn ${drawTool === 'select' ? 'on' : ''}`} onClick={() => setDrawTool('select')} aria-label="Mode pilih/geser"><i className="ti ti-pointer"></i></button>
          <button className={`pen-btn ${drawTool === 'pen' ? 'on' : ''}`} onClick={() => setDrawTool('pen')} aria-label="Alat spidol bebas"><i className="ti ti-pencil"></i></button>
          <button className={`pen-btn ${drawTool === 'arrow' ? 'on' : ''}`} onClick={() => setDrawTool('arrow')} aria-label="Alat panah"><i className="ti ti-arrow-up-right"></i></button>
          <button className={`color-swatch ${drawColor === '#fbbf24' ? 'active' : ''}`} style={{background:'#fbbf24'}} onClick={() => setDrawColor('#fbbf24')} aria-label="Warna kuning"></button>
          <button className={`color-swatch ${drawColor === '#ffffff' ? 'active' : ''}`} style={{background:'#ffffff'}} onClick={() => setDrawColor('#ffffff')} aria-label="Warna putih"></button>
          <button className={`color-swatch ${drawColor === '#ff3333' ? 'active' : ''}`} style={{background:'#ff3333'}} onClick={() => setDrawColor('#ff3333')} aria-label="Warna merah"></button>
          <button className="pen-btn" onClick={clearDrawings} aria-label="Hapus coretan"><i className="ti ti-eraser"></i></button>
        </div>
        <div className="bb-group">
          <button className="bb-action primary" onClick={() => setIsSaveOpen(true)}><i className="ti ti-device-floppy"></i> Simpan</button>
          <button className="bb-action" onClick={() => setIsLoadOpen(true)}><i className="ti ti-folder-open"></i> Muat</button>
        </div>
        <button className={`reset-btn ${isHoldingReset ? 'holding' : ''}`}
          onMouseDown={startHoldReset} onMouseUp={cancelHoldReset} onMouseLeave={cancelHoldReset}
          onTouchStart={startHoldReset} onTouchEnd={cancelHoldReset}
        >
          <div className="reset-progress" style={{width: `${resetHoldProgress}%`}}></div>
          <i className="ti ti-refresh"></i><span>Tahan 1s untuk Reset</span>
        </button>
      </div>

      {/* ════ TOAST ════ */}
      <div className={`toast ${toastData.show ? 'show' : ''}`}>
        <div className="t-dot" style={{background: toastData.col}}></div>
        <span>{toastData.msg}</span>
      </div>

      {/* ════ ROLE ASSIGN MODAL ════ */}
      {selectedPlayer && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setSelectedPlayer(null); }}>
          <div className="modal">
            <div className="mh">
              <div className="mbadge" style={{background: TC[selectedPlayer.posType], fontSize:13}}>{POS_LABEL[selectedPlayer.posType]}</div>
              <div>
                <div className="mtitle">{`Pilih Peran — ${POS_LABEL[selectedPlayer.posType]}`}</div>
                <div className="msub">{`${rolesForPosType(selectedPlayer.posType).length} role tersedia untuk posisi ${selectedPlayer.posType}`}</div>
              </div>
              <button className="mclose" onClick={() => setSelectedPlayer(null)}>&#x2715;</button>
            </div>
            <div className="mb">
              <div className="rg">
                <div className="rl">{`Semua Role ${selectedPlayer.posType}`}</div>
                {rolesForPosType(selectedPlayer.posType).map(r => (
                  <button key={r.id} className={`ro ${pendingRole === r.id ? 'sel' : ''}`} onClick={() => setPendingRole(r.id)}>
                    <div className="ro-n"><span style={{background:TC[r.posType], color:'#fff', fontSize:9, fontWeight:800, padding:'1px 5px', borderRadius:4}}>{r.short}</span>{r.name}</div>
                    <div className="ro-d">{r.desc}</div>
                    <div className="ro-tags">
                      <span className="ro-tag">{`width ${r.width}`}</span><span className="ro-tag">{`depth ${r.depth}`}</span>
                      <span className="ro-tag">{r.pressing}</span>
                      {r.overlap !== 'none' && <span className="ro-tag">{r.overlap}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mf">
              <button onClick={() => {
                setAssignedRoles(prev => { const next = {...prev}; delete next[selectedPlayer.id]; return next; });
                setSelectedPlayer(null);
              }}><i className="ti ti-eraser"></i> Hapus Peran</button>
              <button className="ok" onClick={() => {
                if(pendingRole) setAssignedRoles(prev => ({...prev, [selectedPlayer.id]: pendingRole}));
                setSelectedPlayer(null);
              }}>Simpan Peran</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ ROLE BROWSER MODAL ════ */}
      {isBrowserOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsBrowserOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:24}}>📚</div>
              <div><div className="mtitle">Role Database</div><div className="msub">29 role lengkap dengan atribut taktis</div></div>
              <button className="mclose" onClick={() => setIsBrowserOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              {['GK','DEF','MID','FWD'].map(group => {
                const groupNames = {GK:'Kiper',DEF:'Bertahan',MID:'Gelandang',FWD:'Penyerang'};
                const roles = ROLE_MASTER.filter(r => r.posGroup === group);
                if(!roles.length) return null;
                return (
                  <div key={group} className="rg">
                    <div className="rl">{`${groupNames[group]} (${roles.length})`}</div>
                    {roles.map(r => (
                      <div key={r.id} className="rl-card">
                        <div className="rl-head">
                          <span className="rl-badge" style={{background:TC[r.posType]}}>{r.short}</span>
                          <span className="rl-name">{r.name}</span>
                          <span className="rl-pos">{`${r.posType} · ${r.side}`}</span>
                        </div>
                        <div className="rl-desc">{r.desc}</div>
                        <div className="ro-tags" style={{marginTop:5}}>
                          <span className="ro-tag">{`width ${r.width}`}</span><span className="ro-tag">{`depth ${r.depth}`}</span>
                          <span className="ro-tag">{r.pressing}</span>
                          {r.attackingRun && <span className="ro-tag">attacking run</span>}
                          {r.dropsDeep && <span className="ro-tag">drops deep</span>}
                          {r.overlap !== 'none' && <span className="ro-tag">{r.overlap}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="mf"><button onClick={() => setIsBrowserOpen(false)}>Tutup</button></div>
          </div>
        </div>
      )}

      {/* ════ SAVE MODAL ════ */}
      {isSaveOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsSaveOpen(false); }}>
          <div className="modal">
            <div className="mh">
              <div style={{fontSize:22}}>💾</div>
              <div><div className="mtitle">Simpan Taktik</div><div className="msub">Tersimpan lokal di browser</div></div>
              <button className="mclose" onClick={() => setIsSaveOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              <div className="save-input-row">
                <label>Nama taktik</label>
                <input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="cth: High Press 4-3-3" maxLength={60} />
              </div>
              <div className="save-input-row">
                <label>Catatan (opsional)</label>
                <input type="text" value={saveNote} onChange={(e) => setSaveNote(e.target.value)} placeholder="cth: Untuk lawan bertahan rendah" />
              </div>
            </div>
            <div className="mf">
              <button onClick={() => setIsSaveOpen(false)}>Batal</button>
              <button className="ok" onClick={saveTacticToStorage}><i className="ti ti-device-floppy"></i> Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ LOAD MODAL ════ */}
      {isLoadOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsLoadOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:22}}>📂</div>
              <div><div className="mtitle">Muat Taktik</div><div className="msub">Pilih taktik tersimpan</div></div>
              <button className="mclose" onClick={() => setIsLoadOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb" style={{minHeight:120}}>
              {(() => {
                const saves = JSON.parse(localStorage.getItem('tacticbord_v2') || '[]');
                if(!saves.length) return <div className="empty-saves">Belum ada taktik tersimpan.</div>;
                return saves.map((s, idx) => (
                  <div key={idx} className="save-item" onClick={() => loadTacticFromStorage(idx)}>
                    <div style={{fontSize:20}}>📋</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div className="save-item-name">{s.name}</div>
                      <div className="save-item-info">{`${s.formationName||s.formation} · ${s.note?s.note+' · ':''}${new Date(s.savedAt).toLocaleDateString('id-ID')}`}</div>
                    </div>
                    <button className="save-item-del" onClick={(e) => deleteSaveFromStorage(e, idx)}><i className="ti ti-trash"></i></button>
                  </div>
                ));
              })()}
            </div>
            <div className="mf"><button onClick={() => setIsLoadOpen(false)}>Tutup</button></div>
          </div>
        </div>
      )}

      {/* ════ AI CHAT MODAL ════ */}
      {isAIChatOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsAIChatOpen(false); }}>
          <div className="modal chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mh">
              <div style={{fontSize:22}}>🤖</div>
              <div><div className="mtitle">Asisten Taktik AI</div><div className="msub">Bertanya soal saran & solusi taktis</div></div>
              <button className="mclose" onClick={() => setIsAIChatOpen(false)}>&#x2715;</button>
            </div>
            <div className="chat-apikey-row">
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-... (API Key Anthropic)" />
              <button onClick={saveChatAPIKey}>Simpan Key</button>
            </div>
            <div className="chat-log">
              {chatHistory.length === 0 && (
                <div className="chat-empty">
                  💡 Tanyakan apa saja soal taktik yang sedang kamu susun —<br/>
                  kelemahan formasi, saran peran, atau cara hadapi lawan tertentu.<br/>
                  Asisten ini membaca formasi & peran yang sedang aktif di papan.
                </div>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} className={`chat-msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                  {m.role === 'user' ? m.content : <span dangerouslySetInnerHTML={{ __html: m.content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>') }} />}
                </div>
              ))}
              {chatBusy && (
                <div className="chat-loading">
                  <div className="chat-spinner"></div><span>Menganalisis taktik...</span>
                </div>
              )}
            </div>
            <div className="chat-chips">
              <button className="chat-chip" onClick={() => sendChatMessage('Analisis kelemahan utama formasi dan peran yang sudah saya susun ini.')}>Analisis kelemahan formasi</button>
              <button className="chat-chip" onClick={() => sendChatMessage('Beri saran peran yang cocok untuk posisi yang belum saya isi.')}>Saran peran kosong</button>
              <button className="chat-chip" onClick={() => sendChatMessage('Apa risiko taktik ini saat fase Gegenpressing?')}>Risiko saat gegenpress</button>
            </div>
            <div className="chat-input-row">
              <textarea rows={1} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tulis pertanyaan taktikmu..." onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }} />
              <button className="chat-send-btn" disabled={chatBusy} onClick={() => sendChatMessage()}><i className="ti ti-send"></i></button>
            </div>
          </div>
        </div>
      )}

      {/* ════ RESET CONFIRM MODAL ════ */}
      {isResetConfirmOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsResetConfirmOpen(false); }}>
          <div className="modal">
            <div className="mh">
              <div style={{fontSize:22}}>⚠️</div>
              <div><div className="mtitle">Reset Formasi?</div><div className="msub">Semua peran & posisi akan kembali ke awal</div></div>
              <button className="mclose" onClick={() => setIsResetConfirmOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb"><p style={{fontSize:12.5, color:'var(--txt2)', lineHeight:1.6}}>Tindakan ini akan menghapus seluruh peran yang sudah diberikan dan mengembalikan posisi pemain ke formasi dasar. Coretan spidol tidak terpengaruh.</p></div>
            <div class="mf">
              <button onClick={() => setIsResetConfirmOpen(false)}>Batal</button>
              <button className="danger" onClick={doFullReset}><i className="ti ti-refresh"></i> Ya, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}