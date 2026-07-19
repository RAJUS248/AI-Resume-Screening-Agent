/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import UploadPanel from "./components/UploadPanel";
import DashboardStats from "./components/DashboardStats";
import CandidateRow from "./components/CandidateRow";
import CandidateReportModal from "./components/CandidateReportModal";
import TalentAnalytics from "./components/TalentAnalytics";
import { JobDescription, Candidate, ScreeningDetails } from "./types";
import { 
  Users, 
  HelpCircle, 
  Sparkles, 
  Database,
  Search,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "upload" | "analytics">("upload");
  const [activeJD, setActiveJD] = useState<JobDescription | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<ScreeningDetails[]>([]);
  
  // Scoring / Matching Loader States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [processStep, setProcessStep] = useState("");

  // Detailed Modal Target States
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Search & Filter UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [recFilter, setRecFilter] = useState<string>("All");

  // Fetch all states from the server
  const fetchState = async () => {
    try {
      // 1. Fetch current results if any
      const resResponse = await fetch("/api/results");
      const resData = await resResponse.json();
      const loadedResults = resData.results || [];
      setResults(loadedResults);

      if (loadedResults.length > 0) {
        // Derive JD and Candidate counts from results
        setActiveJD(loadedResults[0].jobDescription);
        
        // Fetch candidates list to populate upload count precisely
        const candResponse = await fetch("/api/results"); // Can fallback on same details or candidates list
        const candidatesCollected = loadedResults.map((r: any) => r.candidate);
        setCandidates(candidatesCollected);
        
        // Auto navigate to leaderboard if there are already active results
        setActiveTab("dashboard");
      } else {
        // If no results, check if there are uploaded files (active JD or resumes) to preserve state
        // Let's query health or standard lists if we need, but simple DB lookup handles it
        const listResults = await fetch("/api/results");
        const listData = await listResults.json();
        if (listData.results && listData.results.length > 0) {
          setResults(listData.results);
        }
      }
    } catch (error) {
      console.error("Error loading server states:", error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // --- API HANDLERS ---

  /**
   * Action: Save Pasted JD text
   */
  const handleUploadJD = async (text: string, title: string) => {
    try {
      const response = await fetch("/api/upload-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, title }),
      });
      const data = await response.json();
      if (data.success) {
        setActiveJD(data.jd);
        return data;
      } else {
        throw new Error(data.error || "Failed to save Job Description");
      }
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  /**
   * Action: Upload JD file
   */
  const handleUploadJDFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-jd", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setActiveJD(data.jd);
        return data;
      } else {
        throw new Error(data.error || "Failed to parse JD file");
      }
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  /**
   * Action: Upload resumes simultaneous queue
   */
  const handleUploadResumes = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload-resumes", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        // Append parsed candidates to localized state
        setCandidates(prev => {
          const updated = [...prev, ...data.candidates];
          // Filter unique IDs
          return updated.filter((item, index, self) => self.findIndex(c => c.id === item.id) === index);
        });
        return data;
      } else {
        throw new Error(data.error || "Failed to parse Resumes");
      }
    } catch (error: any) {
      alert(error.message);
      throw error;
    }
  };

  /**
   * Action: Begin Multi-Factor ATS screening calculations
   */
  const handleStartScreening = async () => {
    if (!activeJD || candidates.length === 0) return;
    setIsProcessing(true);
    setProcessStep("Extracting core matching skills...");
    
    try {
      // Step interval mock loaders
      const steps = [
        "Generating semantic embeddings...",
        "Evaluating candidate experience criteria...",
        "Performing academic degree rank comparisons...",
        "Executing Gemini AI recruiter briefings..."
      ];
      
      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          setProcessStep(steps[stepIdx]);
          stepIdx++;
        }
      }, 2000);

      const response = await fetch("/api/screen", {
        method: "POST",
      });
      clearInterval(interval);
      
      const data = await response.json();
      if (data.success) {
        setProcessStep("Parsing completed ranking reports...");
        // Fetch new ranked details list
        await fetchState();
        setActiveTab("dashboard");
      } else {
        throw new Error(data.error || "Failed to calculate screening results");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  /**
   * Action: Reset active workspace
   */
  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset the current screening project? This clears all resumes and job targets.")) return;
    try {
      const response = await fetch("/api/reset", {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setActiveJD(null);
        setCandidates([]);
        setResults([]);
        setActiveTab("upload");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Action: Change/clear active Job Description target
   */
  const handleChangeJobTarget = async () => {
    try {
      const response = await fetch("/api/clear-jd", {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setActiveJD(null);
        setResults([]);
        setActiveTab("upload");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Action: Load Demo Data
   */
  const handleLoadDemoData = async () => {
    setIsDemoLoading(true);
    try {
      const response = await fetch("/api/load-demo", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setActiveJD(data.jd);
        setCandidates(data.candidates);
        setResults([]); // Clear previous results to prompt fresh matching
        alert("Demo data (1 job description & 5 realistic candidates) loaded successfully! Click 'Begin Match & Rank' to start screening.");
      } else {
        throw new Error(data.error || "Failed to load demo data");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDemoLoading(false);
    }
  };

  /**
   * Action: Download screening CSV
   */
  const handleDownloadCSV = () => {
    window.location.href = "/api/download-csv";
  };

  // View individual report modal
  const handleViewReport = (id: string) => {
    setSelectedCandidateId(id);
    setIsReportOpen(true);
  };

  const selectedCandidateReport = results.find(r => r.candidateId === selectedCandidateId) || null;

  // Search and Filter calculation on results list
  const filteredResults = results.filter(r => {
    const matchesSearch = r.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.candidate.parsedData.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = recFilter === "All" || r.hiringRecommendation === recFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="ats-app-root" className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-800">
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onReset={handleReset}
        hasResults={results.length > 0}
        onDownloadCSV={handleDownloadCSV}
      />

      {/* MAIN SCREEN SECTION */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded border border-slate-200">
              V2.4.0
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Workspace: Active Segment</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400">rajubaradur24@gmail.com</span>
          </div>
        </header>

        {/* Scrollable Main Workspace Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          <AnimatePresence mode="wait">
            {/* TAB: UPLOAD PANEL (CREATES BASELINE TARGETS) */}
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Candidate Upload Center
                    </h1>
                    <p className="text-xs text-slate-500">
                      Set up your target job profile, and feed in candidates for ranking.
                    </p>
                  </div>

                  <button
                    id="btn-load-demo"
                    onClick={handleLoadDemoData}
                    disabled={isDemoLoading || isProcessing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 disabled:bg-slate-50 disabled:border-slate-100 text-indigo-700 disabled:text-slate-400 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                  >
                    {isDemoLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Demo Candidates...</span>
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" />
                        <span>Load Demo Data</span>
                      </>
                    )}
                  </button>
                </div>

                <UploadPanel 
                  onUploadJD={handleUploadJD}
                  onUploadJDFile={handleUploadJDFile}
                  onUploadResumes={handleUploadResumes}
                  onStartScreening={handleStartScreening}
                  activeJD={activeJD}
                  uploadedResumesCount={candidates.length}
                  isProcessing={isProcessing}
                  processStep={processStep}
                  onChangeJobTarget={handleChangeJobTarget}
                />
              </motion.div>
            )}

            {/* TAB: LEADERBOARD DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Dashboard Stats Panel */}
                <DashboardStats candidates={results} />

                {/* Main Filter & Leaderboard Table wrapper */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Candidate Leaderboard</h2>
                      <p className="text-xs text-slate-500">Ranked by ATS weighted multi-factor calculation</p>
                    </div>

                    {/* Search & Filter tools */}
                    <div className="flex items-center gap-3.5 flex-wrap">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          id="search-candidates"
                          type="text"
                          placeholder="Search candidates/skills..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-9 pr-4 py-1.5 w-60 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50 text-slate-800"
                        />
                      </div>

                      {/* Rec Filter */}
                      <div className="flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          id="filter-recommendation"
                          value={recFilter}
                          onChange={e => setRecFilter(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg px-2 py-1.5 focus:outline-none"
                        >
                          <option value="All">All Recommendations</option>
                          <option value="Strong Hire">Strong Hire</option>
                          <option value="Hire">Standard Hire</option>
                          <option value="Potential">Potential Fit</option>
                          <option value="No Match">Unmatched</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table Header for Large Screens */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-5 py-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[10px] uppercase font-mono text-slate-500 font-bold">
                    <div className="col-span-2">Candidate</div>
                    <div className="text-center">Overall ATS</div>
                    <div className="text-center">Semantic</div>
                    <div className="text-center">Skill Match</div>
                    <div className="text-center">Exp Match</div>
                    <div className="text-center">Edu Match</div>
                    <div className="text-center">GitHub</div>
                    <div className="text-center">LinkedIn</div>
                    <div className="text-center">Portfolio</div>
                    <div className="text-center">Recommendation</div>
                    <div className="text-right pr-2">Action</div>
                  </div>

                  {/* Candidate list stack */}
                  <div className="space-y-3">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((cand, idx) => (
                        <CandidateRow 
                          key={cand.id} 
                          candidate={cand} 
                          rank={results.findIndex(r => r.candidateId === cand.candidateId) + 1}
                          onViewReport={handleViewReport}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-800 text-sm">No Matching Candidates Found</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try altering your query search keywords or selection recommendations filter.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: TALENT ANALYTICS */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <TalentAnalytics candidates={results} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* BACKGROUND SCREENING CALCULATION MODAL */}
          <AnimatePresence>
            {isProcessing && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200 text-center max-w-sm w-full mx-4 space-y-5"
                >
                  <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-900 text-base">ATS Match Algorithm Active</h3>
                    <p className="text-xs text-indigo-600 font-mono font-bold animate-pulse">{processStep}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    Calculating cosine semantic similarities, auditing credentials, mapping tech stacks, and calling Gemini Core AI. This can take up to 20 seconds.
                  </p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* DETAILED CANDIDATE REPORT DRAWER SLIDE-OVER */}
          <CandidateReportModal 
            report={selectedCandidateReport} 
            isOpen={isReportOpen} 
            onClose={() => {
              setIsReportOpen(false);
              setSelectedCandidateId(null);
            }}
          />

        </div>
      </main>
    </div>
  );
}

// Minimal loader component icon fallback
function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
