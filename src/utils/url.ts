/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Normalizes a URL extracted from candidate resumes
 */
export function normalizeUrl(url: string | null | undefined): string {
  if (!url) return "Not Available";
  let trimmed = url.trim();
  if (!trimmed) return "Not Available";

  // Remove common prefix text like "github: ", "linkedin: ", etc.
  trimmed = trimmed.replace(/^(github|linkedin|portfolio|url|profile|link)\s*:\s*/i, "");
  trimmed = trimmed.trim();

  // Remove trailing punctuation and slashes
  trimmed = trimmed.replace(/[.,/#!$%^&*;:{}=\-_`~()]+$/, "");
  trimmed = trimmed.trim();

  if (!trimmed) return "Not Available";

  const lower = trimmed.toLowerCase();
  if (
    lower === "none" ||
    lower === "not available" ||
    lower === "n/a" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "not listed" ||
    lower === "notprovided" ||
    lower === "not_available"
  ) {
    return "Not Available";
  }

  // Handle linkedin: linkedin.com/in/johndoe -> https://www.linkedin.com/in/johndoe
  if (lower.includes("linkedin.com")) {
    const parts = trimmed.split(/linkedin\.com/i);
    if (parts.length > 1) {
      const path = parts[1].replace(/^\//, ""); // remove leading slash from path
      return `https://www.linkedin.com/${path}`;
    }
  }

  // Handle github: github.com/johndoe -> https://github.com/johndoe
  if (lower.includes("github.com")) {
    const parts = trimmed.split(/github\.com/i);
    if (parts.length > 1) {
      const path = parts[1].replace(/^\//, "");
      return `https://github.com/${path}`;
    }
  }

  // If it starts with http:// or https://, return it as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If it has www., prepend https://
  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // For other domains (e.g., custom portfolios like "alexbackend.io"), prepend https://
  return `https://${trimmed}`;
}

/**
 * Validates whether a URL is properly formatted and clickable
 */
export function validateUrl(url: string | null | undefined): boolean {
  if (!url || url === "Not Available") return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.includes(".");
  } catch (e) {
    return false;
  }
}
