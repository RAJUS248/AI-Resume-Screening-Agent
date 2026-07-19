/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Briefcase, 
  Mail, 
  Phone,
  Linkedin,
  Github,
  Globe,
  PlusCircle,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScreeningDetails } from "../types";
import { validateUrl, normalizeUrl } from "../utils/url";

interface CandidateReportModalProps {
  report: ScreeningDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

// Simple Markdown Formatter to render Markdown nicely in pure React
function CleanMarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;
  
  const lines = text.split("\n");
  return (
    <div className="space-y-3.5 text-slate-700 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith("###")) {
          return <h4 key={idx} className="text-base font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">{trimmed.replace("###", "").trim()}</h4>;
        }
        if (trimmed.startsWith("##")) {
          return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-2 border-b border-slate-100 pb-1">{trimmed.replace("##", "").trim()}</h3>;
        }
        if (trimmed.startsWith("#")) {
          return <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-2">{trimmed.replace("#", "").trim()}</h2>;
        }

        // Bullet list item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <li key={idx} className="list-none pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-indigo-500 before:font-bold">
              {formatInlineStyles(content)}
            </li>
          );
        }

        // Numbered list item
        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.\s)(.*)/);
          return (
            <li key={idx} className="list-none pl-5 relative before:content-[attr(data-num)] before:absolute before:left-1 before:text-indigo-500 before:font-bold" data-num={match?.[1] || ""}>
              {formatInlineStyles(match?.[2] || "")}
            </li>
          );
        }

        // Normal text block
        if (trimmed.length === 0) return <div key={idx} className="h-2"></div>;
        return <p key={idx}>{formatInlineStyles(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to replace **bold** markup in strings with React elements
function formatInlineStyles(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function CandidateReportModal({ report, isOpen, onClose }: CandidateReportModalProps) {
  if (!isOpen || !report) return null;

  const [activeTab, setActiveTab] = useState<"briefing" | "skills" | "profile" | "resume">("briefing");

  const getRecBadgeColor = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
        return "bg-emerald-500 text-white shadow-emerald-500/20";
      case "Hire":
        return "bg-teal-500 text-white shadow-teal-500/20";
      case "Potential":
        return "bg-amber-500 text-white shadow-amber-500/20";
      default:
        return "bg-rose-500 text-white shadow-rose-500/20";
    }
  };

  // Safe and normalized social link handlers
  const rawGithub = report.candidate.parsedData.github;
  const rawLinkedin = report.candidate.parsedData.linkedin;
  const rawPortfolio = report.candidate.parsedData.portfolio;

  const cleanGithub = normalizeUrl(rawGithub);
  const cleanLinkedin = normalizeUrl(rawLinkedin);
  const cleanPortfolio = normalizeUrl(rawPortfolio);

  const isGithubValid = validateUrl(cleanGithub);
  const isLinkedinValid = validateUrl(cleanLinkedin);
  const isPortfolioValid = validateUrl(cleanPortfolio);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Drawer slide-over container */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col gap-4 bg-slate-50">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {report.candidate.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${getRecBadgeColor(report.hiringRecommendation)}`}>
                    {report.hiringRecommendation}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Applied to: <strong className="text-slate-700">{report.jobDescription.parsedData.title}</strong>
                </p>
              </div>
              
              <button
                id="btn-close-modal"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Social Links Sub-header Block */}
            <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Profiles:</span>
              {isGithubValid ? (
                <a 
                  href={cleanGithub} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                  id="modal-profile-github"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 font-medium italic">GitHub: Not Available</span>
              )}
              <span className="text-slate-300">|</span>
              {isLinkedinValid ? (
                <a 
                  href={cleanLinkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                  id="modal-profile-linkedin"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 font-medium italic">LinkedIn: Not Available</span>
              )}
              <span className="text-slate-300">|</span>
              {isPortfolioValid ? (
                <a 
                  href={cleanPortfolio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                  id="modal-profile-portfolio"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 font-medium italic">Portfolio: Not Available</span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10 px-6 overflow-x-auto">
            <button
              id="tab-report-briefing"
              onClick={() => setActiveTab("briefing")}
              className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "briefing"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Briefing</span>
            </button>

            <button
              id="tab-report-skills"
              onClick={() => setActiveTab("skills")}
              className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "skills"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Skills alignment</span>
            </button>

            <button
              id="tab-report-profile"
              onClick={() => setActiveTab("profile")}
              className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "profile"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>History & Projects</span>
            </button>

            <button
              id="tab-report-resume"
              onClick={() => setActiveTab("resume")}
              className={`py-3.5 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "resume"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Original Resume</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: AI RECRUITER BRIEFING (MARKDOWN SUMMARY FROM GEMINI) */}
            {activeTab === "briefing" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Summary Metrics */}
                <div className="grid grid-cols-4 gap-2 bg-indigo-50/20 border border-indigo-100/50 rounded-xl p-4 text-center">
                  <div className="py-1">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">ATS Score</span>
                    <span className="text-xl font-black text-indigo-600">{report.overallScore}</span>
                  </div>
                  <div className="py-1 border-l border-slate-100">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Semantic</span>
                    <span className="text-base font-extrabold text-slate-800">{Math.round(report.semanticScore)}%</span>
                  </div>
                  <div className="py-1 border-l border-slate-100">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Skills Match</span>
                    <span className="text-base font-extrabold text-slate-800">{Math.round(report.skillScore)}%</span>
                  </div>
                  <div className="py-1 border-l border-slate-100">
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Exp Match</span>
                    <span className="text-base font-extrabold text-slate-800">{Math.round(report.experienceScore)}%</span>
                  </div>
                </div>

                {/* Markdown Review */}
                <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs">
                  <CleanMarkdownRenderer text={report.aiExplanation} />
                </div>
              </motion.div>
            )}

            {/* TAB 2: SKILLS MATRIX MAP */}
            {activeTab === "skills" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Visual alignment meter */}
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Overall Skill Alignment</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Matched {report.matchedSkills.length} of {report.matchedSkills.length + report.missingSkills.length} requested skills</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-600">{Math.round(report.skillScore)}%</span>
                  </div>
                </div>

                {/* Sub-matrices lists */}
                <div className="space-y-5">
                  
                  {/* Matched Skills */}
                  <div>
                    <h5 className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>MATCHED SKILLS ({report.matchedSkills.length})</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {report.matchedSkills.length > 0 ? (
                        report.matchedSkills.map((skill, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No exact technical overlap identified.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h5 className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wide mb-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>MISSING SKILLS ({report.missingSkills.length})</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {report.missingSkills.length > 0 ? (
                        report.missingSkills.map((skill, idx) => (
                          <span key={idx} className="bg-rose-50/40 text-rose-600 border border-rose-100/80 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> All requested tech requirements found!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Extracted/Additional Skills */}
                  <div>
                    <h5 className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2.5">
                      <PlusCircle className="w-4 h-4 text-indigo-600" />
                      <span>ALL EXTRACTED SKILLS ({report.candidate.parsedData.skills.length})</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto">
                      {report.candidate.parsedData.skills && report.candidate.parsedData.skills.length > 0 ? (
                        report.candidate.parsedData.skills.map((skill, idx) => (
                          <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No skills listed on resume.</span>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: ACADEMIC & CAREER TIMELINE */}
            {activeTab === "profile" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Career Experience Timeline */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    <Briefcase className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Experience Tenure ({report.candidate.parsedData.totalExperienceYears} Years Total)</span>
                  </h4>

                  <div className="space-y-5 relative pl-4 border-l border-slate-200 ml-2">
                    {report.candidate.parsedData.experience && report.candidate.parsedData.experience.length > 0 ? (
                      report.candidate.parsedData.experience.map((exp, idx) => (
                        <div key={idx} className="relative space-y-1">
                          {/* Left dot */}
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                          <div className="flex items-start justify-between">
                            <h5 className="font-bold text-slate-950 text-sm">{exp.role}</h5>
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono shrink-0">
                              {exp.duration || "N/A"}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-indigo-600">{exp.company}</div>
                          {exp.description && (
                            <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed pt-1">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">No formal career roles extracted.</div>
                    )}
                  </div>
                </div>

                {/* Academic History */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Education</span>
                  </h4>

                  <div className="space-y-4">
                    {report.candidate.parsedData.education && report.candidate.parsedData.education.length > 0 ? (
                      report.candidate.parsedData.education.map((edu, idx) => (
                        <div key={idx} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5 text-xs">
                            <h5 className="font-bold text-slate-900 text-sm">{edu.degree}</h5>
                            <div className="font-semibold text-slate-600">{edu.university}</div>
                            <div className="flex items-center gap-2 text-slate-400 pt-1 font-mono">
                              {edu.gradYear && <span>Class of {edu.gradYear}</span>}
                              {edu.cgpa && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-600 font-bold">GPA: {edu.cgpa}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">No formal degrees extracted.</div>
                    )}
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Projects</span>
                  </h4>

                  <div className="space-y-4">
                    {report.candidate.parsedData.projects && report.candidate.parsedData.projects.length > 0 ? (
                      report.candidate.parsedData.projects.map((proj, idx) => (
                        <div key={idx} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 space-y-1.5 text-xs">
                          <h5 className="font-bold text-slate-900 text-sm">{proj.title}</h5>
                          {proj.description && (
                            <p className="text-slate-600 leading-relaxed text-xs">{proj.description}</p>
                          )}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {proj.technologies.map((tech, tIdx) => (
                                <span key={tIdx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 italic">No formal project details listed.</div>
                    )}
                  </div>
                </div>

                {/* Certifications & Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Certifications */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
                    <h5 className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Certifications</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                      {report.candidate.parsedData.certifications && report.candidate.parsedData.certifications.length > 0 ? (
                        report.candidate.parsedData.certifications.map((cert, idx) => (
                          <li key={idx} className="truncate" title={cert}>{cert}</li>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None listed.</span>
                      )}
                    </ul>
                  </div>

                  {/* Achievements */}
                  <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3">
                    <h5 className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>Achievements & Honors</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                      {report.candidate.parsedData.achievements && report.candidate.parsedData.achievements.length > 0 ? (
                        report.candidate.parsedData.achievements.map((ach, idx) => (
                          <li key={idx} className="truncate" title={ach}>{ach}</li>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None listed.</span>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: ORIGINAL RESUME RAW CONTENT */}
            {activeTab === "resume" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-3">
                    <BookOpen className="w-4.5 h-4.5 text-indigo-600" />
                    <span>Parsed Resume Document Text</span>
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Below is the raw text extracted from the resume document parsed by our screening agents.
                  </p>
                </div>

                <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-5 rounded-xl overflow-x-auto max-h-[450px] overflow-y-auto leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-inner">
                  {report.candidate.rawText || "No text available."}
                </div>
              </motion.div>
            )}

          </div>

          {/* Contact footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              {report.candidate.email && (
                <a 
                  href={`mailto:${report.candidate.email}`} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              )}
              {report.candidate.phone && (
                <a 
                  href={`tel:${report.candidate.phone}`} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Candidate</span>
                </a>
              )}
            </div>
            
            <div className="flex gap-2">
              {isLinkedinValid && (
                <a 
                  href={cleanLinkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors"
                  title="LinkedIn"
                  id="modal-footer-linkedin"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {isGithubValid && (
                <a 
                  href={cleanGithub} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-slate-800 hover:bg-slate-900 rounded-lg text-white transition-colors"
                  title="GitHub"
                  id="modal-footer-github"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {isPortfolioValid && (
                <a 
                  href={cleanPortfolio} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  title="Portfolio"
                  id="modal-footer-portfolio"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
