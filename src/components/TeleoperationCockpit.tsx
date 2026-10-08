import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  RotateCw, 
  Zap, 
  Volume2, 
  Lightbulb, 
  Sparkles, 
  Trash2, 
  Droplet, 
  Compass, 
  Eye, 
  ShieldAlert 
} from 'lucide-react';
import { RobotTelemetry } from '../types/cleanbot';
import { sound } from '../utils/audio';

// Reference generated image assets
import campusAtriumImg from '../assets/images/metropolia_campus_atrium_1790954262023.jpg';
import cleanbotUnitImg from '../assets/images/cleanbot_commercial_unit_1790954279519.jpg';

interface TeleoperationCockpitProps {
  telemetry: RobotTelemetry;
  onDrive: (dx: number, dy: number, dAngle: number) => void;
  onToggleLights: () => void;
  onToggleUvc: () => void;
  onEmptyHopper: () => void;
}

export const TeleoperationCockpit: React.FC<TeleoperationCockpitProps> = ({
  telemetry,
  onDrive,
  onToggleLights,
  onToggleUvc,
  onEmptyHopper
}) => {
  const [cameraView, setCameraView] = useState<'hallway_fpv' | 'robot_exterior'>('hallway_fpv');
  const [boostActive, setBoostActive] = useState(false);

  const handleDriveStep = (direction: 'forward' | 'backward' | 'left' | 'right') => {
    const speed = boostActive ? 16 : 8;
    const currentAngle = telemetry.position.angle;

    if (direction === 'forward') {
      const dx = Math.cos(currentAngle) * speed;
      const dy = Math.sin(currentAngle) * speed;
      onDrive(dx, dy, 0);
      sound.playMopClean();
    } else if (direction === 'backward') {
      const dx = -Math.cos(currentAngle) * (speed * 0.7);
      const dy = -Math.sin(currentAngle) * (speed * 0.7);
      onDrive(dx, dy, 0);
    } else if (direction === 'left') {
      onDrive(0, 0, -0.3);
    } else if (direction === 'right') {
      onDrive(0, 0, 0.3);
    }
  };

  const handleChime = () => {
    sound.playChime();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1 & 2: First-Person Camera Feed with LiDAR HUD Overlay */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="relative bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl aspect-[16/9] flex items-center justify-center">
          {/* Camera Stream Background */}
          <img
            src={cameraView === 'hallway_fpv' ? campusAtriumImg : cleanbotUnitImg}
            alt="CleanBot Teleoperation Feed"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85 select-none"
          />

          {/* Dark Vignette and Night-Vision Lighting Filter if headlights off */}
          <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
            telemetry.lightsActive ? 'bg-black/20' : 'bg-blue-950/40 mix-blend-multiply'
          }`} />

          {/* HUD Overlay Graphics */}
          <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-semibold">FEED: MET-CAM-01 (1080p 60FPS)</span>
                <span className="text-slate-400">·</span>
                <span className="text-cyan-400">LiDAR 30Hz ACTIVE</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setCameraView(cameraView === 'hallway_fpv' ? 'robot_exterior' : 'hallway_fpv')}
                  className="px-2.5 py-1 text-xs font-medium bg-black/70 hover:bg-black/90 text-white rounded border border-white/20 backdrop-blur-md transition-colors"
                >
                  Switch: {cameraView === 'hallway_fpv' ? 'Exterior View' : 'Forward FPV'}
                </button>
              </div>
            </div>

            {/* Center Crosshairs & Obstacle Target Bounding Box */}
            <div className="self-center flex flex-col items-center justify-center relative">
              <div className="w-32 h-32 border border-cyan-400/40 rounded-full flex items-center justify-center relative animate-pulse">
                <div className="w-1.5 h-1.5 bg-[#ff5a00] rounded-full"></div>
                {/* Horizontal & Vertical Reticles */}
                <div className="absolute w-full h-px bg-cyan-400/30"></div>
                <div className="absolute h-full w-px bg-cyan-400/30"></div>
              </div>

              {/* Simulated Detected Floor Obstacle Bounding Box */}
              <div className="absolute bottom-[-45px] w-28 h-16 border-2 border-dashed border-amber-400/70 rounded bg-amber-400/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-mono text-amber-300 font-bold tracking-wider">
                  OBSTACLE: RECYCLING BIN
                </span>
                <span className="text-[8px] font-mono text-white">
                  DIST: 2.4m · AVOIDANCE READY
                </span>
              </div>
            </div>

            {/* Bottom HUD Telemetry Strip */}
            <div className="flex items-center justify-between text-xs font-mono text-white bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <div className="flex items-center gap-4">
                <span>SPEED: <strong className="text-emerald-400">1.2 km/h</strong></span>
                <span>ROLLER: <strong className="text-sky-400">{telemetry.rollerRpm} RPM</strong></span>
                <span>DOWN-PRESSURE: <strong className="text-white">{telemetry.mopDownPressureKg} kg</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <span>BATTERY: <strong className="text-emerald-400">{telemetry.batteryPct}%</strong></span>
                <span>HOPPER: <strong className="text-amber-400">{telemetry.trashHopperLiters.toFixed(1)}L</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Viewport notes */}
        <p className="text-xs text-slate-400">
          Manual teleoperation allows Metropolia security or facilities staff to remotely inspect rooms, navigate tight furniture aisles, or inspect late-night spills.
        </p>
      </div>

      {/* Column 3: Remote Drive Controls & Actuators */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#ff5a00]" />
            <span>Virtual Drive & Actuator Console</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time low-latency teleoperation over Metropolia Campus Wi-Fi 6 mesh
          </p>
        </div>

        {/* Directional Pad / Joystick */}
        <div className="flex flex-col items-center justify-center gap-2 py-2">
          {/* Forward */}
          <button
            onClick={() => handleDriveStep('forward')}
            className="w-16 h-14 bg-slate-800 hover:bg-[#ff5a00] hover:text-white text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Drive Forward"
          >
            <ArrowUp className="w-6 h-6" />
          </button>

          {/* Left / Stop / Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDriveStep('left')}
              className="w-14 h-14 bg-slate-800 hover:bg-[#ff5a00] hover:text-white text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Pivot Left"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setBoostActive(!boostActive)}
              className={`w-16 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all shadow-md active:scale-95 border ${
                boostActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 mb-0.5" />
              <span>{boostActive ? 'TURBO' : 'NORM'}</span>
            </button>

            <button
              onClick={() => handleDriveStep('right')}
              className="w-14 h-14 bg-slate-800 hover:bg-[#ff5a00] hover:text-white text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Pivot Right"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Reverse */}
          <button
            onClick={() => handleDriveStep('backward')}
            className="w-16 h-14 bg-slate-800 hover:bg-[#ff5a00] hover:text-white text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Drive Backward"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>

        {/* Actuator Toggles */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300">CleanBot Subsystem Overrides:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleLights}
              className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors ${
                telemetry.lightsActive
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Headlights</span>
            </button>

            <button
              onClick={onToggleUvc}
              className={`p-2.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors ${
                telemetry.uvcSanitizationActive
                  ? 'bg-cyan-950/60 border-cyan-600 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>UV-C Floor Pass</span>
            </button>

            <button
              onClick={handleChime}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Play Warning Chime</span>
            </button>

            <button
              onClick={onEmptyHopper}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>Cycle Waste Claw</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
