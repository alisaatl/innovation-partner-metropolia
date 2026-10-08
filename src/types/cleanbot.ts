export type RobotState = 
  | 'idle_docked'
  | 'cleaning_dual'
  | 'collecting_trash'
  | 'mopping_floor'
  | 'navigating'
  | 'emptying_dock'
  | 'paused'
  | 'emergency_stop';

export type CleanMode = 'vacuum_mop' | 'trash_only' | 'deep_mop' | 'silent_night';

export type CampusId = 'myllypuro' | 'karamalmi' | 'arabia' | 'myyrmaki';

export interface TrashItem {
  id: string;
  type: 'coffee_cup' | 'paper_sheet' | 'snack_wrapper' | 'plastic_bottle' | 'dust_clump' | 'apple_core';
  label: string;
  x: number;
  y: number;
  weightGrams: number;
  collected: boolean;
  roomId: string;
}

export interface SpillItem {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'coffee' | 'water_slush' | 'energy_drink';
  cleaned: boolean;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  code: string;
  type: 'classroom' | 'corridor' | 'lecture_hall' | 'lab' | 'lounge' | 'dock_bay';
  x: number;
  y: number;
  width: number;
  height: number;
  areaSqM: number;
  status: 'pending' | 'in_progress' | 'completed' | 'dock';
  cleanliness: number; // 0 to 100%
  vacant: boolean;
  lastSchedule: string; // e.g. "Peppi: Biomedical lecture ended 20:15"
  doors: { x: number; y: number }[];
  waypoints: { x: number; y: number }[];
}

export interface CampusLayout {
  id: CampusId;
  name: string;
  city: string;
  wing: string;
  floor: string;
  description: string;
  rooms: Room[];
  trashItems: TrashItem[];
  spills: SpillItem[];
  dockPosition: { x: number; y: number };
}

export interface RobotTelemetry {
  id: string;
  name: string;
  model: string;
  state: RobotState;
  cleanMode: CleanMode;
  batteryPct: number;
  batteryVoltage: number;
  trashHopperLiters: number;
  trashHopperMaxLiters: number;
  trashKgCollected: number;
  freshWaterPct: number;
  dirtyWaterPct: number;
  rollerMopHealthPct: number;
  rollerRpm: number;
  mopDownPressureKg: number;
  suctionPowerWatts: number;
  cleaningSpeedM2PerHour: number;
  totalAreaCleanedSqM: number;
  currentRoomId: string;
  soundDba: number;
  lidarScanRateHz: number;
  position: { x: number; y: number; angle: number };
  targetWaypoint: { x: number; y: number } | null;
  path: { x: number; y: number }[];
  odometryDistanceM: number;
  uvcSanitizationActive: boolean;
  lightsActive: boolean;
}

export interface OperationalLog {
  id: string;
  timestamp: string;
  category: 'trash' | 'mop' | 'dock' | 'navigation' | 'alert';
  message: string;
  roomId?: string;
  severity: 'info' | 'success' | 'warning';
}

export interface ShiftSummary {
  shiftStart: string;
  shiftEnd: string;
  targetAreaSqM: number;
  completedAreaSqM: number;
  trashCollectedKg: number;
  waterRecycledLiters: number;
  laborHoursSaved: number;
  classroomsTurnedOver: number;
  qualityScorePct: number;
}
