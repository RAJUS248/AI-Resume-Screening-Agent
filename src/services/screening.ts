/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobDescription, Candidate, ScreeningResult } from "../types";
import { AIService } from "./ai";
import { extractSkillsFromText } from "../data/skills";

/**
 * Calculates cosine similarity between two vectors
 */
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Maps standard education terms to a hierarchy rank (0-5)
 */
function getEducationRank(degreeText: string): number {
  const text = degreeText.toLowerCase();
  if (text.includes("phd") || text.includes("ph.d") || text.includes("doctorate") || text.includes("doctor")) {
    return 5;
  }
  if (text.includes("master") || text.includes("ms") || text.includes("mtech") || text.includes("m.tech") || text.includes("mba")) {
    return 4;
  }
  if (text.includes("bachelor") || text.includes("bs") || text.includes("btech") || text.includes("b.tech") || text.includes("be") || text.includes("b.e") || text.includes("degree")) {
    return 3;
  }
  if (text.includes("associate")) {
    return 2;
  }
  if (text.includes("high school") || text.includes("diploma")) {
    return 1;
  }
  return 0;
}

export class ScreeningEngine {
  /**
   * Run the ATS Screening algorithm on a single candidate against a Job Description
   */
  public static async screenCandidate(
    candidate: Candidate,
    jd: JobDescription
  ): Promise<ScreeningResult> {
    const resumeData = candidate.parsedData;
    const jdData = jd.parsedData;

    // --- 1. SEMANTIC MATCHING (40%) ---
    const jdEmbedding = await AIService.getEmbedding(jd.rawText);
    const resumeEmbedding = await AIService.getEmbedding(candidate.rawText);
    const similarity = calculateCosineSimilarity(jdEmbedding, resumeEmbedding);
    
    // Cosine similarity for texts typically ranges between 0.35 and 0.90
    // We normalize this range to 0 - 100 for recruiters
    const minSim = 0.40;
    const maxSim = 0.85;
    let semanticScore = 0;
    if (similarity > minSim) {
      semanticScore = Math.min(100, ((similarity - minSim) / (maxSim - minSim)) * 100);
    }
    semanticScore = Math.max(10, Math.round(semanticScore * 10) / 10); // Minimum 10

    // --- 2. SKILL MATCHING (30%) ---
    // Combine JD requiredSkills and technologies for the master list of expected skills
    const jdSkillsSet = new Set<string>();
    
    // Extract any extra skills mentioned in JD text that weren't captured
    const jdExtractedSkills = extractSkillsFromText(jd.rawText);
    
    jdData.requiredSkills.forEach(s => jdSkillsSet.add(s.trim()));
    jdData.technologies.forEach(t => jdSkillsSet.add(t.trim()));
    jdExtractedSkills.forEach(s => jdSkillsSet.add(s));

    const jdSkills = Array.from(jdSkillsSet).filter(s => s.length > 1);

    // Extract all candidate skills
    const candidateSkillsSet = new Set<string>();
    resumeData.skills.forEach(s => candidateSkillsSet.add(s.trim()));
    
    // Run rule-based extractor on candidate rawText to ensure no missed skills
    const resumeExtractedSkills = extractSkillsFromText(candidate.rawText);
    resumeExtractedSkills.forEach(s => candidateSkillsSet.add(s));
    
    const candidateSkills = Array.from(candidateSkillsSet);

    // Compute intersections and differences (case-insensitive checking)
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const additionalSkills: string[] = [];

    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase());
    const jdSkillsLower = jdSkills.map(s => s.toLowerCase());

