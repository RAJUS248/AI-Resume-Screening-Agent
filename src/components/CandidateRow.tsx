/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Link2
} from "lucide-react";
import { ScreeningDetails } from "../types";
import { validateUrl, normalizeUrl } from "../utils/url";

interface CandidateRowProps {
  key?: string | number;
  candidate: ScreeningDetails;
  rank: number;
  onViewReport: (id: string) => void;
}

export default function CandidateRow({ candidate, rank, onViewReport }: CandidateRowProps) {
  // Color configuration for ranks
  const getRankBadgeStyle = (rankNum: number) => {
    if (rankNum === 1) return "bg-amber-500 text-white shadow-amber-500/25 border border-amber-400";
    if (rankNum === 2) return "bg-slate-400 text-white shadow-slate-400/25 border border-slate-300";
    if (rankNum === 3) return "bg-amber-700 text-white shadow-amber-700/25 border border-amber-600";
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

  // Color configuration for recommendations
  const getRecPillStyle = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Hire":
        return "bg-teal-50 text-teal-700 border-teal-200/60";
      case "Potential":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "No Match":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  // Color gradient helper for score percentages
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-indigo-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  // Safe and normalized social link handlers
  const rawGithub = candidate.candidate.parsedData.github;
  const rawLinkedin = candidate.candidate.parsedData.linkedin;
  const rawPortfolio = candidate.candidate.parsedData.portfolio;

  const cleanGithub = normalizeUrl(rawGithub);
  const cleanLinkedin = normalizeUrl(rawLinkedin);
  const cleanPortfolio = normalizeUrl(rawPortfolio);

  const isGithubValid = validateUrl(cleanGithub);
  const isLinkedinValid = validateUrl(cleanLinkedin);
  const isPortfolioValid = validateUrl(cleanPortfolio);

  return (
    <div className="bg-white hover:bg-slate-50/50 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all duration-200 p-5 flex flex-col lg:grid lg:grid-cols-12 gap-4 items-stretch lg:items-center justify-between">
      
      {/* 1. Candidate Info Block (Col span 2) */}
      <div className="flex items-start gap-3 lg:col-span-2 min-w-0">
        {/* Rank Indicator */}
        <div className={`w-8 h-8 rounded-lg ${getRankBadgeStyle(rank)} flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-sm`}>
          {rank}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate" title={candidate.candidate.name}>
              {candidate.candidate.name}
            </h3>
            {rank === 1 && (
              <span className="flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1 rounded-full animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                <span>TOP</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate" title={candidate.candidate.parsedData.location || "Remote"}>
            {candidate.candidate.parsedData.location || "Remote"}
          </p>
        </div>
      </div>

      {/* 2. ATS Weighted Overall Score (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Overall ATS Score</span>
        <span className={`text-lg font-black lg:text-xl ${getScoreColorClass(candidate.overallScore)}`}>
          {candidate.overallScore}
        </span>
      </div>

      {/* 3. Semantic Score (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Semantic Score</span>
        <div className="flex flex-col items-end lg:items-center">
          <span className="font-bold text-xs text-slate-800">{Math.round(candidate.semanticScore)}%</span>
          <div className="hidden lg:block w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${candidate.semanticScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 4. Skill Match (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Skill Match</span>
        <div className="flex flex-col items-end lg:items-center">
          <span className="font-bold text-xs text-slate-800">{Math.round(candidate.skillScore)}%</span>
          <div className="hidden lg:block w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${candidate.skillScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 5. Experience Match (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Experience Match</span>
        <div className="flex flex-col items-end lg:items-center">
          <span className="font-bold text-xs text-slate-800">{Math.round(candidate.experienceScore)}%</span>
          <div className="hidden lg:block w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${candidate.experienceScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 6. Education Match (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Education Match</span>
        <div className="flex flex-col items-end lg:items-center">
          <span className="font-bold text-xs text-slate-800">{Math.round(candidate.educationScore)}%</span>
          <div className="hidden lg:block w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${candidate.educationScore}%` }}></div>
          </div>
        </div>
      </div>

      {/* 7. GitHub Link (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">GitHub</span>
        {isGithubValid ? (
          <a 
            href={cleanGithub} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            id={`leaderboard-github-${candidate.candidateId}`}
          >
            <Github className="w-3.5 h-3.5" />
            <span className="lg:hidden">GitHub</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-mono italic">Not Available</span>
        )}
      </div>

      {/* 8. LinkedIn Link (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">LinkedIn</span>
        {isLinkedinValid ? (
          <a 
            href={cleanLinkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            id={`leaderboard-linkedin-${candidate.candidateId}`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="lg:hidden">LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-mono italic">Not Available</span>
        )}
      </div>

      {/* 9. Portfolio Link (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Portfolio</span>
        {isPortfolioValid ? (
          <a 
            href={cleanPortfolio} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            id={`leaderboard-portfolio-${candidate.candidateId}`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span className="lg:hidden">Portfolio</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 font-mono italic">Not Available</span>
        )}
      </div>

      {/* 10. Hiring Recommendation (Col span 1) */}
      <div className="text-center lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-2 lg:pt-0 flex lg:flex-col justify-between items-center lg:justify-center">
        <span className="lg:hidden text-xs font-semibold text-slate-500">Recommendation</span>
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getRecPillStyle(candidate.hiringRecommendation)}`}>
          {candidate.hiringRecommendation}
        </span>
      </div>

      {/* 11. View match report action (Col span 1) */}
      <div className="text-right lg:col-span-1 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 flex justify-end">
        <button
          id={`btn-view-report-${candidate.candidateId}`}
          onClick={() => onViewReport(candidate.candidateId)}
          className="flex items-center justify-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 py-1.5 px-2.5 rounded-lg transition-colors w-full lg:w-auto"
        >
          <span className="lg:hidden">View Match Report</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
