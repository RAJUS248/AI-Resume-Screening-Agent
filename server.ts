/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs/promises";
import multer from "multer";
import mammoth from "mammoth";
import { createServer as createViteServer } from "vite";
import { db } from "./src/database/index";
import { AIService } from "./src/services/ai";
import { ScreeningEngine } from "./src/services/screening";
import { JobDescription, Candidate, ScreeningResult } from "./src/types";

// Initialize express app
const app = express();
const PORT = 3000;

// Set body size limits for larger PDF/DOCX file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Setup Multer for memory storage file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB file size limit
  },
});

// Helper to extract text from uploads (DOCX and TXT)
async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType.includes("word") || mimeType.includes("officedocument.wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  return buffer.toString("utf-8");
}

// --- REST API ENDPOINTS ---

/**
 * Health check
 */
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

/**
 * POST /api/upload-jd
 * Supports either raw text input or direct file upload (TXT, DOCX, PDF)
 */
app.post("/api/upload-jd", upload.single("file"), async (req: any, res: any) => {
  try {
    let jdText = "";
    let jdTitle = "Job Profile";

    if (req.file) {
      const file = req.file;
      jdTitle = file.originalname.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      
      if (file.mimetype === "application/pdf") {
        // PDF parser: Convert to base64 and parse via Gemini multimodal
        const base64Pdf = file.buffer.toString("base64");
        const parsedJd = await AIService.parseJobDescription(base64Pdf, true);
        
        const jdObj: JobDescription = {
          id: `jd_${Date.now()}`,
          title: parsedJd.title || jdTitle,
          rawText: "PDF content processed securely via Gemini.",
          parsedData: parsedJd,
          createdAt: new Date().toISOString(),
        };

        await db.saveJD(jdObj);
        return res.json({ success: true, jd: jdObj });
      } else {
        // Parse Word/Text file content
        jdText = await extractTextFromBuffer(file.buffer, file.mimetype);
      }
    } else if (req.body.text) {
      jdText = req.body.text;
      jdTitle = req.body.title || "Custom Job Description";
    } else {
      return res.status(400).json({ error: "Missing job description text or file." });
    }

    if (!jdText.trim()) {
      return res.status(400).json({ error: "Job description is empty." });
    }

    // Parse the textual job description using Gemini
    console.log("Analyzing Job Description using Gemini...");
    const parsedData = await AIService.parseJobDescription(jdText, false);
    
    const jdObj: JobDescription = {
      id: `jd_${Date.now()}`,
      title: parsedData.title || jdTitle,
      rawText: jdText,
      parsedData,
      createdAt: new Date().toISOString(),
    };

    await db.saveJD(jdObj);
    res.json({ success: true, jd: jdObj });
  } catch (error: any) {
    console.error("Error in upload-jd route:", error);
    res.status(500).json({ error: error.message || "Failed to upload and parse Job Description." });
  }
});

/**
 * POST /api/load-demo
 * Automatically loads sample JD and 5 demo resumes, parses them, and saves to local database.
 */
app.post("/api/load-demo", async (req: any, res: any) => {
  try {
    console.log("Loading demo data from demo_data/ folder...");
    const demoDir = path.join(process.cwd(), "demo_data");

    // 1. Load sample Job Description
    const jdPath = path.join(demoDir, "job_description.txt");
    const jdText = await fs.readFile(jdPath, "utf-8");
    console.log("Parsing demo Job Description with Gemini...");
    const parsedJd = await AIService.parseJobDescription(jdText, false);

    const jdObj: JobDescription = {
      id: `jd_demo_${Date.now()}`,
      title: parsedJd.title || "Senior Full Stack AI Engineer",
      rawText: jdText,
      parsedData: parsedJd,
      createdAt: new Date().toISOString(),
    };
    await db.saveJD(jdObj);

    // 2. Load the 5 Resumes
    const resumeFiles = [
      "resume_1_backend.txt",
      "resume_2_aiml.txt",
      "resume_3_fullstack.txt",
      "resume_4_datascientist.txt",
      "resume_5_fresher.txt"
    ];

    const processedCandidates: Candidate[] = [];
    for (let i = 0; i < resumeFiles.length; i++) {
      const filename = resumeFiles[i];
      const filePath = path.join(demoDir, filename);
      const textContent = await fs.readFile(filePath, "utf-8");

      console.log(`Parsing demo resume [${i+1}/5]: ${filename} with Gemini...`);
      const parsedData = await AIService.parseResume(textContent, filename, false);

      const candidateObj: Candidate = {
        id: `cand_demo_${Date.now()}_${i}`,
        name: parsedData.name || filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        filename,
        rawText: textContent,
        parsedData,
        createdAt: new Date().toISOString(),
      };
      processedCandidates.push(candidateObj);
    }

    console.log(`Saving ${processedCandidates.length} demo candidates to database...`);
    await db.saveCandidates(processedCandidates);

    res.json({
      success: true,
      jd: jdObj,
      count: processedCandidates.length,
      candidates: processedCandidates
    });
  } catch (error: any) {
    console.error("Error in load-demo route:", error);
    res.status(500).json({ error: error.message || "Failed to load demo data." });
  }
});

/**
 * POST /api/upload-resumes
 * Supports uploading multiple resumes simultaneously
 */