    // Evaluate JD skills
    jdSkills.forEach(skill => {
      const idx = candidateSkillsLower.indexOf(skill.toLowerCase());
      if (idx !== -1) {
        // Matched! Keep original casing of candidate or JD
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // Evaluate additional skills (skills candidate has that are NOT in JD)
    candidateSkills.forEach(skill => {
      if (!jdSkillsLower.includes(skill.toLowerCase())) {
        additionalSkills.push(skill);
      }
    });

    // Calculate skill score
    let skillScore = 100;
    if (jdSkills.length > 0) {
      skillScore = (matchedSkills.length / jdSkills.length) * 100;
    }
    skillScore = Math.round(skillScore * 10) / 10;

    // --- 3. EXPERIENCE MATCHING (15%) ---
    const reqYears = jdData.minimumExperience || 0;
    const candYears = resumeData.totalExperienceYears || 0;
    
    let experienceScore = 100;
    if (reqYears > 0) {
      if (candYears >= reqYears) {
        // Meets or exceeds requirement
        // Exceeding provides a slight boost (up to 100)
        experienceScore = 100;
      } else {
        // Proportional score
        experienceScore = (candYears / reqYears) * 100;
      }
    }
    experienceScore = Math.round(Math.max(0, Math.min(100, experienceScore)) * 10) / 10;

    // --- 4. EDUCATION MATCHING (10%) ---
    const jdEducationText = jdData.educationRequirement || "Bachelor's";
    const jdEduRank = getEducationRank(jdEducationText);
    
    // Find highest rank among candidate educations
    let candMaxRank = 0;
    if (resumeData.education && resumeData.education.length > 0) {
      resumeData.education.forEach(edu => {
        const rank = getEducationRank(`${edu.degree} ${edu.university}`);
        if (rank > candMaxRank) {
          candMaxRank = rank;
        }
      });
    } else {
      // Fallback check on raw resume text
      candMaxRank = getEducationRank(candidate.rawText);
    }

    let educationScore = 100;
    if (jdEduRank > 0) {
      if (candMaxRank >= jdEduRank) {
        educationScore = 100;
      } else {
        educationScore = (candMaxRank / jdEduRank) * 100;
      }
    }
    educationScore = Math.round(Math.max(20, Math.min(100, educationScore)) * 10) / 10; // Minimum 20 for basic education match

    // --- 5. BONUS POINTS / PROJECTS & CERTS (5%) ---
    // Calculate bonus based on certifications count and project details
    let bonusPoints = 0;
    const certsCount = resumeData.certifications?.length || 0;
    const projectsCount = resumeData.projects?.length || 0;

    // Max 50 points from certs
    bonusPoints += Math.min(50, certsCount * 15);
    // Max 50 points from detailed projects
    bonusPoints += Math.min(50, projectsCount * 15);
    
    const bonusScore = Math.min(100, bonusPoints);

    // --- 6. OVERALL WEIGHED ATS SCORE ---
    // Weighted ATS Score formula
    // Semantic = 40%
    // Skills = 30%
    // Experience = 15%
    // Education = 10%
    // Bonus = 5%
    const overallScore = 
      (semanticScore * 0.40) + 
      (skillScore * 0.30) + 
      (experienceScore * 0.15) + 
      (educationScore * 0.10) + 
      (bonusScore * 0.05);

    const roundedOverall = Math.round(overallScore * 10) / 10;

    // --- 7. RECRUITER AI SUMMARY & RECOMMENDATION ---
    // Call Gemini API to explain the ranking and produce final recommendations
    const explanationData = await AIService.generateAIExplanation(resumeData, jdData, {
      overallScore: roundedOverall,
      semanticScore,
      skillScore,
      experienceScore,
      educationScore,
      bonusScore,
    });

    return {
      id: `${candidate.id}_screen`,
      candidateId: candidate.id,
      jdId: jd.id,
      overallScore: roundedOverall,
      semanticScore,
      skillScore,
      experienceScore,
      educationScore,
      bonusScore,
      matchedSkills,
      missingSkills,
      additionalSkills,
      aiExplanation: explanationData.explanation,
      hiringRecommendation: explanationData.recommendation,
      screenedAt: new Date().toISOString(),
    };
  }
}
