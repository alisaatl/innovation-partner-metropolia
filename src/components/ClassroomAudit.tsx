import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  RotateCcw, 
  AlertCircle, 
  Check, 
  Printer, 
  Sparkles,
  Download,
  Building
} from 'lucide-react';
import { Room } from '../types/cleanbot';

interface ClassroomAuditProps {
  rooms: Room[];
  onRescrubRoom: (room: Room) => void;
}

export const ClassroomAudit: React.FC<ClassroomAuditProps> = ({
  rooms,
  onRescrubRoom
}) => {
  const [filter, setFilter] = useState<'all' | 'ready' | 'pending'>('all');
  const [reportExported, setReportExported] = useState(false);

  const nonDockRooms = rooms.filter(r => r.type !== 'dock_bay');

  const filteredRooms = nonDockRooms.filter(r => {
    if (filter === 'ready') return r.cleanliness >= 90;
    if (filter === 'pending') return r.cleanliness < 90;
    return true;
  });

  const readyCount = nonDockRooms.filter(r => r.cleanliness >= 90).length;
  const avgCleanliness = Math.round(
    nonDockRooms.reduce((acc, r) => acc + r.cleanliness, 0) / (nonDockRooms.length || 1)
  );

  const handleExport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Readiness Summary */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Metropolia 08:00 AM Classroom Readiness Audit</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              VERIFIED AUTONOMOUS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated off-hours verification ensures zero dust, emptied paper waste, sanitized desks, and dry anti-slip floors before morning staff and students arrive.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Readiness Score</div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {avgCleanliness}% <span className="text-xs font-normal text-slate-400">({readyCount}/{nonDockRooms.length} ready)</span>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {reportExported ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            <span>{reportExported ? 'Audit Log Exported' : 'Export Daily Log'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#0e1626] rounded-lg border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Spaces ({nonDockRooms.length})
          </button>
          <button
            onClick={() => setFilter('ready')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'ready'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ready for 08:00 Lecture ({readyCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === 'pending'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Queue / Scheduled ({nonDockRooms.length - readyCount})
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Nordic Hygiene Standard: INSTA 800 Level 5 (Hospital-Grade)
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090f1a] text-slate-400 font-semibold">
                <th className="py-3 px-4">Room Code & Name</th>
                <th className="py-3 px-4">Space Type</th>
                <th className="py-3 px-4">Floor Area</th>
                <th className="py-3 px-4">Off-Hours Status</th>
                <th className="py-3 px-4">Debris & Trash Check</th>
                <th className="py-3 px-4">Mopping & Disinfection</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRooms.map((room) => {
                const isReady = room.cleanliness >= 90;
                return (
                  <tr key={room.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono">{room.code}</div>
                      <div className="text-slate-400 text-[11px]">{room.name}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 capitalize">
                      {room.type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      {room.areaSqM} m²
                    </td>
                    <td className="py-3.5 px-4">
                      {isReady ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>08:00 READY</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/80 text-amber-400 border border-amber-800">
                          <Clock className="w-3 h-3" />
                          <span>SCHEDULED</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {isReady ? (
                        <span className="text-emerald-400">100% Emptied & Vacuumed</span>
                      ) : (
                        <span className="text-slate-400">Off-hours pass queued</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${room.cleanliness}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-200">{room.cleanliness}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onRescrubRoom(room)}
                        className="px-2.5 py-1 text-[11px] font-medium text-[#ff5a00] hover:text-white hover:bg-[#ff5a00] border border-[#ff5a00]/40 rounded transition-colors"
                      >
                        {isReady ? 'Re-scrub Room' : 'Start Clean'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
