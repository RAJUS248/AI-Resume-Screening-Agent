/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Users, 
  Percent, 
  Award, 
  Sparkles,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
  CalendarDays
} from "lucide-react";
import { ScreeningDetails } from "../types";

interface DashboardStatsProps {
  candidates: ScreeningDetails[];
}

export default function DashboardStats({ candidates }: DashboardStatsProps) {
  const totalCount = candidates.length;
  
  // Averages
  const averageScore = totalCount > 0 
    ? Math.round(candidates.reduce((acc, curr) => acc + curr.overallScore, 0) / totalCount * 10) / 10 
    : 0;

  const averageSemantic = totalCount > 0 
    ? Math.round(candidates.reduce((acc, curr) => acc + curr.semanticScore, 0) / totalCount) 
    : 0;

  const averageSkills = totalCount > 0 
    ? Math.round(candidates.reduce((acc, curr) => acc + curr.skillScore, 0) / totalCount) 
    : 0;

  // Counts of recommendations
  const strongHires = candidates.filter(c => c.hiringRecommendation === "Strong Hire").length;
  const standardHires = candidates.filter(c => c.hiringRecommendation === "Hire").length;
  const qualityFits = strongHires + standardHires;

  // Average years of experience
  const averageExp = totalCount > 0
    ? Math.round((candidates.reduce((acc, curr) => acc + (curr.candidate.parsedData.totalExperienceYears || 0), 0) / totalCount) * 10) / 10
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {/* Stat Card 1: Total Candidates */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Talent Pool Size
            </span>
            <span className="text-3xl font-extrabold text-slate-900 leading-none">
              {totalCount}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Active resumes screened</span>
        </div>
      </div>

      {/* Stat Card 2: Average Overall Score */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Average Match
            </span>
            <span className="text-3xl font-extrabold text-slate-900 leading-none">
              {averageScore}%
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Semantic Fit Avg:</span>
            <span className="font-semibold text-slate-700">{averageSemantic}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Skills Fit Avg:</span>
            <span className="font-semibold text-slate-700">{averageSkills}%</span>
          </div>
        </div>
      </div>

      {/* Stat Card 3: Top Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              High Quality Fits
            </span>
            <span className="text-3xl font-extrabold text-slate-900 leading-none">
              {qualityFits}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>{strongHires} marked as <strong className="text-amber-700">Strong Hire</strong></span>
        </div>
      </div>

      {/* Stat Card 4: Average Experience */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
              Pool Experience Avg
            </span>
            <span className="text-3xl font-extrabold text-slate-900 leading-none">
              {averageExp} <span className="text-sm font-medium text-slate-500">Yrs</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <BrainCircuit className="w-3.5 h-3.5 text-rose-500" />
          <span>Professional career tenure</span>
        </div>
      </div>
    </div>
  );
}