app.post("/api/upload-resumes", upload.array("files"), async (req: any, res: any) => {
  try {
    const files = req.files as any[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No resumes uploaded." });
    }

    console.log(`Processing ${files.length} uploaded resume files...`);
    const processedCandidates: Candidate[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filename = file.originalname;
      const isPdf = file.mimetype === "application/pdf";
      
      try {
        let parsedData;
        let rawText = "";

        if (isPdf) {
          // Multimodal PDF processing
          const base64Data = file.buffer.toString("base64");
          parsedData = await AIService.parseResume(base64Data, filename, true);
          rawText = `PDF binary parsed directly via Gemini: ${filename}`;
        } else {
          // Plain Text or DOCX processing
          rawText = await extractTextFromBuffer(file.buffer, file.mimetype);
          parsedData = await AIService.parseResume(rawText, filename, false);
        }

        const candidateObj: Candidate = {
          id: `cand_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
          name: parsedData.name || filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
          email: parsedData.email || "",
          phone: parsedData.phone || "",
          filename,
          rawText: rawText || "Parsed via Gemini",
          parsedData,
          createdAt: new Date().toISOString(),
        };

        processedCandidates.push(candidateObj);
      } catch (parseErr) {
        console.error(`Failed parsing file ${filename}:`, parseErr);
        // Add a basic fallback so the rest of the files can continue
        processedCandidates.push({
          id: `cand_err_${Date.now()}_${i}`,
          name: filename.replace(/\.[^/.]+$/, ""),
          email: "",
          phone: "",
          filename,
          rawText: "Failed parsing.",
          parsedData: {
            name: filename.replace(/\.[^/.]+$/, ""),
            email: "",
            phone: "",
            linkedin: "",
            github: "",
            portfolio: "",
            location: "Unknown",
            skills: [],
            projects: [],
            experience: [],
            totalExperienceYears: 0,
            education: [],
            certifications: [],
            achievements: [],
            languages: [],
          },
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Save to DB
    await db.saveCandidates(processedCandidates);
    res.json({ success: true, count: processedCandidates.length, candidates: processedCandidates });
  } catch (error: any) {
    console.error("Error in upload-resumes route:", error);
    res.status(500).json({ error: error.message || "Failed to process resumes." });
  }
});

/**
 * POST /api/screen
 * Matches all candidates against the active Job Description and scores them
 */
app.post("/api/screen", async (req: any, res: any) => {
  try {
    const jd = await db.getJD();
    if (!jd) {
      return res.status(400).json({ error: "Please upload a Job Description first." });
    }

    const candidates = await db.getCandidates();
    if (candidates.length === 0) {
      return res.status(400).json({ error: "Please upload at least one Candidate Resume first." });
    }

    console.log(`Screening ${candidates.length} candidates against Job Description: "${jd.parsedData.title}"`);
    const screeningResults: ScreeningResult[] = [];

    // Screen each candidate
    for (const candidate of candidates) {
      console.log(`Screening candidate: ${candidate.name}...`);
      const result = await ScreeningEngine.screenCandidate(candidate, jd);
      screeningResults.push(result);
    }

    // Save screening results to database
    await db.saveScreeningResults(screeningResults);

    res.json({ success: true, count: screeningResults.length });
  } catch (error: any) {
    console.error("Error in screening route:", error);
    res.status(500).json({ error: error.message || "Failed to execute screening process." });
  }
});

/**
 * GET /api/results
 * Returns all ranked candidate screening details
 */
app.get("/api/results", async (req: any, res: any) => {
  try {
    const results = await db.getScreeningDetailsList();
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch results." });
  }
});

/**
 * GET /api/candidate/:id
 * Get detailed report for a single candidate
 */
app.get("/api/candidate/:id", async (req: any, res: any) => {
  try {
    const details = await db.getScreeningDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ error: "Screening report not found." });
    }
    res.json({ details });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch candidate report." });
  }
});

/**
 * GET /api/download-csv
 * Exports the ranked candidates table as a CSV attachment
 */
app.get("/api/download-csv", async (req: any, res: any) => {
  try {
    const results = await db.getScreeningDetailsList();
    if (results.length === 0) {
      return res.status(400).json({ error: "No screening results available for export." });
    }

    // Construct CSV Header
    let csv = "Rank,Candidate Name,Email,Phone,Overall Score,Semantic Score,Skill Score,Experience Score,Education Score,Bonus Score,Matched Skills,Missing Skills,Recommendation\n";

    results.forEach((r, idx) => {
      const rank = idx + 1;
      const name = `"${r.candidate.name.replace(/"/g, '""')}"`;
      const email = r.candidate.email;
      const phone = r.candidate.phone;
      const overall = r.overallScore;
      const semantic = r.semanticScore;
      const skill = r.skillScore;
      const exp = r.experienceScore;
      const edu = r.educationScore;
      const bonus = r.bonusScore;
      const matched = `"${(r.matchedSkills || []).join(", ").replace(/"/g, '""')}"`;
      const missing = `"${(r.missingSkills || []).join(", ").replace(/"/g, '""')}"`;
      const rec = r.hiringRecommendation;

      csv += `${rank},${name},${email},${phone},${overall},${semantic},${skill},${exp},${edu},${bonus},${matched},${missing},${rec}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=ATS_Screening_Results.csv");
    res.status(200).send(csv);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate CSV download." });
  }
});

/**
 * DELETE /api/reset
 * Clears database tables
 */
app.delete("/api/reset", async (req: any, res: any) => {
  try {
    await db.reset();
    res.json({ success: true, message: "Database wiped successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to reset database." });
  }
});

/**
 * DELETE /api/clear-jd
 * Clears active Job Description and related screening results
 */
app.delete("/api/clear-jd", async (req: any, res: any) => {
  try {
    await db.clearJD();
    res.json({ success: true, message: "Active Job Target cleared successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to clear active Job Target." });
  }
});

// --- VITE DEV AND PRODUCTION MIDDLEWARE SETUP ---

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume Screening Agent running on http://localhost:${PORT}`);
  });
}

startServer();
