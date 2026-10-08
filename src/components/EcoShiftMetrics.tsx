import React from 'react';
import { 
  Leaf, 
  Droplet, 
  Users, 
  Zap, 
  Sparkles, 
  Trash2, 
  Award, 
  CheckCircle2, 
  TrendingUp,
  Snowflake
} from 'lucide-react';
import { ShiftSummary } from '../types/cleanbot';

interface EcoShiftMetricsProps {
  summary: ShiftSummary;
}

export const EcoShiftMetrics: React.FC<EcoShiftMetricsProps> = ({ summary }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Metropolia Autonomous Campus Sustainability Impact</span>
            <span className="text-xs font-mono text-teal-400 bg-teal-950/60 border border-teal-800 px-2 py-0.5 rounded">
              ECO-CERTIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Off-hours CleanBot deployment eliminates late-night facility staffing costs, recycles gray water on-board, and maintains hospital-level campus hygiene.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#090f1a] rounded-lg border border-slate-800 text-right">
            <div className="text-[11px] text-slate-400">Total Shift Area</div>
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {summary.completedAreaSqM} <span className="text-xs font-normal text-slate-400">/ {summary.targetAreaSqM} m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Quantitative Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Zero Staff Hours Saved */}
        <div className="bg-[#0e1626] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Shift Labor Saved</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
              100% Autonomous
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {summary.laborHoursSaved} <span className="text-xs font-normal text-slate-400">hours/night</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Eliminates midnight shifts and unsocial hours for Metropolia facilities team, reallocating staff to daytime technical support.
          </p>
        </div>

        {/* Card 2: Closed-Loop Water Recycled */}
        <div className="bg-[#0e1626] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplet className="w-4 h-4 text-sky-400" />
              <span>Water Conserved</span>
            </span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded">
              -85% Consumption
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {summary.waterRecycledLiters} <span className="text-xs font-normal text-slate-400">liters / shift</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Onboard multistage micro-filtration continuously purifies mopping liquid, scrubbing up to 1,500 m² on a single tank.
          </p>
        </div>

        {/* Card 3: Chemical-Free Ozone Sanitation */}
        <div className="bg-[#0e1626] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Zero Harsh Chemicals</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
              Aqueous Ozone
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            99.98% <span className="text-xs font-normal text-slate-400">pathogen kill</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Creates stabilized aqueous ozone on-the-fly from tap water; harmlessly decomposes back to water and oxygen with zero odor.
          </p>
        </div>

        {/* Card 4: Finnish Winter Slush Extraction */}
        <div className="bg-[#0e1626] p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span>Salt & Slush Lift</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
              Winter Protection
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            98.5% <span className="text-xs font-normal text-slate-400">grit recovery</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Heavy-duty vacuum squeegee extracts abrasive winter gravel and de-icing salt, protecting Metropolia's terrazzo floors.
          </p>
        </div>
      </div>

      {/* Waste Fraction & Sorting Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-amber-400" />
              <span>Night Shift Debris Sorting & Recovery</span>
            </h3>
            <span className="text-xs font-mono text-amber-400">{summary.trashCollectedKg} kg Total</span>
          </div>

          <p className="text-xs text-slate-400">
            CleanBot's optical classification system sorts collected classroom trash directly into Metropolia's standardized recycling streams:
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Paper & Exam Blueprints</span>
                <span className="text-slate-400 font-mono">45% (11.9 kg)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Drink Containers & Coffee Cups</span>
                <span className="text-slate-400 font-mono">30% (7.9 kg)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Packaging & Snack Foils</span>
                <span className="text-slate-400 font-mono">15% (4.0 kg)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Gravel & Inorganic Particulates</span>
                <span className="text-slate-400 font-mono">10% (2.6 kg)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* CleanBot Technical Specifications Card */}
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#ff5a00]" />
              <span>CleanBot Mark IV Metropolia Specs</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered specifically for the architectural specifications of Metropolia University of Applied Sciences campuses (Myllypuro, Karamalmi, Arabia, Myyrmäki).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#090f1a] p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">NAVIGATION</div>
              <div className="text-white font-semibold">360° LiDAR + Stereo SLAM</div>
            </div>
            <div className="bg-[#090f1a] p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">DEBRIS CAPACITY</div>
              <div className="text-white font-semibold">35L Hopper (Auto-Dump)</div>
            </div>
            <div className="bg-[#090f1a] p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">SCRUBBING WIDTH</div>
              <div className="text-white font-semibold">550 mm Dual-Roller</div>
            </div>
            <div className="bg-[#090f1a] p-2.5 rounded border border-slate-800">
              <div className="text-[10px] text-slate-500">NOISE RATING</div>
              <div className="text-emerald-400 font-semibold">&lt; 48 dBA Quiet Mode</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Metropolia UAS Facilities & Real Estate Services · Certified ISO 14001 Compliant
          </div>
        </div>
      </div>
    </div>
  );
};
