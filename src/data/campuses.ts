import { CampusLayout, RobotTelemetry, OperationalLog } from '../types/cleanbot';

export const CAMPUS_DATA: Record<string, CampusLayout> = {
  myllypuro: {
    id: 'myllypuro',
    name: 'Myllypuro Campus',
    city: 'Helsinki',
    wing: 'B-Wing Health & Tech',
    floor: 'Floor 2',
    description: 'Specialized healthcare & smart construction wing with high-traffic linoleum and terrazzo flooring.',
    dockPosition: { x: 70, y: 70 },
    rooms: [
      {
        id: 'dock_bay',
        name: 'Auto-Dock Bay & Waste Chute',
        code: 'D-200',
        type: 'dock_bay',
        x: 30,
        y: 30,
        width: 100,
        height: 90,
        areaSqM: 18,
        status: 'dock',
        cleanliness: 100,
        vacant: true,
        lastSchedule: 'Auto-drain & inductive fast charger online',
        doors: [{ x: 130, y: 75 }],
        waypoints: [{ x: 70, y: 70 }]
      },
      {
        id: 'corridor_main',
        name: 'Central Corridor Spine',
        code: 'C-200',
        type: 'corridor',
        x: 140,
        y: 50,
        width: 580,
        height: 60,
        areaSqM: 145,
        status: 'pending',
        cleanliness: 62,
        vacant: true,
        lastSchedule: 'Off-hours access active: 0 staff present',
        doors: [
          { x: 140, y: 80 },
          { x: 210, y: 110 },
          { x: 370, y: 110 },
          { x: 530, y: 110 },
          { x: 680, y: 110 },
          { x: 720, y: 80 }
        ],
        waypoints: [
          { x: 170, y: 80 },
          { x: 280, y: 80 },
          { x: 440, y: 80 },
          { x: 600, y: 80 },
          { x: 710, y: 80 }
        ]
      },
      {
        id: 'm201',
        name: 'Classroom M201 (Clinical Nursing Lab)',
        code: 'M201',
        type: 'classroom',
        x: 140,
        y: 130,
        width: 150,
        height: 150,
        areaSqM: 52,
        status: 'pending',
        cleanliness: 45,
        vacant: true,
        lastSchedule: 'Peppi: Clinical Practice ended 20:30 (vacant)',
        doors: [{ x: 210, y: 130 }],
        waypoints: [
          { x: 180, y: 160 },
          { x: 240, y: 160 },
          { x: 240, y: 220 },
          { x: 180, y: 220 }
        ]
      },
      {
        id: 'm202',
        name: 'Lecture Hall M202 (Tiered Health Sciences)',
        code: 'M202',
        type: 'lecture_hall',
        x: 300,
        y: 130,
        width: 150,
        height: 150,
        areaSqM: 68,
        status: 'pending',
        cleanliness: 38,
        vacant: true,
        lastSchedule: 'Peppi: Public Health Seminar ended 20:45 (vacant)',
        doors: [{ x: 370, y: 130 }],
        waypoints: [
          { x: 340, y: 160 },
          { x: 410, y: 160 },
          { x: 410, y: 220 },
          { x: 340, y: 220 }
        ]
      },
      {
        id: 'm203',
        name: 'Classroom M203 (Smart Building Studio)',
        code: 'M203',
        type: 'classroom',
        x: 460,
        y: 130,
        width: 140,
        height: 150,
        areaSqM: 48,
        status: 'pending',
        cleanliness: 55,
        vacant: true,
        lastSchedule: 'Peppi: BIM Modeling Lab ended 19:30 (vacant)',
        doors: [{ x: 530, y: 130 }],
        waypoints: [
          { x: 490, y: 160 },
          { x: 560, y: 160 },
          { x: 560, y: 220 },
          { x: 490, y: 220 }
        ]
      },
      {
        id: 'm204_lounge',
        name: 'Student Innovation Lounge & Hub',
        code: 'M204',
        type: 'lounge',
        x: 610,
        y: 130,
        width: 150,
        height: 150,
        areaSqM: 58,
        status: 'pending',
        cleanliness: 30,
        vacant: true,
        lastSchedule: 'Open study area closed at 21:00 (motion sensor clear)',
        doors: [{ x: 680, y: 130 }],
        waypoints: [
          { x: 640, y: 160 },
          { x: 710, y: 160 },
          { x: 710, y: 220 },
          { x: 640, y: 220 }
        ]
      },
      {
        id: 'corridor_south',
        name: 'South Concourse & Recycling Point',
        code: 'C-210',
        type: 'corridor',
        x: 140,
        y: 300,
        width: 620,
        height: 60,
        areaSqM: 120,
        status: 'pending',
        cleanliness: 70,
        vacant: true,
        lastSchedule: 'Off-hours night transit corridor',
        doors: [
          { x: 210, y: 280 },
          { x: 370, y: 280 },
          { x: 530, y: 280 },
          { x: 680, y: 280 }
        ],
        waypoints: [
          { x: 210, y: 330 },
          { x: 370, y: 330 },
          { x: 530, y: 330 },
          { x: 690, y: 330 }
        ]
      }
    ],
    trashItems: [
      {
        id: 'tr_1',
        type: 'coffee_cup',
        label: 'Takeaway Oat Latte Cup',
        x: 230,
        y: 170,
        weightGrams: 42,
        collected: false,
        roomId: 'm201'
      },
      {
        id: 'tr_2',
        type: 'paper_sheet',
        label: 'Discarded Exam Notes',
        x: 175,
        y: 210,
        weightGrams: 15,
        collected: false,
        roomId: 'm201'
      },
      {
        id: 'tr_3',
        type: 'snack_wrapper',
        label: 'Rye Crispbread Wrapper',
        x: 350,
        y: 185,
        weightGrams: 8,
        collected: false,
        roomId: 'm202'
      },
      {
        id: 'tr_4',
        type: 'plastic_bottle',
        label: 'Vichy Sparkling Water Bottle (0.5L)',
        x: 415,
        y: 215,
        weightGrams: 36,
        collected: false,
        roomId: 'm202'
      },
      {
        id: 'tr_5',
        type: 'coffee_cup',
        label: 'Robert’s Coffee Cup',
        x: 495,
        y: 175,
        weightGrams: 38,
        collected: false,
        roomId: 'm203'
      },
      {
        id: 'tr_6',
        type: 'dust_clump',
        label: 'Corridor Dust & Dry Gravel',
        x: 310,
        y: 75,
        weightGrams: 60,
        collected: false,
        roomId: 'corridor_main'
      },
      {
        id: 'tr_7',
        type: 'dust_clump',
        label: 'Entrance Slush Dirt Particles',
        x: 580,
        y: 85,
        weightGrams: 85,
        collected: false,
        roomId: 'corridor_main'
      },
      {
        id: 'tr_8',
        type: 'apple_core',
        label: 'Food Scrap near Lounge Sofa',
        x: 670,
        y: 200,
        weightGrams: 75,
        collected: false,
        roomId: 'm204_lounge'
      },
      {
        id: 'tr_9',
        type: 'snack_wrapper',
        label: 'Protein Bar Foil',
        x: 720,
        y: 165,
        weightGrams: 12,
        collected: false,
        roomId: 'm204_lounge'
      },
      {
        id: 'tr_10',
        type: 'paper_sheet',
        label: 'Study Blueprint Draft',
        x: 480,
        y: 330,
        weightGrams: 20,
        collected: false,
        roomId: 'corridor_south'
      }
    ],
    spills: [
      {
        id: 'sp_1',
        x: 380,
        y: 195,
        radius: 18,
        type: 'coffee',
        cleaned: false,
        roomId: 'm202'
      },
      {
        id: 'sp_2',
        x: 650,
        y: 180,
        radius: 22,
        type: 'energy_drink',
        cleaned: false,
        roomId: 'm204_lounge'
      },
      {
        id: 'sp_3',
        x: 460,
        y: 75,
        radius: 16,
        type: 'water_slush',
        cleaned: false,
        roomId: 'corridor_main'
      }
    ]
  },
  karamalmi: {
    id: 'karamalmi',
    name: 'Karamalmi Campus',
    city: 'Espoo',
    wing: 'Smart IoT & XR Hall',
    floor: 'Floor 1',
    description: 'High-tech developer studios, electronics prototyping cleanrooms, and open maker spaces.',
    dockPosition: { x: 70, y: 70 },
    rooms: [
      {
        id: 'dock_bay_k',
        name: 'Auto-Dock Bay Karamalmi',
        code: 'DK-10',
        type: 'dock_bay',
        x: 30,
        y: 30,
        width: 100,
        height: 90,
        areaSqM: 20,
        status: 'dock',
        cleanliness: 100,
        vacant: true,
        lastSchedule: 'Fast charge 80kW inductive dock active',
        doors: [{ x: 130, y: 75 }],
        waypoints: [{ x: 70, y: 70 }]
      },
      {
        id: 'k101',
        name: 'RoboLab & AI Prototyping',
        code: 'K101',
        type: 'lab',
        x: 140,
        y: 50,
        width: 280,
        height: 220,
        areaSqM: 110,
        status: 'pending',
        cleanliness: 50,
        vacant: true,
        lastSchedule: 'Robotics night bench testing off (vacant)',
        doors: [{ x: 280, y: 270 }],
        waypoints: [{ x: 200, y: 120 }, { x: 340, y: 120 }, { x: 280, y: 190 }]
      },
      {
        id: 'k102',
        name: 'Software Arena & XR Cave',
        code: 'K102',
        type: 'classroom',
        x: 440,
        y: 50,
        width: 280,
        height: 220,
        areaSqM: 105,
        status: 'pending',
        cleanliness: 58,
        vacant: true,
        lastSchedule: 'XR Hackathon completed 21:00 (vacant)',
        doors: [{ x: 580, y: 270 }],
        waypoints: [{ x: 500, y: 120 }, { x: 640, y: 120 }, { x: 580, y: 190 }]
      },
      {
        id: 'k_corridor',
        name: 'Nokia-Piazza Tech Corridor',
        code: 'K-COR',
        type: 'corridor',
        x: 140,
        y: 280,
        width: 580,
        height: 70,
        areaSqM: 140,
        status: 'pending',
        cleanliness: 72,
        vacant: true,
        lastSchedule: 'Off-hours night lighting dimmed',
        doors: [{ x: 280, y: 280 }, { x: 580, y: 280 }],
        waypoints: [{ x: 200, y: 315 }, { x: 430, y: 315 }, { x: 650, y: 315 }]
      }
    ],
    trashItems: [
      {
        id: 'tr_k1',
        type: 'coffee_cup',
        label: 'Energy Drink Can',
        x: 240,
        y: 140,
        weightGrams: 28,
        collected: false,
        roomId: 'k101'
      },
      {
        id: 'tr_k2',
        type: 'plastic_bottle',
        label: 'Maté Tea Bottle',
        x: 520,
        y: 150,
        weightGrams: 35,
        collected: false,
        roomId: 'k102'
      }
    ],
    spills: [
      {
        id: 'sp_k1',
        x: 320,
        y: 180,
        radius: 20,
        type: 'coffee',
        cleaned: false,
        roomId: 'k101'
      }
    ]
  },
  arabia: {
    id: 'arabia',
    name: 'Arabia Campus',
    city: 'Helsinki',
    wing: 'Creative Arts & Media Wing',
    floor: 'Floor 3',
    description: 'Design studios, ceramic workshops, fashion atelier, and exhibition hallways.',
    dockPosition: { x: 70, y: 70 },
    rooms: [
      {
        id: 'dock_bay_a',
        name: 'Auto-Dock Bay Arabia',
        code: 'DA-30',
        type: 'dock_bay',
        x: 30,
        y: 30,
        width: 100,
        height: 90,
        areaSqM: 20,
        status: 'dock',
        cleanliness: 100,
        vacant: true,
        lastSchedule: 'Auto station active',
        doors: [{ x: 130, y: 75 }],
        waypoints: [{ x: 70, y: 70 }]
      },
      {
        id: 'a301',
        name: 'Textile & Fashion Atelier',
        code: 'A301',
        type: 'lab',
        x: 140,
        y: 50,
        width: 270,
        height: 220,
        areaSqM: 98,
        status: 'pending',
        cleanliness: 40,
        vacant: true,
        lastSchedule: 'Design review ended 20:00 (vacant)',
        doors: [{ x: 275, y: 270 }],
        waypoints: [{ x: 210, y: 130 }, { x: 330, y: 130 }, { x: 270, y: 190 }]
      },
      {
        id: 'a302',
        name: 'Industrial Design Studio',
        code: 'A302',
        type: 'classroom',
        x: 430,
        y: 50,
        width: 280,
        height: 220,
        areaSqM: 102,
        status: 'pending',
        cleanliness: 48,
        vacant: true,
        lastSchedule: 'Prototyping session completed 20:45 (vacant)',
        doors: [{ x: 570, y: 270 }],
        waypoints: [{ x: 500, y: 130 }, { x: 640, y: 130 }, { x: 570, y: 190 }]
      },
      {
        id: 'a_corridor',
        name: 'Hämeentie Atrium Gallery',
        code: 'A-GAL',
        type: 'corridor',
        x: 140,
        y: 280,
        width: 570,
        height: 70,
        areaSqM: 135,
        status: 'pending',
        cleanliness: 75,
        vacant: true,
        lastSchedule: 'Exhibition hall night lights on low',
        doors: [{ x: 275, y: 280 }, { x: 570, y: 280 }],
        waypoints: [{ x: 210, y: 315 }, { x: 420, y: 315 }, { x: 630, y: 315 }]
      }
    ],
    trashItems: [
      {
        id: 'tr_a1',
        type: 'paper_sheet',
        label: 'Discarded Tracing Paper Scraps',
        x: 230,
        y: 150,
        weightGrams: 30,
        collected: false,
        roomId: 'a301'
      },
      {
        id: 'tr_a2',
        type: 'coffee_cup',
        label: 'Ceramics Cafe Cup',
        x: 520,
        y: 160,
        weightGrams: 40,
        collected: false,
        roomId: 'a302'
      }
    ],
    spills: [
      {
        id: 'sp_a1',
        x: 250,
        y: 180,
        radius: 18,
        type: 'water_slush',
        cleaned: false,
        roomId: 'a301'
      }
    ]
  },
  myyrmaki: {
    id: 'myyrmaki',
    name: 'Myyrmäki Campus',
    city: 'Vantaa',
    wing: 'Industrial Technology & Business Wing',
    floor: 'Floor 1',
    description: 'Electric mobility labs, business administration, international student center.',
    dockPosition: { x: 70, y: 70 },
    rooms: [
      {
        id: 'dock_bay_m',
        name: 'Auto-Dock Bay Myyrmäki',
        code: 'DM-10',
        type: 'dock_bay',
        x: 30,
        y: 30,
        width: 100,
        height: 90,
        areaSqM: 20,
        status: 'dock',
        cleanliness: 100,
        vacant: true,
        lastSchedule: 'Auto station active',
        doors: [{ x: 130, y: 75 }],
        waypoints: [{ x: 70, y: 70 }]
      },
      {
        id: 'my101',
        name: 'Automotive Powertrain Lab',
        code: 'MY101',
        type: 'lab',
        x: 140,
        y: 50,
        width: 270,
        height: 220,
        areaSqM: 115,
        status: 'pending',
        cleanliness: 52,
        vacant: true,
        lastSchedule: 'Battery safety testing concluded 20:30 (vacant)',
        doors: [{ x: 275, y: 270 }],
        waypoints: [{ x: 210, y: 130 }, { x: 330, y: 130 }, { x: 270, y: 190 }]
      },
      {
        id: 'my102',
        name: 'Global Business Arena',
        code: 'MY102',
        type: 'classroom',
        x: 430,
        y: 50,
        width: 280,
        height: 220,
        areaSqM: 108,
        status: 'pending',
        cleanliness: 60,
        vacant: true,
        lastSchedule: 'Supply chain evening lecture ended 21:00 (vacant)',
        doors: [{ x: 570, y: 270 }],
        waypoints: [{ x: 500, y: 130 }, { x: 640, y: 130 }, { x: 570, y: 190 }]
      },
      {
        id: 'my_corridor',
        name: 'Main Technology Concourse',
        code: 'MY-CON',
        type: 'corridor',
        x: 140,
        y: 280,
        width: 570,
        height: 70,
        areaSqM: 150,
        status: 'pending',
        cleanliness: 68,
        vacant: true,
        lastSchedule: 'Night maintenance schedule running',
        doors: [{ x: 275, y: 280 }, { x: 570, y: 280 }],
        waypoints: [{ x: 210, y: 315 }, { x: 420, y: 315 }, { x: 630, y: 315 }]
      }
    ],
    trashItems: [
      {
        id: 'tr_m1',
        type: 'snack_wrapper',
        label: 'Fazer Salmiakki Wrapper',
        x: 230,
        y: 150,
        weightGrams: 15,
        collected: false,
        roomId: 'my101'
      },
      {
        id: 'tr_m2',
        type: 'plastic_bottle',
        label: 'Whey Protein Bottle',
        x: 520,
        y: 160,
        weightGrams: 45,
        collected: false,
        roomId: 'my102'
      }
    ],
    spills: [
      {
        id: 'sp_m1',
        x: 260,
        y: 175,
        radius: 20,
        type: 'water_slush',
        cleaned: false,
        roomId: 'my101'
      }
    ]
  }
};

