/**
 * FootAI - Football Assistant Database & Tactical Engine
 */

const FOOTBALL_DATA = {
  leagues: [
    { id: 'all', name: 'Tất cả giải đấu', icon: '🌐' },
    { id: 'epl', name: 'Premier League (Anh)', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=64&auto=format&fit=crop&q=60' },
    { id: 'ucl', name: 'UEFA Champions League', icon: '⭐', logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&auto=format&fit=crop&q=60' },
    { id: 'laliga', name: 'La Liga (Tây Ban Nha)', icon: '🇪🇸', logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=64&auto=format&fit=crop&q=60' },
    { id: 'vleague', name: 'V-League 1 (Việt Nam)', icon: '🇻🇳', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=64&auto=format&fit=crop&q=60' }
  ],

  matches: [
    {
      id: 'm1',
      league: 'epl',
      leagueName: 'Premier League • Vòng 28',
      homeTeam: { name: 'Manchester City', short: 'MCI', logo: '🔵', rank: 2 },
      awayTeam: { name: 'Arsenal', short: 'ARS', logo: '🔴', rank: 1 },
      homeScore: 2,
      awayScore: 2,
      status: 'LIVE',
      minute: 74,
      stadium: 'Etihad Stadium, Manchester',
      referee: 'Michael Oliver',
      timeline: [
        { min: "12'", type: 'goal', team: 'away', text: 'Bukayo Saka ghi bàn từ cú cứa lòng chân trái hiểm hóc' },
        { min: "28'", type: 'goal', team: 'home', text: 'Erling Haaland gỡ hòa sau đường kiến tạo của De Bruyne' },
        { min: "44'", type: 'card-yellow', team: 'home', text: 'Rodri nhận thẻ vàng sau pha phạm lỗi chiến thuật' },
        { min: "58'", type: 'goal', team: 'home', text: 'Phil Foden sút xa uy lực nâng tỷ số lên 2-1' },
        { min: "71'", type: 'goal', team: 'away', text: 'Declan Rice đánh đầu gỡ hòa từ quả phạt góc của Saka' }
      ],
      stats: {
        possession: [58, 42],
        shots: [15, 11],
        shotsOnTarget: [6, 5],
        xg: [1.88, 1.45],
        corners: [7, 4],
        fouls: [9, 12],
        yellowCards: [1, 2]
      },
      h2h: '5 trận gần nhất: Man City thắng 2, Arsenal thắng 2, Hòa 1',
      expertTip: 'Thế trận đôi công nghẹt thở. Arsenal đang tận dụng cực tốt các tình huống cố định (Set-pieces).'
    },
    {
      id: 'm2',
      league: 'ucl',
      leagueName: 'Champions League • Bán kết Lượt đi',
      homeTeam: { name: 'Real Madrid', short: 'RMA', logo: '⚪', rank: 1 },
      awayTeam: { name: 'Bayern Munich', short: 'BAY', logo: '🔴', rank: 2 },
      homeScore: 3,
      awayScore: 1,
      status: 'FT',
      minute: 90,
      stadium: 'Santiago Bernabéu, Madrid',
      referee: 'Clément Turpin',
      timeline: [
        { min: "23'", type: 'goal', team: 'home', text: 'Vinícius Jr đột phá tốc độ và dứt điểm góc gần' },
        { min: "39'", type: 'goal', team: 'away', text: 'Harry Kane san bằng cách biệt từ chấm 11m' },
        { min: "65'", type: 'goal', team: 'home', text: 'Jude Bellingham đệm bóng cận thành' },
        { min: "84'", type: 'goal', team: 'home', text: 'Kylian Mbappé phản công chớp nhoáng ấn định 3-1' }
      ],
      stats: {
        possession: [51, 49],
        shots: [18, 12],
        shotsOnTarget: [8, 4],
        xg: [2.42, 1.15],
        corners: [6, 5],
        fouls: [8, 11],
        yellowCards: [1, 1]
      },
      h2h: 'Real Madrid bất bại 4 trận gặp Bayern gần nhất ở Bernabéu',
      expertTip: 'Hàng công siêu sao của Real phát huy uy lực trong các tình huống chuyển trạng thái tốc độ cao.'
    },
    {
      id: 'm3',
      league: 'vleague',
      leagueName: 'V-League 1 • Vòng 15',
      homeTeam: { name: 'Thép Xanh Nam Định', short: 'NDI', logo: '🟡', rank: 1 },
      awayTeam: { name: 'Hà Nội FC', short: 'HAN', logo: '🟣', rank: 2 },
      homeScore: 1,
      awayScore: 0,
      status: 'LIVE',
      minute: 38,
      stadium: 'SVĐ Thiên Trường, Nam Định',
      referee: 'Ngô Duy Lân',
      timeline: [
        { min: "19'", type: 'goal', team: 'home', text: 'Nguyễn Xuân Son (Rafaelson) đánh đầu dũng mãnh mở tỷ số' },
        { min: "31'", type: 'card-yellow', team: 'away', text: 'Đỗ Hùng Dũng nhận thẻ vàng ngăn phản công' }
      ],
      stats: {
        possession: [52, 48],
        shots: [7, 4],
        shotsOnTarget: [3, 1],
        xg: [0.92, 0.38],
        corners: [3, 2],
        fouls: [6, 7],
        yellowCards: [0, 1]
      },
      h2h: 'Nam Định thắng 2, Hà Nội FC thắng 2, Hòa 1 ở 5 lần chạm trán gần nhất',
      expertTip: 'Thiên Trường bùng nổ bầu không khí rực lửa, Nam Định duy trì sức ép cánh rất mạnh mẽ.'
    },
    {
      id: 'm4',
      league: 'laliga',
      leagueName: 'La Liga • Vòng 29 (El Clásico)',
      homeTeam: { name: 'Barcelona', short: 'BAR', logo: '🔵🔴', rank: 1 },
      awayTeam: { name: 'Real Madrid', short: 'RMA', logo: '⚪', rank: 2 },
      homeScore: null,
      awayScore: null,
      status: 'UPCOMING',
      time: '02:00 Ngày mai',
      stadium: 'Spotify Camp Nou, Barcelona',
      referee: 'José María Sánchez Martínez',
      timeline: [],
      stats: {
        possession: [50, 50],
        shots: [0, 0],
        shotsOnTarget: [0, 0],
        xg: [0, 0],
        corners: [0, 0],
        fouls: [0, 0],
        yellowCards: [0, 0]
      },
      h2h: 'Lượt đi: Barcelona 0 - 4 Real Madrid',
      expertTip: 'Trận đại chiến quyết định ngôi vương La Liga: Lamine Yamal vs Vinicius Jr hứa hẹn mãn nhãn.'
    },
    {
      id: 'm5',
      league: 'epl',
      leagueName: 'Premier League • Vòng 28',
      homeTeam: { name: 'Liverpool', short: 'LIV', logo: '🔴', rank: 3 },
      awayTeam: { name: 'Chelsea', short: 'CHE', logo: '🔵', rank: 4 },
      homeScore: 3,
      awayScore: 2,
      status: 'FT',
      minute: 90,
      stadium: 'Anfield, Liverpool',
      referee: 'Anthony Taylor',
      timeline: [
        { min: "07'", type: 'goal', team: 'home', text: 'Mohamed Salah mở tỷ số trên chấm phạt đền' },
        { min: "24'", type: 'goal', team: 'away', text: 'Cole Palmer dứt điểm tinh tế gỡ hòa 1-1' },
        { min: "49'", type: 'goal', team: 'home', text: 'Dominik Szoboszlai sút đại bác ngoài vòng cấm' },
        { min: "63'", type: 'goal', team: 'away', text: 'Nicolas Jackson đệm bóng gỡ hòa 2-2' },
        { min: "88'", type: 'goal', team: 'home', text: 'Darwin Núñez đánh đầu góc chữ A ấn định 3-2' }
      ],
      stats: {
        possession: [54, 46],
        shots: [19, 13],
        shotsOnTarget: [9, 5],
        xg: [2.71, 1.62],
        corners: [8, 4],
        fouls: [10, 11],
        yellowCards: [2, 3]
      },
      h2h: 'Liverpool thắng 3, Chelsea thắng 0, Hòa 2 trong 5 trận gần nhất',
      expertTip: 'Anfield tiếp tục là pháo đài bất khả xâm phạm dưới thời HLV Arne Slot.'
    },
    {
      id: 'm6',
      league: 'vleague',
      leagueName: 'V-League 1 • Vòng 15',
      homeTeam: { name: 'Công An Hà Nội', short: 'CAH', logo: '🔴', rank: 3 },
      awayTeam: { name: 'Thể Công Viettel', short: 'VTE', logo: '⚪', rank: 4 },
      homeScore: null,
      awayScore: null,
      status: 'UPCOMING',
      time: '19:15 Tối nay',
      stadium: 'SVĐ Hàng Đẫy, Hà Nội',
      referee: 'Hoàng Ngọc Hà',
      timeline: [],
      stats: {
        possession: [50, 50],
        shots: [0, 0],
        shotsOnTarget: [0, 0],
        xg: [0, 0],
        corners: [0, 0],
        fouls: [0, 0],
        yellowCards: [0, 0]
      },
      h2h: 'Derby Thủ đô luôn căng thẳng và kịch tính đến phút bù giờ',
      expertTip: 'Quang Hải cùng Leo Artur đang có phong độ thăng hoa trong khâu tạo cơ hội.'
    }
  ],

  standings: {
    epl: [
      { rank: 1, team: 'Arsenal', p: 28, w: 20, d: 5, l: 3, gf: 63, ga: 22, gd: '+41', pts: 65, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 2, team: 'Manchester City', p: 28, w: 19, d: 6, l: 3, gf: 66, ga: 26, gd: '+40', pts: 63, form: ['W', 'D', 'W', 'W', 'W'] },
      { rank: 3, team: 'Liverpool', p: 28, w: 18, d: 7, l: 3, gf: 61, ga: 25, gd: '+36', pts: 61, form: ['W', 'W', 'W', 'L', 'W'] },
      { rank: 4, team: 'Chelsea', p: 28, w: 15, d: 5, l: 8, gf: 52, ga: 36, gd: '+16', pts: 50, form: ['L', 'W', 'W', 'D', 'W'] },
      { rank: 5, team: 'Aston Villa', p: 28, w: 14, d: 6, l: 8, gf: 49, ga: 38, gd: '+11', pts: 48, form: ['W', 'L', 'D', 'W', 'W'] },
      { rank: 6, team: 'Newcastle United', p: 28, w: 13, d: 6, l: 9, gf: 47, ga: 39, gd: '+8', pts: 45, form: ['D', 'W', 'L', 'W', 'D'] },
      { rank: 7, team: 'Tottenham Hotspur', p: 28, w: 13, d: 4, l: 11, gf: 55, ga: 45, gd: '+10', pts: 43, form: ['W', 'L', 'L', 'W', 'D'] },
      { rank: 8, team: 'Manchester United', p: 28, w: 12, d: 5, l: 11, gf: 41, ga: 42, gd: '-1', pts: 41, form: ['L', 'W', 'D', 'L', 'W'] }
    ],
    ucl: [
      { rank: 1, team: 'Real Madrid', p: 8, w: 7, d: 1, l: 0, gf: 21, ga: 7, gd: '+14', pts: 22, form: ['W', 'W', 'W', 'D', 'W'] },
      { rank: 2, team: 'Manchester City', p: 8, w: 6, d: 2, l: 0, gf: 22, ga: 8, gd: '+14', pts: 20, form: ['W', 'D', 'W', 'W', 'W'] },
      { rank: 3, team: 'Bayern Munich', p: 8, w: 6, d: 1, l: 1, gf: 20, ga: 9, gd: '+11', pts: 19, form: ['L', 'W', 'W', 'W', 'W'] },
      { rank: 4, team: 'Arsenal', p: 8, w: 6, d: 1, l: 1, gf: 18, ga: 6, gd: '+12', pts: 19, form: ['W', 'W', 'W', 'L', 'W'] },
      { rank: 5, team: 'Barcelona', p: 8, w: 5, d: 2, l: 1, gf: 19, ga: 10, gd: '+9', pts: 17, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 6, team: 'Paris Saint-Germain', p: 8, w: 5, d: 1, l: 2, gf: 16, ga: 11, gd: '+5', pts: 16, form: ['W', 'L', 'W', 'W', 'D'] }
    ],
    laliga: [
      { rank: 1, team: 'Barcelona', p: 28, w: 21, d: 4, l: 3, gf: 71, ga: 24, gd: '+47', pts: 67, form: ['W', 'W', 'W', 'W', 'D'] },
      { rank: 2, team: 'Real Madrid', p: 28, w: 20, d: 5, l: 3, gf: 65, ga: 21, gd: '+44', pts: 65, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 3, team: 'Atlético Madrid', p: 28, w: 17, d: 6, l: 5, gf: 49, ga: 22, gd: '+27', pts: 57, form: ['W', 'D', 'W', 'W', 'L'] },
      { rank: 4, team: 'Athletic Club', p: 28, w: 15, d: 7, l: 6, gf: 44, ga: 26, gd: '+18', pts: 52, form: ['D', 'W', 'W', 'D', 'W'] }
    ],
    vleague: [
      { rank: 1, team: 'Thép Xanh Nam Định', p: 15, w: 10, d: 3, l: 2, gf: 34, ga: 18, gd: '+16', pts: 33, form: ['W', 'W', 'D', 'W', 'W'] },
      { rank: 2, team: 'Hà Nội FC', p: 15, w: 9, d: 3, l: 3, gf: 27, ga: 16, gd: '+11', pts: 30, form: ['L', 'W', 'W', 'D', 'W'] },
      { rank: 3, team: 'Công An Hà Nội', p: 15, w: 8, d: 4, l: 3, gf: 29, ga: 17, gd: '+12', pts: 28, form: ['W', 'D', 'W', 'L', 'W'] },
      { rank: 4, team: 'Thể Công Viettel', p: 15, w: 7, d: 5, l: 3, gf: 22, ga: 15, gd: '+7', pts: 26, form: ['D', 'W', 'D', 'W', 'W'] },
      { rank: 5, team: 'Hải Phòng FC', p: 15, w: 6, d: 5, l: 4, gf: 23, ga: 20, gd: '+3', pts: 23, form: ['W', 'L', 'D', 'W', 'D'] }
    ]
  },

  formations: {
    '4-3-3': {
      name: '4-3-3 Tiki-Taka / High Press',
      desc: 'Sơ đồ tối ưu kiểm soát không gian, tam giác chuyền bóng và pressing tầm cao.',
      players: [
        { id: 1, role: 'GK', label: 'GK', x: 50, y: 88, name: 'Thủ môn (Sweeper)' },
        { id: 2, role: 'RB', label: 'RB', x: 86, y: 72, name: 'Hậu vệ phải (Inverted)' },
        { id: 3, role: 'CB', label: 'RCB', x: 62, y: 76, name: 'Trung vệ lệch phải' },
        { id: 4, role: 'CB', label: 'LCB', x: 38, y: 76, name: 'Trung vệ lệch trái (BPD)' },
        { id: 5, role: 'LB', label: 'LB', x: 14, y: 72, name: 'Hậu vệ trái (Overlapping)' },
        { id: 6, role: 'DM', label: 'CDM', x: 50, y: 58, name: 'Mỏ neo (Anchor/Regista)' },
        { id: 7, role: 'CM', label: 'RCM', x: 68, y: 44, name: 'Tiền vệ Box-to-Box' },
        { id: 8, role: 'CM', label: 'LCM', x: 32, y: 44, name: 'Tiền vệ Kiến thiết (Mezzala)' },
        { id: 9, role: 'RW', label: 'RW', x: 82, y: 22, name: 'Tiền đạo cánh phải' },
        { id: 10, role: 'ST', label: 'ST', x: 50, y: 14, name: 'Trung phong (Poacher/False 9)' },
        { id: 11, role: 'LW', label: 'LW', x: 18, y: 22, name: 'Tiền đạo cánh trái (Inside)' }
      ]
    },
    '4-2-3-1': {
      name: '4-2-3-1 Cân Bằng & Chuyển Trạng Thái Nhanh',
      desc: 'Trục đôi tiền vệ phòng ngự che chắn, số 10 tự do sáng tạo và chuyển đổi trạng thái chớp nhoáng.',
      players: [
        { id: 1, role: 'GK', label: 'GK', x: 50, y: 88, name: 'Thủ môn' },
        { id: 2, role: 'RB', label: 'RB', x: 86, y: 72, name: 'Hậu vệ phải' },
        { id: 3, role: 'CB', label: 'RCB', x: 62, y: 76, name: 'Trung vệ phải' },
        { id: 4, role: 'CB', label: 'LCB', x: 38, y: 76, name: 'Trung vệ trái' },
        { id: 5, role: 'LB', label: 'LB', x: 14, y: 72, name: 'Hậu vệ trái' },
        { id: 6, role: 'DM', label: 'RDM', x: 62, y: 58, name: 'Tiền vệ trụ (Ball-winner)' },
        { id: 7, role: 'DM', label: 'LDM', x: 38, y: 58, name: 'Tiền vệ lùi sâu (Deep Playmaker)' },
        { id: 8, role: 'AM', label: 'CAM', x: 50, y: 38, name: 'Số 10 Nhạc trưởng' },
        { id: 9, role: 'RM', label: 'RAM', x: 82, y: 34, name: 'Tiền vệ tấn công phải' },
        { id: 10, role: 'LM', label: 'LAM', x: 18, y: 34, name: 'Tiền vệ tấn công trái' },
        { id: 11, role: 'ST', label: 'ST', x: 50, y: 15, name: 'Tiền đạo mục tiêu' }
      ]
    },
    '3-5-2': {
      name: '3-5-2 Cơ Động Biên & 2 Tiền Đạo Song Sát',
      desc: '3 trung vệ vững chắc, wing-backs bao trọn 2 hành lang biên và cặp tiền đạo phối hợp trực diện.',
      players: [
        { id: 1, role: 'GK', label: 'GK', x: 50, y: 88, name: 'Thủ môn' },
        { id: 2, role: 'CB', label: 'RCB', x: 72, y: 76, name: 'Trung vệ dâng cao phải' },
        { id: 3, role: 'CB', label: 'CB', x: 50, y: 78, name: 'Trung vệ thòng (Sweeper)' },
        { id: 4, role: 'CB', label: 'LCB', x: 28, y: 76, name: 'Trung vệ dâng cao trái' },
        { id: 5, role: 'WB', label: 'RWB', x: 88, y: 52, name: 'Hậu vệ biên công kích (RWB)' },
        { id: 6, role: 'WB', label: 'LWB', x: 12, y: 52, name: 'Hậu vệ biên công kích (LWB)' },
        { id: 7, role: 'DM', label: 'CDM', x: 50, y: 60, name: 'Tiền vệ thu hồi bóng' },
        { id: 8, role: 'CM', label: 'RCM', x: 66, y: 44, name: 'Tiền vệ trung tâm phải' },
        { id: 9, role: 'CM', label: 'LCM', x: 34, y: 44, name: 'Tiền vệ trung tâm trái' },
        { id: 10, role: 'ST', label: 'RST', x: 62, y: 18, name: 'Tiền đạo tốc độ' },
        { id: 11, role: 'ST', label: 'LST', x: 38, y: 18, name: 'Tiền đạo làm tường' }
      ]
    },
    '4-4-2': {
      name: '4-4-2 Truyền Thống / Khối Phòng Ngự Kỷ Luật',
      desc: 'Hai tuyến 4 người tạo thành khối Low-Block vững chắc, phản công trực diện hiệu quả.',
      players: [
        { id: 1, role: 'GK', label: 'GK', x: 50, y: 88, name: 'Thủ môn' },
        { id: 2, role: 'RB', label: 'RB', x: 86, y: 74, name: 'Hậu vệ phải' },
        { id: 3, role: 'CB', label: 'RCB', x: 62, y: 76, name: 'Trung vệ phải' },
        { id: 4, role: 'CB', label: 'LCB', x: 38, y: 76, name: 'Trung vệ trái' },
        { id: 5, role: 'LB', label: 'LB', x: 14, y: 74, name: 'Hậu vệ trái' },
        { id: 6, role: 'RM', label: 'RM', x: 84, y: 48, name: 'Tiền vệ cánh phải' },
        { id: 7, role: 'CM', label: 'RCM', x: 62, y: 52, name: 'Tiền vệ trung tâm' },
        { id: 8, role: 'CM', label: 'LCM', x: 38, y: 52, name: 'Tiền vệ trung tâm' },
        { id: 9, role: 'LM', label: 'LM', x: 16, y: 48, name: 'Tiền vệ cánh trái' },
        { id: 10, role: 'ST', label: 'RST', x: 60, y: 18, name: 'Tiền đạo số 9' },
        { id: 11, role: 'ST', label: 'LST', x: 40, y: 22, name: 'Tiền đạo số 10 lùi' }
      ]
    }
  },

  players: [
    {
      id: 'p1',
      name: 'Erling Haaland',
      team: 'Manchester City',
      pos: 'Tiền đạo cắm (ST)',
      nat: 'Na Uy 🇳🇴',
      age: 26,
      avatar: '⚽',
      stats: { pace: 93, shooting: 96, passing: 72, dribbling: 82, physical: 94, heading: 92, xgPer90: 1.15, goals: 32 }
    },
    {
      id: 'p2',
      name: 'Kylian Mbappé',
      team: 'Real Madrid',
      pos: 'Tiền đạo cánh / Cắm',
      nat: 'Pháp 🇫🇷',
      age: 27,
      avatar: '⚡',
      stats: { pace: 97, shooting: 94, passing: 83, dribbling: 94, physical: 81, heading: 74, xgPer90: 1.08, goals: 30 }
    },
    {
      id: 'p3',
      name: 'Lamine Yamal',
      team: 'Barcelona',
      pos: 'Tiền đạo cánh phải (RW)',
      nat: 'Tây Ban Nha 🇪🇸',
      age: 19,
      avatar: '🌟',
      stats: { pace: 89, shooting: 84, passing: 91, dribbling: 96, physical: 68, heading: 62, xgPer90: 0.65, goals: 16 }
    },
    {
      id: 'p4',
      name: 'Jude Bellingham',
      team: 'Real Madrid',
      pos: 'Tiền vệ tấn công (CAM/CM)',
      nat: 'Anh 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      age: 23,
      avatar: '💎',
      stats: { pace: 84, shooting: 88, passing: 89, dribbling: 90, physical: 88, heading: 86, xgPer90: 0.72, goals: 19 }
    },
    {
      id: 'p5',
      name: 'Vinícius Júnior',
      team: 'Real Madrid',
      pos: 'Tiền đạo cánh trái (LW)',
      nat: 'Brazil 🇧🇷',
      age: 26,
      avatar: '🔥',
      stats: { pace: 96, shooting: 89, passing: 84, dribbling: 95, physical: 74, heading: 69, xgPer90: 0.88, goals: 24 }
    },
    {
      id: 'p6',
      name: 'Nguyễn Xuân Son (Rafaelson)',
      team: 'Thép Xanh Nam Định',
      pos: 'Trung phong (ST)',
      nat: 'Việt Nam 🇻🇳',
      age: 29,
      avatar: '🎯',
      stats: { pace: 82, shooting: 91, passing: 70, dribbling: 78, physical: 95, heading: 94, xgPer90: 1.22, goals: 28 }
    },
    {
      id: 'p7',
      name: 'Nguyễn Quang Hải',
      team: 'Công An Hà Nội',
      pos: 'Tiền vệ tấn công (CAM/RW)',
      nat: 'Việt Nam 🇻🇳',
      age: 29,
      avatar: '🪄',
      stats: { pace: 78, shooting: 84, passing: 88, dribbling: 85, physical: 71, heading: 60, xgPer90: 0.45, goals: 9 }
    }
  ],

  faqKnowledge: [
    {
      keywords: ['việt vị', 'luật việt vị', 'var', 'offside'],
      title: 'Giải thích Luật Việt vị mới nhất & Công nghệ VAR',
      answer: `### ⚖️ Luật Việt vị (IFAB Luật 11) & Quy trình VAR

1. **Khi nào cầu thủ bị xem là việt vị?**
   - Đứng ở nửa sân đối phương.
   - Gần đường biên ngang đối phương hơn cả bóng và cầu thủ áp chót (thường là hậu vệ cuối cùng trước thủ môn).
   - Bất kỳ bộ phận cơ thể nào có thể ghi bàn hợp lệ (đầu, thân, chân - KHÔNG tính tay/cánh tay) vượt qua vị trí hợp lệ tại **thời điểm bóng được chuyền đi**.

2. **Khi nào bị thổi phạt việt vị?**
   - Chỉ khi cầu thủ đó:
     - Trực tiếp chạm/chơi bóng.
     - Can thiệp đối phương (che tầm nhìn thủ môn, tranh chấp bóng, cản trở di chuyển).
     - Hưởng lợi từ vị trí việt vị (bóng bật cột dọc/xà ngang hoặc thủ môn cứu thua văng ra).

3. **Công nghệ SAOT (Bắt việt vị bán tự động):**
   - Sử dụng 12 camera quang học chuyên dụng bám sát 29 điểm cử động trên cơ thể mỗi cầu thủ với tần số 50 lần/giây, kèm cảm biến bên trong trái bóng gửi tín hiệu xác định chính xác 100% thời điểm chạm bóng.`
    },
    {
      keywords: ['man city', 'arsenal', 'đại chiến', 'mci', 'ars'],
      title: 'Phân tích chiến thuật: Man City vs Arsenal',
      answer: `### ⚔️ Phân tích Đại chiến: Man City vs Arsenal

- **Đặc trưng chiến thuật:**
  - **Man City (Pep Guardiola)**: Triển khai 3-2-4-1 khi có bóng, Rodri điều tiết nhịp điệu từ tuyến hai. Man City tập trung kéo giãn cự ly phòng ngự đối thủ bằng cách quá tải (overload) khu vực half-space trước khi chuyền xuyên tuyến cho Haaland.
  - **Arsenal (Mikel Arteta)**: Phòng ngự khối 4-4-2 kỷ luật khi không bóng. Tận dụng tối đa bài đánh cố định (Set-pieces do Nicolas Jover dàn xếp) với trung vệ dâng cao như Gabriel và Saliba.
- **Điểm nóng quyết định:**
  - Trận chiến tuyến giữa giữa Rodri/Kovacic vs Declan Rice/Ødegaard.
  - Cánh phải của Saka đối đầu với Gvardiol - điểm bùng nổ cơ hội nhiều nhất của Pháo thủ.`
    },
    {
      keywords: ['4-3-3', '4-2-3-1', 'sơ đồ', 'chiến thuật', 'formation'],
      title: 'So sánh chuyên sâu: Sơ đồ 4-3-3 vs 4-2-3-1',
      answer: `### 📐 So sánh sơ đồ: 4-3-3 vs 4-2-3-1

| Tiêu chí | Sơ đồ 4-3-3 | Sơ đồ 4-2-3-1 |
| :--- | :--- | :--- |
| **Triết lý chủ đạo** | Kiểm soát bóng toàn diện, tạo tam giác chuyền | Cân bằng, chuyển đổi trạng thái chớp nhoáng |
| **Tuyến tiền vệ** | 1 Mỏ neo (CDM) + 2 Số 8 cơ động (Mezzala) | Trục đôi (Double Pivot: 2 CDM) + 1 Số 10 |
| **Vai trò sáng tạo** | San sẻ đều 3 tiền vệ & tiền đạo cánh cắt vào trong | Dồn trọng tâm cho Số 10 (Playmaker) |
| **Khả năng phòng ngự** | Dễ bị phản công khoảng trống sau lưng 2 số 8 | Vô cùng chắc chắn nhờ 2 tiền vệ mỏ neo che chắn |
| **Đội bóng tiêu biểu** | Man City, Barcelona, Liverpool | Real Madrid, Bayern Munich, ĐT Pháp |`
    },
    {
      keywords: ['mbappe', 'haaland', 'so sánh mbappe', 'so sánh haaland'],
      title: 'So sánh: Kylian Mbappé vs Erling Haaland',
      answer: `### ⚡ Erling Haaland vs Kylian Mbappé: Ai toàn diện hơn?

1. **Erling Haaland (Kẻ hủy diệt vòng cấm - Pure Poacher):**
   - Chỉ số bàn thắng/trận cao nhất bóng đá đương đại (xG per 90 > 1.15).
   - Sức mạnh thể chất, khả năng chọn vị trí và dứt điểm một chạm (First-time shot) thượng thừa.
   - Thích hợp tối đa với các hệ thống kiểm soát bóng áp đặt đối thủ.

2. **Kylian Mbappé (Ngôi sao tạo đột biến - Complete Forward):**
   - Tốc độ nước rút kinh hoàng kết hợp kỹ thuật rê bóng 1v1 hàng đầu thế giới.
   - Tự tạo cơ hội từ khoảng cách xa, đi bóng cắt vào trung lộ dứt điểm hoặc kiến tạo.
   - Nguy hiểm bậc nhất trong các tình huống phản công và chuyển trạng thái nhanh.

👉 **Kết luận:** Haaland là sát thủ dứt điểm vòng cấm tối thượng, trong khi Mbappé mang lại sự biến ảo và tự lực cánh sinh cao hơn khi trận đấu bế tắc.`
    },
    {
      keywords: ['v-league', 'nam định', 'hà nội', 'quang hải', 'tuấn hải'],
      title: 'Phân tích cục diện V-League 1 & Bóng đá Việt Nam',
      answer: `### 🇻🇳 Phân tích V-League 1 & Tuyển Việt Nam

- **Cuộc đua vô địch V-League:**
  - **Thép Xanh Nam Định**: Sở hữu hỏa lực khủng khiếp nhất nhờ sự hòa nhập của Nguyễn Xuân Son (Rafaelson) cùng dàn ngoại binh chất lượng cao và sự bùng nổ của SVĐ Thiên Trường.
  - **Hà Nội FC & CAHN**: Bản lĩnh của đội bóng giàu truyền thống với những nội binh đẳng cấp như Văn Quyết, Hùng Dũng, Quang Hải, Việt Anh.
- **Xu hướng chiến thuật V-League hiện nay:**
  - Chú trọng thể lực, pressing tầm trung và áp dụng công nghệ VAR phủ sóng hầu hết các trận cầu đinh, giúp giảm thiểu tranh cãi trọng tài.`
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = FOOTBALL_DATA;
}
