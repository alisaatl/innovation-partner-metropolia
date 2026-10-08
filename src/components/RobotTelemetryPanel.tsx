import React from 'react';
import { 
  Battery, 
  Trash2, 
  Droplet, 
  Gauge, 
  Volume2, 
  RotateCw, 
  Sliders, 
  Zap, 
  Sparkles, 
  Radio, 
  Octagon, 
  Home, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { RobotTelemetry, CleanMode, RobotState } from '../types/cleanbot';
import { sound } from '../utils/audio';

interface RobotTelemetryPanelProps {
  telemetry: RobotTelemetry;
  onChangeMode: (mode: CleanMode) => void;
  onReturnToDock: () => void;
  onEmptyHopper: () => void;
  onEmergencyStop: () => void;
  onToggleLights: () => void;
  onToggleUvc: () => void;
}

export const RobotTelemetryPanel: React.FC<RobotTelemetryPanelProps> = ({
  telemetry,
  onChangeMode,
  onReturnToDock,
  onEmptyHopper,
  onEmergencyStop,
  onToggleLights,
  onToggleUvc
}) => {
  const hopperPct = Math.round((telemetry.trashHopperLiters / telemetry.trashHopperMaxLiters) * 100);

  const getStateBadge = (state: RobotState) => {
    switch (state) {
      case 'idle_docked':
        return { label: 'Docked & Ready', color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
      case 'cleaning_dual':
        return { label: 'Autonomous Trash + Mop', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'collecting_trash':
        return { label: 'Collecting Debris', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
      case 'mopping_floor':
        return { label: 'Mopping & Sanitizing', color: 'text-sky-400 bg-sky-950/60 border-sky-800' };
      case 'navigating':
        return { label: 'Transit / Pathing', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      case 'emptying_dock':
        return { label: 'Emptying to Chute', color: 'text-purple-400 bg-purple-950/60 border-purple-800' };
      case 'emergency_stop':
        return { label: 'E-STOP HALT', color: 'text-rose-400 bg-rose-950/60 border-rose-800' };
      default:
        return { label: 'Paused', color: 'text-slate-400 bg-slate-900 border-slate-700' };
    }
  };

  const badge = getStateBadge(telemetry.state);

  return (
    <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-4 flex flex-col gap-4">
      {/* Robot Identity Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{telemetry.name}</span>
            <span className="text-xs text-slate-500 font-mono">[{telemetry.id}]</span>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[280px]">
            {telemetry.model}
          </p>
        </div>

        <div className={`px-2.5 py-1 text-xs font-medium rounded border ${badge.color}`}>
          {badge.label}
        </div>
      </div>

      {/* Primary Hardware Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Trash Hopper */}
        <div className="bg-[#090f1a] p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Debris Hopper</span>
            </span>
            <span className="font-mono text-slate-300">{hopperPct}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {telemetry.trashHopperLiters.toFixed(1)} <span className="text-xs text-slate-500">/ 35.0 L</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full transition-all duration-500 ${hopperPct > 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${hopperPct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {telemetry.trashKgCollected.toFixed(2)} kg collected tonight
          </div>
        </div>

        {/* Metric 2: Twin Roller Mop & Water */}
        <div className="bg-[#090f1a] p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
              <span>Fresh Water</span>
            </span>
            <span className="font-mono text-slate-300">{telemetry.freshWaterPct}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {telemetry.freshWaterPct} <span className="text-xs text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${telemetry.freshWaterPct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            Grey water tank: {telemetry.dirtyWaterPct}%
          </div>
        </div>

        {/* Metric 3: Battery SoC */}
        <div className="bg-[#090f1a] p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Battery SoC</span>
            </span>
            <span className="font-mono text-emerald-400">{telemetry.batteryPct}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {telemetry.batteryPct} <span className="text-xs text-slate-500">%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${telemetry.batteryPct}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">
            {telemetry.batteryVoltage.toFixed(1)} V · LiFePO4 48V
          </div>
        </div>

        {/* Metric 4: Sound & Compliance */}
        <div className="bg-[#090f1a] p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Acoustic Output</span>
            </span>
            <span className="font-mono text-teal-400">&lt; 48 dBA</span>
          </div>
          <div className="text-lg font-bold text-white font-mono tabular-nums">
            {telemetry.soundDba} <span className="text-xs text-slate-500">dBA</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-teal-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (telemetry.soundDba / 60) * 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" />
            <span>Campus Quiet compliant</span>
          </div>
        </div>
      </div>

      {/* Operational Mode Segmented Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400">Autonomous Operation Mode:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#090f1a] rounded-lg border border-slate-800">
          <button
            onClick={() => { onChangeMode('vacuum_mop'); sound.playChime(); }}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-left flex flex-col ${
              telemetry.cleanMode === 'vacuum_mop'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-semibold text-white">Dual: Trash + Mop</span>
            <span className="text-[10px] text-slate-400">Picks up debris & scrubs</span>
          </button>

          <button
            onClick={() => { onChangeMode('trash_only'); sound.playChime(); }}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-left flex flex-col ${
              telemetry.cleanMode === 'trash_only'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-semibold text-white">Trash Pickup Only</span>
            <span className="text-[10px] text-slate-400">Dry cyclonic intake</span>
          </button>

          <button
            onClick={() => { onChangeMode('deep_mop'); sound.playChime(); }}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-left flex flex-col ${
              telemetry.cleanMode === 'deep_mop'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-semibold text-white">Deep Scrubbing</span>
            <span className="text-[10px] text-slate-400">18kg pressure & ozonated water</span>
          </button>

          <button
            onClick={() => { onChangeMode('silent_night'); sound.playChime(); }}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-left flex flex-col ${
              telemetry.cleanMode === 'silent_night'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-semibold text-white">Silent Night</span>
            <span className="text-[10px] text-slate-400">&lt; 42 dBA ultra quiet sweep</span>
          </button>
        </div>
      </div>

      {/* Control Actuators & Auto-Dock Station Commands */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToDock}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Auto-Dock</span>
          </button>

          <button
            onClick={onEmptyHopper}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Empty Trash Hopper</span>
          </button>

          <button
            onClick={onToggleLights}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1 ${
              telemetry.lightsActive
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Headlights</span>
          </button>

          <button
            onClick={onToggleUvc}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1 ${
              telemetry.uvcSanitizationActive
                ? 'bg-cyan-950/60 border-cyan-600 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>UV-C Sanitizer</span>
          </button>
        </div>

        <button
          onClick={onEmergencyStop}
          className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-900/40"
        >
          <Octagon className="w-3.5 h-3.5" />
          <span>E-STOP</span>
        </button>
      </div>
    </div>
  );
};