export const INITIAL_TELEMETRY: RobotTelemetry = {
  id: 'MET-CB01',
  name: 'SisuBot One',
  model: 'Metropolia CleanBot Mark IV Autonomous Scrubber & Debris Collector',
  state: 'idle_docked',
  cleanMode: 'vacuum_mop',
  batteryPct: 96,
  batteryVoltage: 51.2,
  trashHopperLiters: 4.8,
  trashHopperMaxLiters: 35.0,
  trashKgCollected: 1.4,
  freshWaterPct: 92,
  dirtyWaterPct: 8,
  rollerMopHealthPct: 94,
  rollerRpm: 280,
  mopDownPressureKg: 18,
  suctionPowerWatts: 450,
  cleaningSpeedM2PerHour: 620,
  totalAreaCleanedSqM: 42,
  currentRoomId: 'dock_bay',
  soundDba: 46.5,
  lidarScanRateHz: 30,
  position: { x: 70, y: 70, angle: 0 },
  targetWaypoint: null,
  path: [],
  odometryDistanceM: 84.5,
  uvcSanitizationActive: true,
  lightsActive: true
};

export const INITIAL_LOGS: OperationalLog[] = [
  {
    id: 'log_01',
    timestamp: '21:00:00',
    category: 'dock',
    message: 'Off-hours autonomous shift initiated. Metropolia building access granted via API.',
    severity: 'info'
  },
  {
    id: 'log_02',
    timestamp: '21:00:15',
    category: 'navigation',
    message: 'Solid-state LiDAR SLAM map calibrated. Localization confidence: 99.8%.',
    severity: 'info'
  },
  {
    id: 'log_03',
    timestamp: '21:01:05',
    category: 'dock',
    message: 'Auto-Dock Bay inspection passed: Fresh water 92%, waste chute empty, battery 96%.',
    severity: 'success'
  }
];
