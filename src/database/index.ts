/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs/promises";
import path from "path";
import { JobDescription, Candidate, ScreeningResult, ScreeningDetails } from "../types";

// Path to store our database
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "database.json");

interface DatabaseSchema {
  jobDescriptions: JobDescription[];
  candidates: Candidate[];
  screeningResults: ScreeningResult[];
}

const initialSchema: DatabaseSchema = {
  jobDescriptions: [],
  candidates: [],
  screeningResults: [],
};

class LocalDatabase {
  private cache: DatabaseSchema | null = null;

  private async ensureInitialized() {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      try {
        const fileContent = await fs.readFile(DB_FILE, "utf-8");
        this.cache = JSON.parse(fileContent);
      } catch (e) {
        // File does not exist or is corrupted, write initial
        await this.write(initialSchema);
      }
    } catch (error) {
      console.error("Database initialization error:", error);
      this.cache = { ...initialSchema };
    }
  }

  private async read(): Promise<DatabaseSchema> {
    if (this.cache) {
      return this.cache;
    }
    await this.ensureInitialized();
    return this.cache || { ...initialSchema };
  }

  private async write(data: DatabaseSchema): Promise<void> {
    this.cache = data;
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  // --- JOB DESCRIPTION OPERATIONS ---

  public async getJD(): Promise<JobDescription | null> {
    const db = await this.read();
    if (db.jobDescriptions.length === 0) return null;
    // Return the latest active Job Description
    return db.jobDescriptions[db.jobDescriptions.length - 1];
  }

  public async saveJD(jd: JobDescription): Promise<void> {
    const db = await this.read();
    // Maintain only the current active JD to keep the screening process clean,
    // or push to list. Let's overwrite / set current.
    db.jobDescriptions = [jd];
    await this.write(db);
  }

  public async clearJD(): Promise<void> {
    const db = await this.read();
    db.jobDescriptions = [];
    db.screeningResults = [];
    await this.write(db);
  }

  // --- CANDIDATE OPERATIONS ---

  public async getCandidates(): Promise<Candidate[]> {
    const db = await this.read();
    return db.candidates;
  }

  public async getCandidate(id: string): Promise<Candidate | null> {
    const db = await this.read();
    return db.candidates.find(c => c.id === id) || null;
  }

  public async saveCandidates(candidates: Candidate[]): Promise<void> {
    const db = await this.read();
    // Append or replace? Let's add them, preventing exact duplicate IDs or emails
    for (const newCand of candidates) {
      const idx = db.candidates.findIndex(c => c.id === newCand.id || c.email === newCand.parsedData.email);
      if (idx !== -1) {
        db.candidates[idx] = newCand;
      } else {
        db.candidates.push(newCand);
      }
    }
    await this.write(db);
  }

  // --- SCREENING RESULT OPERATIONS ---

  public async saveScreeningResults(results: ScreeningResult[]): Promise<void> {
    const db = await this.read();
    // Overwrite existing results for these candidates in this JD
    for (const res of results) {
      const idx = db.screeningResults.findIndex(r => r.candidateId === res.candidateId && r.jdId === res.jdId);
      if (idx !== -1) {
        db.screeningResults[idx] = res;
      } else {
        db.screeningResults.push(res);
      }
    }
    await this.write(db);
  }

  public async getScreeningDetailsList(): Promise<ScreeningDetails[]> {
    const db = await this.read();
    const activeJd = await this.getJD();
    if (!activeJd) return [];

    const activeResults = db.screeningResults.filter(r => r.jdId === activeJd.id);
    
    const detailsList: ScreeningDetails[] = [];
    for (const res of activeResults) {
      const candidate = db.candidates.find(c => c.id === res.candidateId);
      if (candidate) {
        detailsList.push({
          ...res,
          candidate,
          jobDescription: activeJd,
        });
      }
    }

    // Sort by overall score descending
    return detailsList.sort((a, b) => b.overallScore - a.overallScore);
  }

  public async getScreeningDetails(candidateId: string): Promise<ScreeningDetails | null> {
    const db = await this.read();
    const activeJd = await this.getJD();
    if (!activeJd) return null;

    const res = db.screeningResults.find(r => r.candidateId === candidateId && r.jdId === activeJd.id);
    if (!res) return null;

    const candidate = db.candidates.find(c => c.id === candidateId);
    if (!candidate) return null;

    return {
      ...res,
      candidate,
      jobDescription: activeJd,
    };
  }

  // --- RESET DATABASE ---
  public async reset(): Promise<void> {
    await this.write({
      jobDescriptions: [],
      candidates: [],
      screeningResults: [],
    });
  }
}

export const db = new LocalDatabase();
