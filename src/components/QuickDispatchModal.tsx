import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  Droplet, 
  Trash2, 
  Sparkles, 
  Send, 
  CheckCircle 
} from 'lucide-react';
import { Room } from '../types/cleanbot';
import { sound } from '../utils/audio';

interface QuickDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onDispatch: (roomId: string, incidentType: string, note: string) => void;
}

export const QuickDispatchModal: React.FC<QuickDispatchModalProps> = ({
  isOpen,
  onClose,
  rooms,
  onDispatch
}) => {
  if (!isOpen) return null;

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms.find(r => r.type !== 'dock_bay')?.id || '');
  const [incidentType, setIncidentType] = useState<'coffee_spill' | 'trash_mess' | 'winter_slush' | 'urgent_prep'>('coffee_spill');
  const [note, setNote] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatch(selectedRoomId, incidentType, note);
    sound.playChime();
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0e1626] rounded-xl border border-slate-700/80 w-full max-w-md p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-[#ff5a00]" />
          <h3 className="text-base font-bold text-white">Report Campus Incident & Dispatch</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Direct CleanBot to handle unscheduled debris or spills without calling night staff.
        </p>

        {dispatched ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="text-sm font-bold text-white">CleanBot Dispatched!</h4>
            <p className="text-xs text-slate-400">
              Optimal navigation trajectory calculated. CleanBot is en route.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Room selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Room / Zone:
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.code} - {room.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Incident Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Incident Category:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIncidentType('coffee_spill')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    incidentType === 'coffee_spill'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : 'bg-[#090f1a] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplet className="w-4 h-4 text-amber-400" />
                  <span>Coffee / Drink Spill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncidentType('trash_mess')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    incidentType === 'trash_mess'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                      : 'bg-[#090f1a] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-4 h-4 text-purple-400" />
                  <span>Overflowing Trash / Cups</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncidentType('winter_slush')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    incidentType === 'winter_slush'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                      : 'bg-[#090f1a] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Winter Slush / Mud</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIncidentType('urgent_prep')}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                    incidentType === 'urgent_prep'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-[#090f1a] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Priority Turnaround</span>
                </button>
              </div>
            </div>

            {/* Note input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Operational Notes (Optional):
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Near podium, watch out for projector cables"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Robot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
