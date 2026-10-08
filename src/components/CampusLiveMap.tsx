import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Eye, 
  Layers, 
  Sparkles, 
  PlusCircle, 
  Compass, 
  CheckCircle2, 
  Clock, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { CampusLayout, TrashItem, SpillItem, Room, RobotTelemetry, CampusId } from '../types/cleanbot';
import { sound } from '../utils/audio';

interface CampusLiveMapProps {
  campus: CampusLayout;
  onSelectCampus: (id: CampusId) => void;
  telemetry: RobotTelemetry;
  mopTrail: { x: number; y: number; opacity: number }[];
  onDispatchToRoom: (room: Room) => void;
  onDispatchToCoordinate: (x: number, y: number) => void;
  onAddTrash: (x: number, y: number) => void;
  onAddSpill: (x: number, y: number) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  allCampuses: Record<string, CampusLayout>;
}

export const CampusLiveMap: React.FC<CampusLiveMapProps> = ({
  campus,
  onSelectCampus,
  telemetry,
  mopTrail,
  onDispatchToRoom,
  onDispatchToCoordinate,
  onAddTrash,
  onAddSpill,
  selectedRoom,
  setSelectedRoom,
  allCampuses
}) => {
  const [showLidar, setShowLidar] = useState(true);
  const [showCoverage, setShowCoverage] = useState(true);
  const [addMode, setAddMode] = useState<'none' | 'trash' | 'spill'>('none');

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 400 / rect.height;
    const clickX = Math.round((e.clientX - rect.left) * scaleX);
    const clickY = Math.round((e.clientY - rect.top) * scaleY);

    if (addMode === 'trash') {
      onAddTrash(clickX, clickY);
      sound.playTrashCollect();
      setAddMode('none');
    } else if (addMode === 'spill') {
      onAddSpill(clickX, clickY);
      sound.playMopClean();
      setAddMode('none');
    } else {
      // Normal click: navigate to this spot
      onDispatchToCoordinate(clickX, clickY);
    }
  };

  const getStatusColor = (room: Room) => {
    if (room.type === 'dock_bay') return 'fill-indigo-950/40 stroke-indigo-600/50';
    if (room.status === 'completed') return 'fill-emerald-950/25 stroke-emerald-600/50';
    if (room.status === 'in_progress') return 'fill-amber-950/30 stroke-amber-500/70';
    return 'fill-slate-900/60 stroke-slate-700/60';
  };

  const uncollectedTrash = campus.trashItems.filter(t => !t.collected);
  const uncleanedSpills = campus.spills.filter(s => !s.cleaned);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Map Toolbar: Campus Selector & Operational Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1626] p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Campus Hub:</span>
          {(['myllypuro', 'karamalmi', 'arabia', 'myyrmaki'] as CampusId[]).map((cId) => {
            const c = allCampuses[cId];
            const isSelected = campus.id === cId;
            return (
              <button
                key={cId}
                onClick={() => onSelectCampus(cId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#ff5a00] text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {c?.name.replace(' Campus', '')}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggles */}
          <button
            onClick={() => setShowLidar(!showLidar)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              showLidar
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>LiDAR Rays</span>
          </button>

          <button
            onClick={() => setShowCoverage(!showCoverage)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              showCoverage
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Floor Sanitization Heatmap</span>
          </button>

          {/* Test simulation drop buttons */}
          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            onClick={() => setAddMode(addMode === 'trash' ? 'none' : 'trash')}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              addMode === 'trash'
                ? 'bg-amber-500 text-black border-amber-400 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Simulate Trash Drop</span>
          </button>

          <button
            onClick={() => setAddMode(addMode === 'spill' ? 'none' : 'spill')}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              addMode === 'spill'
                ? 'bg-blue-500 text-white border-blue-400 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Simulate Spill</span>
          </button>
        </div>
      </div>

      {/* Main Floorplan Canvas Box */}
      <div className="relative bg-[#080d15] rounded-xl border border-slate-800 p-2 overflow-hidden shadow-2xl">
        {/* Floorplan metadata overlay */}
        <div className="absolute top-4 left-4 z-10 bg-[#0b1019]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{campus.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{campus.wing}</span>
            <span className="text-slate-500">·</span>
            <span className="text-[#ff5a00] font-mono">{campus.floor}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
            <span>Remaining Debris: {uncollectedTrash.length} items</span>
            <span>·</span>
            <span>Spills: {uncleanedSpills.length}</span>
            <span>·</span>
            <span>Cleanbot Pose: ({Math.round(telemetry.position.x)}, {Math.round(telemetry.position.y)})</span>
          </div>
        </div>

        {addMode !== 'none' && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500/90 text-slate-950 font-medium px-3 py-1.5 rounded text-xs animate-bounce pointer-events-none flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Click anywhere on the floorplan to place simulated {addMode}!</span>
          </div>
        )}

        {/* SVG Floorplan Viewport */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto max-h-[560px] cursor-crosshair select-none floorplan-grid rounded-lg"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Glossy wet mop sheen pattern */}
            <linearGradient id="wetMopSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>

            {/* LiDAR radar cone */}
            <radialGradient id="lidarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Room Rectangles and Architectural Boundaries */}
          {campus.rooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id;
            return (
              <g
                key={room.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRoom(room);
                }}
                className="cursor-pointer transition-all group"
              >
                {/* Room Floor Surface */}
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  rx={4}
                  className={`${getStatusColor(room)} transition-colors ${
                    isSelected ? 'stroke-2 stroke-[#ff5a00] fill-orange-950/20' : 'stroke-1'
                  }`}
                />

                {/* Sanitization Coverage Layer */}
                {showCoverage && room.cleanliness > 0 && room.type !== 'dock_bay' && (
                  <rect
                    x={room.x + 2}
                    y={room.y + 2}
                    width={room.width - 4}
                    height={(room.height - 4) * (room.cleanliness / 100)}
                    rx={2}
                    className="fill-emerald-500/15 pointer-events-none"
                  />
                )}

                {/* Door Openings */}
                {room.doors.map((door, dIdx) => (
                  <circle
                    key={dIdx}
                    cx={door.x}
                    cy={door.y}
                    r={3}
                    className="fill-slate-600 stroke-slate-900 stroke-1 pointer-events-none"
                  />
                ))}

                {/* Architectural Desks / Tables (for classrooms) */}
                {room.type === 'classroom' && (
                  <g className="opacity-20 pointer-events-none">
                    <rect x={room.x + 20} y={room.y + 35} width={room.width - 40} height={14} rx={2} className="fill-slate-400" />
                    <rect x={room.x + 20} y={room.y + 70} width={room.width - 40} height={14} rx={2} className="fill-slate-400" />
                    <rect x={room.x + 20} y={room.y + 105} width={room.width - 40} height={14} rx={2} className="fill-slate-400" />
                  </g>
                )}

                {/* Tiered Lecture Seating (for lecture halls) */}
                {room.type === 'lecture_hall' && (
                  <g className="opacity-20 pointer-events-none">
                    <path d={`M ${room.x + 20} ${room.y + 40} Q ${room.x + room.width / 2} ${room.y + 30} ${room.x + room.width - 20} ${room.y + 40}`} stroke="white" strokeWidth="6" fill="none" />
                    <path d={`M ${room.x + 20} ${room.y + 75} Q ${room.x + room.width / 2} ${room.y + 65} ${room.x + room.width - 20} ${room.y + 75}`} stroke="white" strokeWidth="6" fill="none" />
                    <path d={`M ${room.x + 20} ${room.y + 110} Q ${room.x + room.width / 2} ${room.y + 100} ${room.x + room.width - 20} ${room.y + 110}`} stroke="white" strokeWidth="6" fill="none" />
                  </g>
                )}

                {/* Dock station graphic */}
                {room.type === 'dock_bay' && (
                  <g className="pointer-events-none">
                    <rect x={room.x + 15} y={room.y + 25} width={50} height={40} rx={3} className="fill-indigo-900/60 stroke-indigo-400/80 stroke-1" />
                    <text x={room.x + 40} y={room.y + 48} textAnchor="middle" className="text-[9px] fill-indigo-300 font-mono font-bold">DOCK</text>
                    <path d={`M ${room.x + 40} ${room.y + 28} L ${room.x + 40} ${room.y + 36}`} stroke="#38bdf8" strokeWidth="2" />
                  </g>
                )}

                {/* Room Title & Code */}
                <text
                  x={room.x + 10}
                  y={room.y + 18}
                  className="text-[11px] font-semibold fill-slate-200 pointer-events-none select-none"
                >
                  {room.code}
                </text>
                <text
                  x={room.x + 10}
                  y={room.y + 30}
                  className="text-[9px] fill-slate-400 pointer-events-none select-none max-w-[120px] truncate"
                >
                  {room.name.length > 20 ? room.name.substring(0, 18) + '...' : room.name}
                </text>

                {/* Cleanliness Tag */}
                {room.type !== 'dock_bay' && (
                  <text
                    x={room.x + room.width - 8}
                    y={room.y + 18}
                    textAnchor="end"
                    className={`text-[10px] font-mono pointer-events-none font-medium ${
                      room.cleanliness > 85 ? 'fill-emerald-400' : room.cleanliness > 50 ? 'fill-amber-400' : 'fill-rose-400'
                    }`}
                  >
                    {room.cleanliness}% clean
                  </text>
                )}
              </g>
            );
          })}

          {/* Mop Tracks & Wet Floor Sanitization Trails */}
          {mopTrail.map((point, idx) => (
            <circle
              key={idx}
              cx={point.x}
              cy={point.y}
              r={9}
              fill="url(#wetMopSheen)"
              opacity={point.opacity}
              className="pointer-events-none transition-opacity duration-1000"
            />
          ))}

          {/* Spills on floor */}
          {campus.spills.map((spill) => {
            if (spill.cleaned) return null;
            const color = spill.type === 'coffee' ? '#78350f' : spill.type === 'energy_drink' ? '#0284c7' : '#64748b';
            return (
              <g key={spill.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onDispatchToCoordinate(spill.x, spill.y); }}>
                <circle
                  cx={spill.x}
                  cy={spill.y}
                  r={spill.radius}
                  fill={color}
                  fillOpacity="0.55"
                  className="stroke-amber-400/80 stroke-1 animate-pulse"
                />
                <circle
                  cx={spill.x + 3}
                  cy={spill.y - 2}
                  r={spill.radius * 0.4}
                  fill={color}
                  fillOpacity="0.8"
                />
                <text
                  x={spill.x}
                  y={spill.y - spill.radius - 3}
                  textAnchor="middle"
                  className="text-[8px] fill-amber-300 font-mono font-medium"
                >
                  {spill.type === 'coffee' ? 'COFFEE SPILL' : spill.type === 'energy_drink' ? 'ENERGY DRINK' : 'SLUSH PUDDLE'}
                </text>
              </g>
            );
          })}

          {/* Trash Items on Floor */}
          {campus.trashItems.map((trash) => {
            if (trash.collected) return null;
            return (
              <g
                key={trash.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDispatchToCoordinate(trash.x, trash.y);
                }}
                className="cursor-pointer group"
              >
                {/* Trash icon marker */}
                {trash.type === 'coffee_cup' && (
                  <path
                    d={`M ${trash.x - 4} ${trash.y - 5} L ${trash.x + 4} ${trash.y - 5} L ${trash.x + 3} ${trash.y + 5} L ${trash.x - 3} ${trash.y + 5} Z`}
                    className="fill-amber-600 stroke-amber-200 stroke-1"
                  />
                )}
                {trash.type === 'plastic_bottle' && (
                  <rect
                    x={trash.x - 2.5}
                    y={trash.y - 6}
                    width={5}
                    height={12}
                    rx={1.5}
                    className="fill-cyan-400/80 stroke-white stroke-1"
                  />
                )}
                {trash.type === 'paper_sheet' && (
                  <rect
                    x={trash.x - 5}
                    y={trash.y - 4}
                    width={10}
                    height={8}
                    rx={1}
                    className="fill-white stroke-slate-400 stroke-1"
                  />
                )}
                {trash.type === 'snack_wrapper' && (
                  <polygon
                    points={`${trash.x - 5},${trash.y - 3} ${trash.x + 5},${trash.y - 4} ${trash.x + 3},${trash.y + 4} ${trash.x - 4},${trash.y + 3}`}
                    className="fill-purple-400 stroke-purple-200 stroke-1"
                  />
                )}
                {trash.type === 'dust_clump' && (
                  <circle
                    cx={trash.x}
                    cy={trash.y}
                    r={4}
                    className="fill-slate-400/80 stroke-slate-300 stroke-1"
                  />
                )}
                {trash.type === 'apple_core' && (
                  <circle
                    cx={trash.x}
                    cy={trash.y}
                    r={3.5}
                    className="fill-emerald-600 stroke-emerald-300 stroke-1"
                  />
                )}

                {/* Tooltip on hover */}
                <title>{trash.label} ({trash.weightGrams}g) - Click to dispatch CleanBot</title>
              </g>
            );
          })}

          {/* Waypoint Path Lines */}
          {telemetry.path.length > 0 && (
            <polyline
              points={`${telemetry.position.x},${telemetry.position.y} ` + telemetry.path.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#ff5a00"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.75"
              className="pointer-events-none"
            />
          )}

          {/* Active Target Waypoint */}
          {telemetry.targetWaypoint && (
            <g className="pointer-events-none">
              <circle
                cx={telemetry.targetWaypoint.x}
                cy={telemetry.targetWaypoint.y}
                r={6}
                fill="none"
                stroke="#ff5a00"
                strokeWidth="1.5"
                className="animate-ping"
              />
              <circle
                cx={telemetry.targetWaypoint.x}
                cy={telemetry.targetWaypoint.y}
                r={3}
                fill="#ff5a00"
              />
            </g>
          )}

          {/* LiDAR SLAM Field of View Sweep */}
          {showLidar && (
            <g className="pointer-events-none">
              <circle
                cx={telemetry.position.x}
                cy={telemetry.position.y}
                r={55}
                fill="url(#lidarGlow)"
              />
              {/* Rotating LiDAR scanning ray */}
              <line
                x1={telemetry.position.x}
                y1={telemetry.position.y}
                x2={telemetry.position.x + 55 * Math.cos(telemetry.position.angle)}
                y2={telemetry.position.y + 55 * Math.sin(telemetry.position.angle)}
                stroke="#06b6d4"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </g>
          )}

          {/* CLEANBOT ROBOT UNIT */}
          <g
            transform={`translate(${telemetry.position.x}, ${telemetry.position.y}) rotate(${(telemetry.position.angle * 180) / Math.PI})`}
            className="pointer-events-none transition-transform duration-75"
          >
            {/* Robot chassis shadow */}
            <circle cx={0} cy={1} r={14} className="fill-black/60 filter blur-[2px]" />

            {/* Main Robot Body (Nordic matte graphite & white shell) */}
            <rect
              x={-11}
              y={-10}
              width={22}
              height={20}
              rx={6}
              className="fill-slate-900 stroke-slate-500 stroke-1"
            />
            {/* White top cover */}
            <rect
              x={-9}
              y={-8}
              width={18}
              height={16}
              rx={4}
              className="fill-slate-100"
            />

            {/* Metropolia Orange Accent Band */}
            <rect
              x={-9}
              y={-2}
              width={18}
              height={4}
              className="fill-[#ff5a00]"
            />

            {/* Front intake roller & trash scoop */}
            <rect
              x={9}
              y={-7}
              width={4}
              height={14}
              rx={1}
              className="fill-slate-800 stroke-cyan-400 stroke-[0.8]"
            />

            {/* Rear microfiber mopping pad */}
            <rect
              x={-13}
              y={-8}
              width={3}
              height={16}
              rx={1}
              className="fill-sky-400"
            />

            {/* Central LiDAR Dome Turret */}
            <circle
              cx={0}
              cy={0}
              r={4}
              className="fill-slate-950 stroke-cyan-400 stroke-1"
            />
            <circle
              cx={0}
              cy={0}
              r={1.5}
              className="fill-cyan-400 animate-pulse"
            />

            {/* Direction Indicator Nose Cone */}
            <polygon
              points="10,0 13,-2.5 13,2.5"
              className="fill-[#ff5a00]"
            />

            {/* Headlights illumination cone */}
            {telemetry.lightsActive && (
              <polygon
                points="11,-6 40,-18 40,18 11,6"
                className="fill-amber-100/20 pointer-events-none"
              />
            )}
          </g>
        </svg>

        {/* Selected Room Detail Drawer / Action Card */}
        {selectedRoom && (
          <div className="mt-3 p-3 bg-[#0d1522] rounded-lg border border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-slate-800 flex items-center justify-center text-sm font-mono font-bold text-white border border-slate-700">
                {selectedRoom.code}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>{selectedRoom.name}</span>
                  <span className="text-slate-500 font-normal">·</span>
                  <span className="text-xs font-mono text-slate-400">{selectedRoom.areaSqM} m²</span>
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{selectedRoom.lastSchedule}</span>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{selectedRoom.cleanliness}% Clean</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onDispatchToRoom(selectedRoom)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Dispatch CleanBot Here</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Fast Guidance */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-700"></span>
            <span>Uncleaned Room</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950/80 border border-emerald-600/60"></span>
            <span>Mopped & Sanitized</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>Debris Item</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Liquid Spill</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-900 border border-indigo-500"></span>
            <span>Auto-Dock Station</span>
          </span>
        </div>
        <div className="text-slate-500">
          Tip: Click any room or spot on the map to autonomously route CleanBot.
        </div>
      </div>
    </div>
  );
};
