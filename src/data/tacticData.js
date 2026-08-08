export const ROLE_MASTER = [
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

export const FORMATIONS = {
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

export const STYLE_PRESETS = {
  tiki_taka: {
    name: 'Tiki-Taka', emoji: '🔴🔵', formation: '433',
    desc: 'Penguasaan bola tinggi, segitiga pendek rapat, false nine, sabar membongkar blok pertahanan lawan.',
    roles: { 0:'sweeper_keeper', 1:'inverted_full_back', 2:'ball_playing_defender', 3:'ball_playing_defender', 4:'inverted_full_back', 5:'regista', 6:'mezzala', 7:'mezzala', 8:'inverted_winger', 9:'false_nine', 10:'inverted_winger' },
    modifiers: { widthMult: 0.85, depthMult: 1.00, tempoMult: 0.85, pressBoost: 0.05 },
  },
  total_football: {
    name: 'Total Football', emoji: '🟠', formation: '433',
    desc: 'Setiap pemain bisa bertukar posisi kapan saja — universalitas penuh, garis pertahanan tinggi, penguasaan ruang fluid.',
    roles: { 0:'sweeper_keeper', 1:'full_back', 2:'libero', 3:'ball_playing_defender', 4:'full_back', 5:'half_back', 6:'roaming_playmaker', 7:'box_to_box_midfielder', 8:'inside_forward', 9:'complete_forward', 10:'inside_forward' },
    modifiers: { widthMult: 1.08, depthMult: 1.05, tempoMult: 0.85, pressBoost: 0.08 },
  },
  gegenpressing: {
    name: 'Gegenpressing', emoji: '🔴', formation: '433',
    desc: 'Rebut bola secepat mungkin dalam 5 detik pertama setelah kehilangan — intensitas pressing tertinggi, transisi vertikal cepat.',
    roles: { 0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender', 3:'ball_playing_defender', 4:'full_back', 5:'ball_winning_midfielder', 6:'box_to_box_midfielder', 7:'roaming_playmaker', 8:'inside_forward', 9:'pressing_forward', 10:'inside_forward' },
    modifiers: { widthMult: 1.00, depthMult: 1.10, tempoMult: 0.65, pressBoost: 0.18 },
  },
  kick_and_rush: {
    name: 'Kick and Rush', emoji: '⚪', formation: '442',
    desc: 'Direct football — lewati lini tengah secepatnya lewat bola panjang ke target man, minim buildup, fisik & agresif.',
    roles: { 0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender', 3:'ball_playing_defender', 4:'full_back', 5:'wide_target_man', 6:'box_to_box_midfielder', 7:'box_to_box_midfielder', 8:'wide_target_man', 9:'target_forward', 10:'poacher' },
    modifiers: { widthMult: 1.12, depthMult: 1.00, tempoMult: 0.60, pressBoost: 0.00 },
  },
  catenaccio: {
    name: 'Catenaccio', emoji: '🔵⚫', formation: '541',
    desc: 'Sistem sweeper (libero) di belakang trio bek, sangat disiplin & kompak, menunggu momen counter-attack yang klinis.',
    roles: { 0:'sweeper_keeper', 1:'inverted_wing_back', 2:'ball_playing_defender', 3:'libero', 4:'ball_playing_defender', 5:'inverted_wing_back', 6:'carrilero', 7:'anchor_man', 8:'anchor_man', 9:'carrilero', 10:'poacher' },
    modifiers: { widthMult: 0.75, depthMult: 0.60, tempoMult: 1.15, pressBoost: -0.12 },
  },
  parkir_bus: {
    name: 'Parkir Bus', emoji: '🚌', formation: '4231',
    desc: 'Bertahan total — seluruh unit turun sangat dalam, blok sangat rapat, minim ambisi menyerang, tunggu satu peluang counter.',
    roles: { 0:'sweeper_keeper', 1:'full_back', 2:'ball_playing_defender', 3:'ball_playing_defender', 4:'full_back', 5:'anchor_man', 6:'anchor_man', 7:'wide_target_man', 8:'enganche', 9:'wide_target_man', 10:'poacher' },
    modifiers: { widthMult: 0.65, depthMult: 0.45, tempoMult: 1.30, pressBoost: -0.20 },
  },
};

export const TC = {GK:'#2563eb',CB:'#0891b2',FB:'#0ea5e9',WB:'#0284c7',DM:'#7c3aed',CM:'#6366f1',AM:'#9333ea',W:'#ea580c',CF:'#dc2626'};
export const TB = {GK:'#1e40af',CB:'#0e7490',FB:'#0369a1',WB:'#075985',DM:'#4c1d95',CM:'#3730a3',AM:'#7e22ce',W:'#c2410c',CF:'#991b1b'};
export const POS_LABEL = {GK:'GK',CB:'CB',FB:'FB',WB:'WB',DM:'DM',CM:'CM',AM:'AM',W:'W',CF:'CF'};

export const ICON_R_NORMAL = 18;
export const ICON_R_DRAG = 21;
export const HIT_RADIUS = 24;
export const WT = 0.28;

export const ZBANDS = [
  {m:.28,bg:'rgba(220,38,38,.07)',tc:'rgba(248,113,113,.5)',l:'CF · W (att)'},
  {m:.44,bg:'rgba(234,88,12,.07)',tc:'rgba(251,146,60,.5)',l:'AM · W'},
  {m:.58,bg:'rgba(99,102,241,.08)',tc:'rgba(165,180,252,.5)',l:'CM'},
  {m:.72,bg:'rgba(124,58,237,.08)',tc:'rgba(196,181,253,.5)',l:'DM · WB'},
  {m:.88,bg:'rgba(8,145,178,.08)',tc:'rgba(103,232,249,.5)',l:'CB · FB'},
  {m:1,bg:'rgba(37,99,235,.12)',tc:'rgba(147,197,253,.5)',l:'GK'},
];