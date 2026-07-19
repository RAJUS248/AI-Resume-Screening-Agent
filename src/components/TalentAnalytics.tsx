/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  BarChart3, 
  PieChart, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { ScreeningDetails } from "../types";

interface TalentAnalyticsProps {
  candidates: ScreeningDetails[];
}

export default function TalentAnalytics({ candidates }: TalentAnalyticsProps) {
  const total = candidates.length;
  if (total === 0) return null;

  // 1. Calculate Recommendation Counts
  const recs = candidates.reduce((acc, curr) => {
    const rec = curr.hiringRecommendation;
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const strongHires = recs["Strong Hire"] || 0;
  const standardHires = recs["Hire"] || 0;
  const potentials = recs["Potential"] || 0;
  const noMatches = recs["No Match"] || 0;

  // 2. Compute Score Ranges Distribution
  // Ranges: 90-100 (Exceptional), 80-89 (High Match), 70-79 (Moderate), Under 70 (Low)
  const scoreRanges = {
    exceptional: candidates.filter(c => c.overallScore >= 90).length,
    high: candidates.filter(c => c.overallScore >= 80 && c.overallScore < 90).length,
    moderate: candidates.filter(c => c.overallScore >= 65 && c.overallScore < 80).length,
    low: candidates.filter(c => c.overallScore < 65).length,
  };

  // 3. Extract Top Matched Skills & Frequency
  const skillFrequency: Record<string, number> = {};
  const missingFrequency: Record<string, number> = {};

  candidates.forEach(c => {
    (c.matchedSkills || []).forEach(s => {
      skillFrequency[s] = (skillFrequency[s] || 0) + 1;
    });
    (c.missingSkills || []).forEach(s => {
      missingFrequency[s] = (missingFrequency[s] || 0) + 1;
    });
  });

  const topMatchedSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topMissingSkills = Object.entries(missingFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Helper for responsive width bars
  const maxMatchedCount = topMatchedSkills.length > 0 ? Math.max(...topMatchedSkills.map(s => s[1])) : 1;
  const maxMissingCount = topMissingSkills.length > 0 ? Math.max(...topMissingSkills.map(s => s[1])) : 1;

  return (
    <div className="space-y-6">
      {/* Analytics Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 text-lg">Talent Pool Analytics</h2>
          <p className="text-xs text-slate-500">Screening distributions and core skill gap analyses</p>
        </div>
      </div>

      {/* Grid 1: Distributions & Fit Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommendation Composition (Custom Styled SVG Bar Chart) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-1.5">
            <PieChart className="w-4.5 h-4.5 text-indigo-600" />
            <span>Recruiter Recommendation Composition</span>
          </h3>

          <div className="space-y-4 pt-1">
            {/* Strong Hires */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Strong Hire
                </span>
                <span className="font-mono text-slate-500 font-semibold">{strongHires} ({Math.round(strongHires / total * 100)}%)</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-lg overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-lg" style={{ width: `${(strongHires / total) * 100}%` }}></div>
              </div>
            </div>

            {/* Standard Hires */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-teal-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  Standard Hire
                </span>
                <span className="font-mono text-slate-500 font-semibold">{standardHires} ({Math.round(standardHires / total * 100)}%)</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-lg overflow-hidden">
                <div className="bg-teal-500 h-full rounded-lg" style={{ width: `${(standardHires / total) * 100}%` }}></div>
              </div>
            </div>

            {/* Potential Match */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Potential Fit
                </span>
                <span className="font-mono text-slate-500 font-semibold">{potentials} ({Math.round(potentials / total * 100)}%)</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-lg overflow-hidden">
                <div className="bg-amber-500 h-full rounded-lg" style={{ width: `${(potentials / total) * 100}%` }}></div>
              </div>
            </div>

            {/* No Match */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Unmatched
                </span>
                <span className="font-mono text-slate-500 font-semibold">{noMatches} ({Math.round(noMatches / total * 100)}%)</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-lg overflow-hidden">
                <div className="bg-rose-500 h-full rounded-lg" style={{ width: `${(noMatches / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Ranges Distribution (Custom Histogram columns) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-1.5">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
            <span>Overall Score Ranges Distribution</span>
          </h3>

          <div className="flex items-end justify-between h-48 border-b border-slate-100 pb-2.5 px-4">
            {/* Exceptional column */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-bold text-indigo-600">{scoreRanges.exceptional}</span>
              <div 
                className="w-10 bg-indigo-600 rounded-t-lg transition-all duration-500" 
                style={{ height: `${total > 0 ? Math.max(8, (scoreRanges.exceptional / total) * 120) : 8}px` }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-1">
                90-100
              </span>
            </div>

            {/* High column */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-bold text-indigo-500">{scoreRanges.high}</span>
              <div 
                className="w-10 bg-indigo-400 rounded-t-lg transition-all duration-500" 
                style={{ height: `${total > 0 ? Math.max(8, (scoreRanges.high / total) * 120) : 8}px` }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-1">
                80-89
              </span>
            </div>

            {/* Moderate column */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-bold text-amber-500">{scoreRanges.moderate}</span>
              <div 
                className="w-10 bg-amber-400 rounded-t-lg transition-all duration-500" 
                style={{ height: `${total > 0 ? Math.max(8, (scoreRanges.moderate / total) * 120) : 8}px` }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-1">
                65-79
              </span>
            </div>

            {/* Low column */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-xs font-bold text-rose-500">{scoreRanges.low}</span>
              <div 
                className="w-10 bg-rose-400 rounded-t-lg transition-all duration-500" 
                style={{ height: `${total > 0 ? Math.max(8, (scoreRanges.low / total) * 120) : 8}px` }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-1">
                &lt;65
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid 2: Skill Frequencies & Missing Core gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Matched Skills Frequency */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            <span>Highest Talent Densities (Top Matched Skills)</span>
          </h3>

          <div className="space-y-3.5 pt-1">
            {topMatchedSkills.length > 0 ? (
              topMatchedSkills.map(([skill, count], idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 w-28 truncate">{skill}</span>
                  <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg h-5 overflow-hidden relative">
                    <div className="bg-emerald-500 h-full rounded-lg" style={{ width: `${(count / maxMatchedCount) * 100}%` }}></div>
                    <span className="absolute right-2.5 top-0.5 text-[9px] font-mono font-extrabold text-slate-400">
                      {count} {count === 1 ? "Profile" : "Profiles"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Screening matches required to compute frequencies.</span>
            )}
          </div>
        </div>

        {/* Top Missing Core Skills gaps */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-rose-500" />
            <span>Largest Tech Core Gaps (Missing Skills)</span>
          </h3>

          <div className="space-y-3.5 pt-1">
            {topMissingSkills.length > 0 ? (
              topMissingSkills.map(([skill, count], idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 w-28 truncate">{skill}</span>
                  <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg h-5 overflow-hidden relative">
                    <div className="bg-rose-400 h-full rounded-lg" style={{ width: `${(count / maxMissingCount) * 100}%` }}></div>
                    <span className="absolute right-2.5 top-0.5 text-[9px] font-mono font-extrabold text-slate-400">
                      Missing on {count}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No significant missing skill patterns found.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
