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

// ════════════════════════════════════════════════════════
// PRESET GAYA BERMAIN
// ════════════════════════════════════════════════════════
const STYLE_PRESETS = {
  tiki_taka: {
    name: 'Tiki-Taka',
    emoji: '🔴🔵',
    formation: '433',
    desc: 'Penguasaan bola tinggi, segitiga pendek rapat, false nine, sabar membongkar blok pertahanan lawan.',
    roles: {
      0:'sweeper_keeper', 1:'inverted_full_back', 2:'ball_playing_defender',
      3:'ball_playing_defender', 4:'inverted_full_back', 5:'regista',
      6:'mezzala', 7:'mezzala', 8:'inverted_winger', 9:'false_nine', 10:'inverted_winger',
    },
    modifiers: { widthMult: 0.85, depthMult: 1.00, tempoMult: 0.85, pressBoost: 0.05 },
  },
  total_football: {
    name: 'Total Football',
    emoji: '🟠',
    formation: '433',
    desc: 'Setiap pemain bisa bertukar posisi kapan saja — universalitas penuh, garis pertahanan tinggi, penguasaan ruang fluid.',
    roles: {
      0:'sweeper_keeper', 1:'full_back', 2:'libero',
      3:'ball_playing_defender', 4:'full_back', 5:'half_back',
      6:'roaming_playmaker', 7:'box_to_box_midfielder', 8:'inside_forward', 9:'complete_forward', 10:'inside_forward',
    },
    modifiers: { widthMult: 1.08, depthMult: 1.05, tempoMult: 0.85, pressBoost: 0.08 },
  },
  gegenpressing: {
    name: 'Gegenpressing',
    emoji: '🔴',
    formation: '433',
    desc: 'Rebut bola secepat mungkin dalam 5 detik pertama setelah kehilangan — intensitas pressing tertinggi, transisi vertikal cepat.',
    roles: {
      0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender',
      3:'ball_playing_defender', 4:'full_back', 5:'ball_winning_midfielder',
      6:'box_to_box_midfielder', 7:'roaming_playmaker', 8:'inside_forward', 9:'pressing_forward', 10:'inside_forward',
    },
    modifiers: { widthMult: 1.00, depthMult: 1.10, tempoMult: 0.65, pressBoost: 0.18 },
  },
  kick_and_rush: {
    name: 'Kick and Rush',
    emoji: '⚪',
    formation: '442',
    desc: 'Direct football — lewati lini tengah secepatnya lewat bola panjang ke target man, minim buildup, fisik & agresif.',
    roles: {
      0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender',
      3:'ball_playing_defender', 4:'full_back', 5:'wide_target_man',
      6:'box_to_box_midfielder', 7:'box_to_box_midfielder', 8:'wide_target_man', 9:'target_forward', 10:'poacher',
    },
    modifiers: { widthMult: 1.12, depthMult: 1.00, tempoMult: 0.60, pressBoost: 0.00 },
  },
  catenaccio: {
    name: 'Catenaccio',
    emoji: '🔵⚫',
    formation: '541',
    desc: 'Sistem sweeper (libero) di belakang trio bek, sangat disiplin & kompak, menunggu momen counter-attack yang klinis.',
    roles: {
      0:'sweeper_keeper', 1:'inverted_wing_back', 2:'ball_playing_defender',
      3:'libero', 4:'ball_playing_defender', 5:'inverted_wing_back',
      6:'carrilero', 7:'anchor_man', 8:'anchor_man', 9:'carrilero', 10:'poacher',
    },
    modifiers: { widthMult: 0.75, depthMult: 0.60, tempoMult: 1.15, pressBoost: -0.12 },
  },
  parkir_bus: {
    name: 'Parkir Bus',
    emoji: '🚌',
    formation: '4231',
    desc: 'Bertahan total — seluruh unit turun sangat dalam, blok sangat rapat, minim ambisi menyerang, tunggu satu peluang counter.',
    roles: {
      0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender',
      3:'ball_playing_defender', 4:'full_back', 5:'anchor_man',
      6:'anchor_man', 7:'wide_target_man', 8:'enganche', 9:'wide_target_man', 10:'poacher',
    },
    modifiers: { widthMult: 0.65, depthMult: 0.45, tempoMult: 1.30, pressBoost: -0.20 },
  },
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
function computePlayerTarget(player, role, phase, styleModifier) {
  if(!role || player.posType === 'GK') {
    let y = 0.91;
    if(role) {
      if(role.id === 'sweeper_keeper') y = phase === 'defense' ? 0.86 : 0.80;
      if(role.id === 'ball_playing_gk') y = phase === 'possession' ? 0.82 : 0.89;
    }
    if(phase === 'transition_neg') y = 0.90;
    if(styleModifier) y = 0.90 - (0.90 - y) * (styleModifier.depthMult ?? 1);
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
    if(styleModifier?.pressBoost) {
      depth = Math.max(0, Math.min(1, depth + styleModifier.pressBoost));
    }
  } else if(phase === 'defense') {
    width = width * 0.55;
    depth = Math.max(0, depth - 0.45);
    delay = 0.1; duration = 0.9; easing = 'ease-in-out';
    if(role.fillsSpace) {
      depth = Math.max(0, depth - 0.05);
    }
  }

  if(styleModifier) {
    width = Math.max(0, Math.min(1, width * (styleModifier.widthMult ?? 1)));
    depth = Math.max(0, Math.min(1, depth * (styleModifier.depthMult ?? 1)));
    duration = duration * (styleModifier.tempoMult ?? 1);
    delay = delay * (styleModifier.tempoMult ?? 1);
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
  const [activeStyleId, setActiveStyleId] = useState(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
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

  // Zoom State
  const [zoom, setZoom] = useState(1);

  // ── REFS UNTUK PERFORMANCE (CANVAS & ANIMATION LOOP) ──
  const mcRef = useRef(null);
  const drawcRef = useRef(null);
  const trashRef = useRef(null);

  // Mutable State untuk Drag & Animasi
  const dragRef = useRef({ id: null, dOX: 0, dOY: 0, dragging: false, moved: false, preview: null, overTrash: false, hoverId: null });
  const animRef = useRef({ pAnim: {}, running: false, start: null, rafId: null });
  const drawRef = useRef({ active: false, currentPath: null });

  // Sinkronisasi ref dengan state agar loop canvas dapat membacanya tanpa closure stale
  const stateRef = useRef({ players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId });
  useEffect(() => {
    stateRef.current = { players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId };
  }, [players, assignedRoles, overlays, phase, simSpd, drawingPaths, drawTool, drawColor, activeStyleId]);

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
    const { players: curPlayers, assignedRoles: curRoles, simSpd: curSpd, activeStyleId: curStyleId } = stateRef.current;
    const styleMod = curStyleId ? STYLE_PRESETS[curStyleId]?.modifiers : null;
    const targets = {};
    curPlayers.forEach(p => {
      const r = getRole(curRoles[p.id]);
      targets[p.id] = computePlayerTarget(p, r, ph, styleMod);
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
    setActiveStyleId(null);
    const newPlayers = FORMATIONS[fid].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
    setPlayers(newPlayers);
  };

  const applyStyle = (styleId) => {
    const style = STYLE_PRESETS[styleId];
    if(!style) return;
    stopSim();
    setCurFId(style.formation);
    const newPlayers = FORMATIONS[style.formation].players.map(p => ({ ...p, cx: gx(p.x), cy: gy(p.y) }));
    setPlayers(newPlayers);
    setAssignedRoles({ ...style.roles });
    setActiveStyleId(styleId);
    setIsStyleModalOpen(false);
    showToast(`Gaya bermain diterapkan: ${style.name}`, '#16a34a');
  };

  const clearStyle = () => {
    setActiveStyleId(null);
    showToast('Gaya bermain dilepas — role tetap tersimpan', '#6b7280');
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

  // ── AI TACTICAL ASSISTANT ──
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

    const newHistory = [...chatHistory, { role: 'user', content: textToSend.trim() }];
    setChatHistory(newHistory);
    if(!customText) setChatInput('');
    setChatBusy(true);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787';

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          tacticContext: buildTacticContext(),
          sessionId: crypto.randomUUID(),
        }),
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch(err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message || 'Gagal menghubungi asisten AI. Periksa apakah backend sudah jalan dan VITE_BACKEND_URL sudah benar.'}` }]);
    } finally {
      setChatBusy(false);
    }
  };

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
          --bg:#09090b;--bg2:#18181b;--bg3:#27272a;--card:#18181b;--card2:#27272a;
          --border:#27272a;--border2:#3f3f46;
          --txt:#f4f4f5;--txt2:#a1a1aa;--txt3:#71717a;
          --green:#22c55e;--green2:#4ade80;
          --blue:#3b82f6;--blue2:#60a5fa;
          --amber:#f59e0b;--amber2:#fbbf24;
          --purple:#8b5cf6;--purple2:#a78bfa;
          --red:#ef4444;--red2:#f87171;
          --cyan:#06b6d4;--orange:#f97316;--indigo:#6366f1;
          --r:12px;--r2:24px;
          --shadow:0 8px 32px rgba(0,0,0,.25);
          --thumb-h:72px;
        }
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;font-family:'Poppins',system-ui,-apple-system,sans-serif;}
        body{background:var(--bg);color:var(--txt);font-size:14px;overflow:hidden;user-select:none;touch-action:none}
        
        /* Modern Scrollbar */
        ::-webkit-scrollbar{width:0px;height:0px;display:none;}
        
        .app-container{display:flex;flex-direction:column;height:100vh;position:relative;}
        
        /* Sleek Header */
        .header{background:var(--bg);padding:12px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0;z-index:10;}
        .logo{display:flex;align-items:center;gap:8px}
        .logo-icon{width:32px;height:32px;background:linear-gradient(135deg,var(--blue),var(--purple));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .logo-text{font-size:18px;font-weight:700;letter-spacing:-.5px;color:#fff;}
        .logo-sub{display:none;} /* Hidden for mobile app look */
        
        .header-mid{margin-left:6px;display:flex;align-items:center;gap:6px;}
        .fsel{font-size:13px;padding:8px 12px;border-radius:var(--r);border:1px solid var(--border);background:var(--card);color:var(--txt);font-weight:600;appearance:none;outline:none;}
        .style-trigger-btn{background:rgba(139,92,246,.1);border:none;color:var(--purple2);}
        .style-trigger-btn:hover{background:rgba(139,92,246,.2);}
        .style-clear-btn{padding:8px;color:var(--txt3);border:none;background:transparent;}
        
        .header-right{margin-left:auto;display:flex;align-items:center;gap:6px;position:relative}
        .hbtn{display:flex;align-items:center;gap:5px;padding:8px 14px;border-radius:var(--r);border:none;font-size:13px;cursor:pointer;font-weight:500;background:var(--card);color:var(--txt);transition:all .15s}
        .settings-btn{width:36px;height:36px;padding:0;justify-content:center;font-size:18px;border-radius:50%;background:transparent;color:var(--txt2);}
        
        .settings-menu{display:none;position:absolute;top:46px;right:0;background:var(--card);border:1px solid var(--border2);border-radius:16px;box-shadow:var(--shadow);min-width:210px;z-index:150;overflow:hidden}
        .settings-menu.open{display:block}
        .sm-item{display:flex;align-items:center;gap:10px;padding:14px 16px;font-size:13px;color:var(--txt);cursor:pointer;border-bottom:1px solid var(--border);font-weight:500}
        .sm-item:last-child{border-bottom:none}
        .sm-item input[type=file]{display:none}
        
        /* Modern Scrollable Phasebar */
        .phasebar{background:var(--bg);padding:4px 12px 12px;display:flex;gap:8px;align-items:center;overflow-x:auto;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
        .phasebar::-webkit-scrollbar{display:none;}
        .pb-label{display:none;} /* Minimalist */
        .phbtn{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:24px;border:1px solid transparent;font-size:12.5px;cursor:pointer;font-weight:600;background:var(--card);color:var(--txt2);transition:all .2s;white-space:nowrap;flex-shrink:0;}
        .phbtn .dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
        .phbtn.on-poss{background:rgba(59,130,246,.15);color:var(--blue2);}
        .phbtn.on-tp{background:rgba(245,158,11,.15);color:var(--amber2);}
        .phbtn.on-tn{background:rgba(139,92,246,.15);color:var(--purple2);}
        .phbtn.on-def{background:rgba(239,68,68,.15);color:var(--red2);}
        .pb-right{margin-left:auto;display:flex;align-items:center;gap:6px;}
        .mini-lbl{display:none;}
        
        .spd-group{display:flex;border-radius:24px;overflow:hidden;background:var(--card);padding:2px;}
        .spd{padding:8px 14px;font-size:12px;cursor:pointer;background:transparent;color:var(--txt3);border:none;font-weight:600;border-radius:22px;}
        .spd.on{background:var(--bg3);color:var(--txt);}
        .ovbtn{display:flex;align-items:center;gap:4px;padding:8px 12px;border-radius:24px;border:none;font-size:12px;cursor:pointer;background:var(--card);color:var(--txt3);font-weight:600;}
        .ovbtn.on{background:var(--txt);color:var(--bg);}
        
        /* Central Pitch Area */
        .pitch-col{flex:1;display:flex;align-items:center;justify-content:center;padding:4px 8px 84px;overflow:hidden;position:relative;background:var(--bg);}
        
        .pitch-wrap{position:relative;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 16px 48px rgba(0,0,0,0.5);width:100%;max-width:900px;max-height:calc(100vh - 220px);aspect-ratio:460/580;margin:auto;display:flex;align-items:center;justify-content:center;background:#131824;}
        
        .canvas-zoom-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
          transform-origin: center center;
        }

        .zoom-controls {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 50;
          background: rgba(24, 24, 27, 0.8);
          backdrop-filter: blur(8px);
          padding: 8px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .zoom-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--card);
          color: var(--txt);
          border: none;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .zoom-btn:hover { background: var(--border2); }

        canvas#mc,canvas#drawc{display:block;width:100%;height:100%;touch-action:none;object-fit:contain}
        canvas#mc{cursor:grab}
        canvas#drawc{position:absolute;top:0;left:0;pointer-events:none}
        canvas#drawc.pen-active{pointer-events:auto;cursor:crosshair}
        .hint-bar{position:absolute;top:12px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(255,255,255,0.7);background:rgba(0,0,0,0.5);padding:6px 14px;border-radius:24px;white-space:nowrap;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.05);}
        
        .trash-zone{position:absolute;bottom:80px;left:50%;transform:translateX(-50%) scale(.8);width:56px;height:56px;border-radius:50%;background:rgba(239,68,68,.1);border:1.5px dashed var(--red2);display:flex;align-items:center;justify-content:center;font-size:24px;opacity:0;pointer-events:none;transition:all .2s;z-index:40;}
        .trash-zone.show{opacity:1;transform:translateX(-50%) scale(1);}
        .trash-zone.hover{background:rgba(239,68,68,.3);transform:translateX(-50%) scale(1.15);border-color:#fff;}
        
        /* Floating Bottom Action Bar */
        .bottombar{position:absolute;bottom:16px;left:16px;right:16px;background:rgba(24,24,27,0.8);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.08);border-radius:32px;padding:8px;display:flex;align-items:center;justify-content:space-between;z-index:20;box-shadow:0 12px 32px rgba(0,0,0,0.4);flex-wrap:nowrap;overflow-x:auto;}
        .bb-group{display:flex;align-items:center;gap:4px;}
        .bb-label{display:none;}
        .pen-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;border:none;font-size:20px;cursor:pointer;background:transparent;color:var(--txt3);transition:all .2s;flex-shrink:0;}
        .pen-btn.on{background:rgba(255,255,255,0.1);color:var(--txt);}
        .color-swatch{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.2);flex-shrink:0;margin:0 4px;}
        .color-swatch.active{transform:scale(1.2);border-color:#fff;}
        .bb-action{display:none;} /* Moved to header/settings */
        
        .toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--txt);color:var(--bg);border-radius:24px;padding:12px 20px;font-size:13px;font-weight:600;box-shadow:0 12px 32px rgba(0,0,0,0.3);z-index:300;transition:all .3s cubic-bezier(.34,1.56,.64,1);opacity:0;pointer-events:none;display:flex;align-items:center;gap:10px;}
        .toast.show{transform:translateX(-50%) translateY(0);opacity:1}
        .t-dot{width:10px;height:10px;border-radius:50%;}
        
        .gw-overlay{display:none;position:fixed;top:110px;left:50%;transform:translateX(-50%);background:rgba(24,24,27,0.9);backdrop-filter:blur(8px);border:1px solid;border-radius:20px;padding:12px 20px;z-index:50;box-shadow:0 8px 32px rgba(0,0,0,0.3);text-align:center}
        .gw-overlay.show{display:block}
        
        /* Modern Modals / Bottom Sheets */
        .overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:250;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);padding:0;}
        .overlay.open{display:flex;animation:fadein .2s ease forwards;}
        @keyframes fadein { from{opacity:0;} to{opacity:1;} }
        
        .modal{background:var(--card);border-top-left-radius:32px;border-top-right-radius:32px;border-bottom-left-radius:0;border-bottom-right-radius:0;width:100%;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;animation:slideup .3s cubic-bezier(.34,1.56,.64,1) forwards;box-shadow:0 -10px 40px rgba(0,0,0,0.5);}
        @keyframes slideup { from{transform:translateY(100%);} to{transform:translateY(0);} }
        
        .mh{display:flex;align-items:center;padding:24px 24px 16px;background:transparent;gap:14px;position:relative;}
        .mh::before{content:'';position:absolute;top:10px;left:50%;transform:translateX(-50%);width:48px;height:5px;background:var(--border2);border-radius:5px;}
        .mbadge{width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;}
        .mtitle{font-size:20px;font-weight:700;color:var(--txt);letter-spacing:-0.3px;}
        .msub{font-size:13px;color:var(--txt3);margin-top:2px}
        .mclose{margin-left:auto;background:var(--bg3);border:none;cursor:pointer;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--txt);font-size:18px;}
        
        .mb{overflow-y:auto;padding:0 24px 24px;flex:1}
        .rg{margin-bottom:24px}
        .rl{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:var(--txt3);font-weight:700;margin-bottom:12px;}
        .ro{width:100%;text-align:left;padding:16px;border-radius:20px;border:1px solid var(--border);background:var(--bg);cursor:pointer;margin-bottom:10px;display:flex;flex-direction:column;gap:6px;transition:all .15s;}
        .ro:active{transform:scale(0.98);}
        .ro.sel{border-color:var(--blue);background:rgba(59,130,246,.08);}
        .ro-n{font-size:15px;font-weight:700;color:var(--txt);display:flex;align-items:center;gap:8px}
        .ro-d{font-size:13px;color:var(--txt2);line-height:1.5}
        .ro-tags{display:flex;gap:6px;margin-top:4px;flex-wrap:wrap}
        .ro-tag{font-size:11px;padding:4px 10px;border-radius:12px;font-weight:600;background:var(--border);color:var(--txt2)}
        
        .mf{padding:16px 24px 24px;border-top:1px solid var(--border);display:flex;gap:12px;background:var(--card)}
        .mf button{flex:1;font-size:15px;padding:14px;border-radius:20px;border:none;cursor:pointer;font-weight:600;background:var(--bg3);color:var(--txt);transition:all .2s}
        .mf .ok{background:var(--txt);color:var(--bg);}
        .mf .danger{background:rgba(239,68,68,.15);color:var(--red);}
        
        .save-input-row{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
        .save-input-row label{font-size:13px;color:var(--txt2);font-weight:500}
        .save-input-row input{padding:14px 16px;border-radius:16px;border:1px solid var(--border);background:var(--bg);color:var(--txt);font-size:15px;outline:none;}
        .save-input-row input:focus{border-color:var(--blue)}
        .save-item{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;border:1px solid var(--border);background:var(--bg);margin-bottom:8px;cursor:pointer;}
        .save-item-name{font-size:14px;font-weight:600;color:var(--txt);flex:1}
        .save-item-info{font-size:11px;color:var(--txt3);background:var(--border);padding:2px 8px;border-radius:12px;}
        .save-item-del{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,.1);color:var(--red);border:none;}
        .empty-saves{font-size:14px;color:var(--txt3);text-align:center;padding:40px 0;}
        
        .chat-apikey-row{display:flex;gap:8px;padding:16px 24px;border-bottom:1px solid var(--border);background:var(--bg)}
        .chat-apikey-row input{flex:1;font-size:13px;padding:12px 16px;border-radius:16px;border:1px solid var(--border);background:var(--card);color:var(--txt);outline:none}
        .chat-log{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:16px;background:var(--bg);}
        .chat-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--txt3);text-align:center;}
        .chat-empty i{font-size:48px;margin-bottom:12px;opacity:0.5;}
        .chat-bubble{max-width:85%;padding:14px 18px;border-radius:24px;font-size:14px;line-height:1.5;position:relative;}
        .chat-bubble.ai{background:var(--card);color:var(--txt);align-self:flex-start;border-bottom-left-radius:6px;border:1px solid var(--border);}
        .chat-bubble.user{background:var(--txt);color:var(--bg);align-self:flex-end;border-bottom-right-radius:6px;}
        .chat-input-row{display:flex;align-items:center;gap:12px;padding:16px 24px 24px;background:var(--card);border-top:1px solid var(--border)}
        .chat-input-row textarea{flex:1;padding:14px 18px;border-radius:24px;border:1px solid var(--border);background:var(--bg);color:var(--txt);font-size:15px;outline:none;resize:none;max-height:120px;line-height:1.4}
        .chat-send-btn{width:48px;height:48px;border-radius:50%;border:none;background:var(--txt);color:var(--bg);font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        
        /* Desktop Fallback for Modals and Bottom Bar */
        @media (min-width: 768px) {
          .bottombar { left: 50%; transform: translateX(-50%); width: max-content; max-width: 600px; justify-content: center; gap: 16px; padding: 12px 24px; }
          .modal { width: 440px; border-radius: 32px; align-self: center; margin-bottom: 40px; }
          .overlay { align-items: center; }
          .pitch-col { padding: 20px 40px 100px; }
        }

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
          <button className="hbtn" onClick={() => setIsSaveOpen(true)}><i className="ti ti-device-floppy"></i></button>
          <button className="hbtn" onClick={() => setIsLoadOpen(true)}><i className="ti ti-folder-open"></i></button>
          <select value={curFId} onChange={(e) => changeFormation(e.target.value)} className="fsel">
            <option value="433">4-3-3</option><option value="442">4-4-2</option>
            <option value="4231">4-2-3-1</option><option value="4132">4-1-3-2 Diamond</option>
            <option value="352">3-5-2</option><option value="343">3-4-3</option>
            <option value="541">5-4-1</option>
          </select>
          <button className="hbtn style-trigger-btn" onClick={() => setIsStyleModalOpen(true)}>
            <i className="ti ti-chess-queen"></i>
            {activeStyleId ? (
              <span>{STYLE_PRESETS[activeStyleId].emoji} {STYLE_PRESETS[activeStyleId].name}</span>
            ) : (
              <span>Gaya Bermain</span>
            )}
          </button>
          {activeStyleId && (
            <button className="hbtn style-clear-btn" onClick={clearStyle} aria-label="Lepas gaya bermain" title="Lepas gaya bermain">
              <i className="ti ti-x"></i>
            </button>
          )}
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
          {/* Zoom Controls */}
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} title="Zoom In">+</button>
            <button className="zoom-btn" onClick={() => setZoom(1)} style={{fontSize: '11px', fontWeight: 'bold'}} title="Reset Zoom">1x</button>
            <button className="zoom-btn" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} title="Zoom Out">-</button>
          </div>

          <div className="pitch-wrap">
            <div className="canvas-zoom-wrapper" style={{ transform: `scale(${zoom})` }}>
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

      {/* ════ GAYA BERMAIN MODAL ════ */}
      {isStyleModalOpen && (
        <div className="overlay open" onClick={(e) => { if(e.target === e.currentTarget) setIsStyleModalOpen(false); }}>
          <div className="modal wide">
            <div className="mh">
              <div style={{fontSize:24}}>🎭</div>
              <div><div className="mtitle">Preset Gaya Bermain</div><div className="msub">Otomatis isi formasi + peran + karakter gerakan</div></div>
              <button className="mclose" onClick={() => setIsStyleModalOpen(false)}>&#x2715;</button>
            </div>
            <div className="mb">
              <div className="style-grid">
                {Object.entries(STYLE_PRESETS).map(([id, style]) => (
                  <button
                    key={id}
                    className={`style-card ${activeStyleId === id ? 'active' : ''}`}
                    onClick={() => applyStyle(id)}
                  >
                    <div className="style-card-head">
                      <span className="style-emoji">{style.emoji}</span>
                      <span className="style-name">{style.name}</span>
                    </div>
                    <div className="style-desc">{style.desc}</div>
                    <div className="ro-tags" style={{marginTop:7}}>
                      <span className="ro-tag">{FORMATIONS[style.formation].name}</span>
                      <span className="ro-tag">{`lebar ×${style.modifiers.widthMult}`}</span>
                      <span className="ro-tag">{`tempo ×${style.modifiers.tempoMult}`}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="hint" style={{marginTop:10}}>
                <b>Catatan:</b> Menerapkan preset akan mengganti formasi dan seluruh peran yang sudah kamu atur secara manual.
                Kamu tetap bisa menyesuaikan peran per-pemain setelahnya — label gaya bermain akan tetap tersimpan sampai kamu ganti formasi atau lepas manual.
              </div>
            </div>
            <div className="mf"><button onClick={() => setIsStyleModalOpen(false)}>Tutup</button></div>
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
            <div className="mf">
              <button onClick={() => setIsResetConfirmOpen(false)}>Batal</button>
              <button className="danger" onClick={doFullReset}><i className="ti ti-refresh"></i> Ya, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}