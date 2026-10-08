import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Play, 
  FileText, 
  AlertCircle,
  DoorOpen,
  Sparkles,
  Trash2
} from 'lucide-react';
import { OperationalLog, Room } from '../types/cleanbot';

interface OffHoursScheduleProps {
  logs: OperationalLog[];
  rooms: Room[];
  currentSimSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
  onInstantCompleteShift: () => void;
  onDispatchToRoom: (room: Room) => void;
}

export const OffHoursSchedule: React.FC<OffHoursScheduleProps> = ({
  logs,
  rooms,
  currentSimSpeed,
  onChangeSimSpeed,
  onInstantCompleteShift,
  onDispatchToRoom
}) => {
  const scheduleSlots = [
    {
      time: '21:00 - 22:30',
      phase: 'Phase 1: High-Traffic Corridors & Atrium',
      desc: 'Entrance slush extraction, dust suppression, and high-traffic corridor spine mopping.',
      status: 'active',
      staff: '0 staff present (fully autonomous)'
    },
    {
      time: '22:30 - 01:00',
      phase: 'Phase 2: Health & Nursing Classrooms (M201, M202)',
      desc: 'PIR vacancy verification, desk trash collection, and hospital-grade floor scrubbing.',
      status: 'upcoming',
      staff: '0 staff present (fully autonomous)'
    },
    {
      time: '01:00 - 03:30',
      phase: 'Phase 3: Smart Studios & Lounges (M203, M204)',
      desc: 'Trash hopper dump at auto-chute, refill electrolytic water, deep scrub study zones.',
      status: 'upcoming',
      staff: '0 staff present (fully autonomous)'
    },
    {
      time: '03:30 - 05:00',
      phase: 'Phase 4: Concourse Mopping & Inspection Run',
      desc: 'Full floor drying verification, camera photo audit for facility managers, UV-C pass.',
      status: 'upcoming',
      staff: '0 staff present (fully autonomous)'
    },
    {
      time: '05:00 - 06:30',
      phase: 'Phase 5: Auto-Dock & Fast Recharge',
      desc: 'Docking bay auto-purge of grey water, self-cleaning roller cycle, 100% battery top-off.',
      status: 'upcoming',
      staff: '0 staff present (fully autonomous)'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Column 1 & 2: Shift Schedule & Classroom Vacancy Gatekeeper */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Banner: Zero-Staff Off-Hours Campus Policy */}
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ff5a00]/10 border border-[#ff5a00]/30 flex items-center justify-center text-[#ff5a00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Metropolia Off-Hours Autonomous Shift Engine</h3>
                <p className="text-xs text-slate-400">
                  Campus locked from 21:00 to 06:00 · Automated Peppi / Tuudo room booking vacancy checks
                </p>
              </div>
            </div>

            {/* Sim Speed selector */}
            <div className="flex items-center gap-1 bg-[#090f1a] p-1 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2">Sim Speed:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSimSpeed(s)}
                  className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                    currentSimSpeed === s
                      ? 'bg-[#ff5a00] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
              <button
                onClick={onInstantCompleteShift}
                className="px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 ml-1 rounded hover:bg-emerald-950/40 transition-colors"
                title="Simulate complete overnight shift instantly"
              >
                Instant Clean
              </button>
            </div>
          </div>

          {/* Schedule Phases Timeline */}
          <div className="flex flex-col gap-2.5 mt-2">
            {scheduleSlots.map((slot, idx) => (
              <div
                key={idx}
                className="bg-[#090f1a] p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-24 shrink-0 font-mono text-xs text-[#ff5a00] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.time}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{slot.phase}</h4>
                    <p className="text-[11px] text-slate-400">{slot.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {slot.staff}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Vacancy & Safety Interlocks */}
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-sky-400" />
              <span>Peppi Timetable & Room Vacancy Interlocks</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Rooms · 100% Vacant Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rooms.filter(r => r.type !== 'dock_bay').map((room) => (
              <div
                key={room.id}
                className="bg-[#090f1a] p-3 rounded-lg border border-slate-800 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{room.code}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{room.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{room.lastSchedule}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                    VACANT
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-mono">Cleanliness: {room.cleanliness}%</span>
                  <button
                    onClick={() => onDispatchToRoom(room)}
                    className="text-[11px] text-[#ff5a00] hover:text-[#ff7426] font-medium transition-colors"
                  >
                    Queue Clean →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: Live Shift Event Feed */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff5a00]" />
            <span>Autonomous Audit Log</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">{logs.length} events</span>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[#090f1a] p-2.5 rounded-lg border border-slate-800/80 text-xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-[#ff5a00]">{log.timestamp}</span>
                <span className="uppercase text-slate-500">{log.category}</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
