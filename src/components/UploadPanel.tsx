/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  FileCode,
  X, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Briefcase,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UploadPanelProps {
  onUploadJD: (text: string, title: string) => Promise<any>;
  onUploadJDFile: (file: File) => Promise<any>;
  onUploadResumes: (files: File[]) => Promise<any>;
  onStartScreening: () => Promise<void>;
  activeJD: any | null;
  uploadedResumesCount: number;
  isProcessing: boolean;
  processStep: string;
  onChangeJobTarget: () => void;
}

export default function UploadPanel({
  onUploadJD,
  onUploadJDFile,
  onUploadResumes,
  onStartScreening,
  activeJD,
  uploadedResumesCount,
  isProcessing,
  processStep,
  onChangeJobTarget
}: UploadPanelProps) {
  // Tabs for JD
  const [jdMode, setJdMode] = useState<"paste" | "file">("paste");
  
  // Paste states
  const [jdTitle, setJdTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [isJdSaving, setIsJdSaving] = useState(false);

  // Resume Upload State
  const [dragOverResume, setDragOverResume] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState<File[]>([]);
  const [isResumeUploading, setIsResumeUploading] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Pasted JD Submission
  const handleSavePastedJD = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    setIsJdSaving(true);
    try {
      await onUploadJD(jdText, jdTitle || "Custom Job Description");
      setJdText("");
      setJdTitle("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsJdSaving(false);
    }
  };

  // Handle JD File Submission
  const handleJDFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsJdSaving(true);
    try {
      await onUploadJDFile(file);
    } catch (err) {
      console.error(err);
    } finally {
      setIsJdSaving(false);
    }
  };

  // Handle Resume Files selection
  const handleResumeSelection = (files: FileList | null) => {
    if (!files) return;
    const list: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx" || ext === "txt") {
        list.push(f);
      }
    }
    setSelectedResumes(prev => [...prev, ...list]);
  };

  const handleResumeRemove = (index: number) => {
    setSelectedResumes(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUploadResumesToServer = async () => {
    if (selectedResumes.length === 0) return;
    setIsResumeUploading(true);
    try {
      await onUploadResumes(selectedResumes);
      setSelectedResumes([]); // Clear on success
    } catch (err) {
      console.error(err);
    } finally {
      setIsResumeUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Job Description Panel (5/12 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Job Description (JD)</h2>
              <p className="text-xs text-slate-500">Provide the baseline profile requirements</p>
            </div>
          </div>

          {activeJD ? (
            /* Active JD Showcase */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 tracking-wider uppercase">
                    ACTIVE JOB TARGET
                  </span>
                  <h3 className="font-semibold text-slate-900 text-lg mt-1">
                    {activeJD.parsedData.title}
                  </h3>
                </div>
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                {/* Years Experience & Education Badge */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <div className="text-slate-400 text-[10px] uppercase font-mono">Min Experience</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">
                      {activeJD.parsedData.minimumExperience} {activeJD.parsedData.minimumExperience === 1 ? "Year" : "Years"}
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-indigo-100/60">
                    <div className="text-slate-400 text-[10px] uppercase font-mono">Min Degree</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5 truncate" title={activeJD.parsedData.educationRequirement}>
                      {activeJD.parsedData.educationRequirement}
                    </div>
                  </div>
                </div>

                {/* Extracted Core Skills */}
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono mb-1.5">Required Tech Core</div>
                  <div className="flex flex-wrap gap-1">
                    {activeJD.parsedData.requiredSkills.slice(0, 8).map((skill: string, idx: number) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-indigo-700 border border-indigo-100">
                        {skill}
                      </span>
                    ))}
                    {activeJD.parsedData.requiredSkills.length > 8 && (
                      <span className="text-slate-400 text-[10px] pl-1 self-center">
                        +{activeJD.parsedData.requiredSkills.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Extracted Technologies */}
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-mono mb-1.5">Desired Stack</div>
                  <div className="flex flex-wrap gap-1">
                    {activeJD.parsedData.technologies.slice(0, 8).map((tech: string, idx: number) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-indigo-700 border border-indigo-100">
                        {tech}
                      </span>
                    ))}
                    {activeJD.parsedData.technologies.length > 8 && (
                      <span className="text-slate-400 text-[10px] pl-1 self-center">
                        +{activeJD.parsedData.technologies.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset link */}
              <div className="mt-5 pt-4 border-t border-indigo-100 flex justify-end">
                <button
                  id="btn-overwrite-jd"
                  onClick={() => {
                    setJdText("");
                    setJdTitle("");
                    onChangeJobTarget();
                  }}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Change Job Target
                </button>
              </div>
            </motion.div>
          ) : (
            /* Upload/Paste Form */
            <div className="space-y-4">
              {/* Tab selector */}
              <div className="flex border-b border-slate-200">
                <button
                  id="tab-jd-paste"
                  onClick={() => setJdMode("paste")}
                  className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all ${
                    jdMode === "paste"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  id="tab-jd-file"
                  onClick={() => setJdMode("file")}
                  className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-all ${
                    jdMode === "file"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {jdMode === "paste" ? (
                <form id="form-jd-paste" onSubmit={handleSavePastedJD} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Job Title
                    </label>
                    <input
                      id="input-jd-title"
                      type="text"
                      placeholder="e.g. Senior Full-Stack Engineer"
                      value={jdTitle}
                      onChange={e => setJdTitle(e.target.value)}
                      required
                      className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Job Description Details
                    </label>
                    <textarea
                      id="input-jd-text"
                      rows={8}
                      placeholder="Paste the full job requirements, roles, skills, and certifications needed..."
                      value={jdText}
                      onChange={e => setJdText(e.target.value)}
                      required
                      className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 font-sans"
                    ></textarea>
                  </div>

                  <button
                    id="btn-save-jd"
                    type="submit"
                    disabled={isJdSaving || !jdText.trim()}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2"
                  >
                    {isJdSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <span>Save Job Target</span>
                    )}
                  </button>
                </form>
              ) : (
                /* JD File Upload */
                <div className="space-y-4">
                  <div
                    onClick={() => jdFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer transition-colors"
                  >
                    <input
                      ref={jdFileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleJDFileChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <span className="block text-sm font-semibold text-slate-700">
                      Upload Job Description
                    </span>
                    <span className="block text-xs text-slate-400 mt-1">
                      Supports PDF, DOCX, TXT (Max 15MB)
                    </span>
                  </div>

                  {isJdSaving && (
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Parsing Job Document with Gemini...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Resumes Upload & Screening Launcher (7/12 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Candidate Resumes</h2>
              <p className="text-xs text-slate-500">Add multiple candidate profiles simultaneously</p>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            id="drag-area-resume"
            onDragOver={e => {
              e.preventDefault();
              setDragOverResume(true);
            }}
            onDragLeave={() => setDragOverResume(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOverResume(false);
              handleResumeSelection(e.dataTransfer.files);
            }}
            onClick={() => resumeInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOverResume
                ? "border-emerald-500 bg-emerald-50/10 scale-[0.99]"
                : "border-slate-200 hover:border-emerald-500"
            }`}
          >
            <input
              ref={resumeInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={e => handleResumeSelection(e.target.files)}
              className="hidden"
            />
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800">
              Drag & Drop Resumes Here
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select multiple PDF, Word (.docx), or Text files
            </p>
            <button
              id="btn-select-resumes"
              type="button"
              className="mt-4 px-4 py-2 rounded-lg border border-slate-200 font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 shadow-sm inline-block"
            >
              Browse Local Files
            </button>
          </div>

          {/* Selected Files Queue */}
          {selectedResumes.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 border-t border-slate-100 pt-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">
                  UPLOAD QUEUE ({selectedResumes.length} {selectedResumes.length === 1 ? "File" : "Files"})
                </span>
                <button
                  id="btn-clear-queue"
                  onClick={() => setSelectedResumes([])}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear Queue
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedResumes.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50/80 p-3 rounded-lg border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-slate-400 shrink-0">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      id={`btn-remove-file-${idx}`}
                      onClick={() => handleResumeRemove(idx)}
                      className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                id="btn-upload-queue"
                onClick={handleUploadResumesToServer}
                disabled={isResumeUploading}
                className="mt-4 w-full py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isResumeUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Extracting with Gemini...</span>
                  </>
                ) : (
                  <span>Extract Profiles ({selectedResumes.length})</span>
                )}
              </button>
            </motion.div>
          )}

          {/* Uploaded Count Info */}
          {uploadedResumesCount > 0 && !isResumeUploading && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>
                  {uploadedResumesCount} {uploadedResumesCount === 1 ? "Candidate profile" : "Candidate profiles"} parsed and ready.
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">DATABASE ACTIVE</span>
            </div>
          )}
        </div>

        {/* SCREENING ACTIVATOR (TRIGGERS MATCHING & SCORING) */}
        {activeJD && uploadedResumesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white rounded-xl shadow-lg p-6 border border-slate-800 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden"
          >
            {/* Ambient Background decoration */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-600/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="space-y-1 relative">
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 font-mono uppercase">
                READY TO MATCH
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Run Multi-Factor ATS Screening
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Runs semantic mapping, skill alignment matrices, and uses Gemini to craft screening insights.
              </p>
            </div>

            <button
              id="btn-run-screening"
              onClick={onStartScreening}
              disabled={isProcessing}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white rounded-lg shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:bg-slate-800 disabled:text-slate-500 flex items-center gap-2.5 shrink-0"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{processStep || "Matching..."}</span>
                </>
              ) : (
                <span>Begin Match & Rank</span>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
