# 🤖 AI Resume Screening Agent

An intelligent **AI-powered Resume Screening System** that helps recruiters and hiring managers automatically evaluate candidates against a Job Description (JD). The application uses **Natural Language Processing (NLP)**, **semantic similarity**, **ATS-style scoring**, and **Google Gemini AI** to rank candidates, explain hiring decisions, and generate recruiter-friendly insights.

Designed as an end-to-end AI Engineering project, this application demonstrates modern backend development, AI integration, semantic search, responsive frontend design, and explainable AI.

---

Designed as an end-to-end AI Engineering project, this application demonstrates modern backend development, AI integration, semantic search, responsive frontend design, and explainable AI.

---

## 🚀 Live Demo

### 🌐 Google AI Studio App

Try the live application here:

**https://ai.studio/apps/bc091fa0-ac41-4d44-a30b-13e84350a668**

---

## 📸 Application Preview

<img width="1917" height="841" alt="Screenshot 2026-07-19 191801" src="https://github.com/user-attachments/assets/3e412d51-2b56-4e99-bb2c-d41a8a3270bc" />

<img width="1302" height="745" alt="Screenshot 2026-07-19 190055" src="https://github.com/user-attachments/assets/e339e933-b75e-4109-849d-8c1188d8eda5" />

<img width="1915" height="850" alt="Screenshot 2026-07-19 191810" src="https://github.com/user-attachments/assets/41995a17-d9cd-4664-ba72-9de08607f228" />

<img width="1917" height="852" alt="Screenshot 2026-07-19 191821" src="https://github.com/user-attachments/assets/8031f017-ac4c-4b9a-ae3d-28f80cc49d27" />

<img width="1906" height="855" alt="Screenshot 2026-07-19 191832" src="https://github.com/user-attachments/assets/4f410021-afe1-4f9a-a894-e046706f9477" />

<img width="1890" height="447" alt="Screenshot 2026-07-19 191951" src="https://github.com/user-attachments/assets/b6564d9f-2c9b-4a83-8b99-e7c43e8ad4ce" />


## ✨ Features

### 📄 Job Description Processing

* Paste a Job Description directly.
* Upload Job Description (.txt, .pdf, .docx).
* Extracts:

  * Required Skills
  * Preferred Skills
  * Experience Requirements
  * Education Requirements
  * Keywords
  * Responsibilities

### 📑 Resume Screening

* Upload one or multiple resumes.
* Supports:

  * PDF
  * DOCX
  * TXT
* Automatically extracts:

  * Candidate Name
  * Email
  * Phone Number
  * GitHub
  * LinkedIn
  * Portfolio
  * Skills
  * Projects
  * Experience
  * Education
  * Certifications

### 🧠 AI-Powered Candidate Evaluation

Each candidate is evaluated using a weighted ATS scoring engine:

| Metric                    | Weight |
| ------------------------- | ------ |
| Semantic Similarity       | 40%    |
| Skill Match               | 30%    |
| Experience Match          | 15%    |
| Education Match           | 10%    |
| Certifications & Projects | 5%     |

### 🤖 Gemini AI Analysis

For every candidate, Gemini generates:

* Strengths
* Weaknesses
* Matching Skills
* Missing Skills
* Experience Analysis
* Education Fit
* Recruiter-Friendly Summary
* Hiring Recommendation

### 📊 Interactive Dashboard

* Candidate Leaderboard
* ATS Score Breakdown
* Skill Match Analysis
* Candidate Detail View
* Resume Preview
* Download CSV Report

### 🔗 Profile Link Validation

Automatically validates and normalizes:

* GitHub
* LinkedIn
* Portfolio

Invalid or missing links are displayed as **"Not Available"** instead of broken hyperlinks.

### 📁 Demo Mode

The application includes built-in demo data.

Users can:

* Click **Load Demo Data**
* Instantly test the complete workflow without uploading any files.

Or they can:

* Paste their own Job Description
* Upload their own resumes

---

# 🏗️ Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Vite

## Backend

* Node.js
* Express.js

## AI & NLP

* Google Gemini API
* Sentence Transformers
* Semantic Similarity
* ATS Scoring Engine

## Resume Parsing

* PDF Parsing
* DOCX Parsing
* Regex-based Information Extraction

## Database

* SQLite

## Utilities

* TypeScript
* REST APIs

---

# 📂 Project Structure

```text
AI-Resume-Screening-Agent/
│
├── demo_data/
│   ├── job_description.txt
│   ├── resume_1_backend.txt
│   ├── resume_2_aiml.txt
│   ├── resume_3_fullstack.txt
│   ├── resume_4_datascientist.txt
│   └── resume_5_fresher.txt
│
├── src/
│   ├── components/
│   ├── services/
│   ├── database/
│   ├── utils/
│   ├── data/
│   └── App.tsx
│
├── server.ts
├── package.json
├── README.md
└── ...
```

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Resume-Screening-Agent.git

cd AI-Resume-Screening-Agent
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Get your API key from Google AI Studio.

---

## 4. Run the Development Server

```bash
npm run dev
```

Start the backend (if separate):

```bash
npm run server
```

---

# 💻 How to Use

## Option 1 — Demo Mode

1. Open the application.
2. Click **Load Demo Data**.
3. Click **Begin Match & Rank**.
4. Review the leaderboard.
5. Open individual candidate reports.
6. Download the CSV report.

---

## Option 2 — Custom Screening

1. Paste or upload a Job Description.
2. Upload one or multiple resumes.
3. Click **Begin Match & Rank**.
4. View ranked candidates.
5. Explore AI-generated reports.
6. Export results to CSV.

---

# 📊 Candidate Leaderboard

The leaderboard displays:

* Candidate Rank
* ATS Score
* Semantic Similarity
* Skill Match
* Experience Match
* Education Match
* GitHub
* LinkedIn
* Portfolio
* Hiring Recommendation

Clicking a candidate opens a detailed report containing:

* Resume Preview
* Skill Analysis
* Missing Skills
* Experience Breakdown
* Education Analysis
* Certifications
* Projects
* Gemini AI Explanation

---

# 📈 ATS Scoring Logic

The application evaluates candidates using multiple scoring dimensions:

* Semantic similarity between the Job Description and resume.
* Technical skill matching.
* Relevant work experience.
* Educational qualifications.
* Certifications and project relevance.

The weighted scores are combined into a final ATS score to rank candidates objectively.

---

# 📦 Export

The application supports exporting results as CSV, including:

* Candidate Name
* ATS Score
* Semantic Score
* Skill Match
* Experience Match
* Education Match
* Recommendation
* GitHub
* LinkedIn
* Portfolio

---

# 🧪 Demo Data

This project includes sample data for demonstration purposes:

* 1 Sample Job Description
* 5 Demo Resumes
* Automatic Candidate Ranking

This allows recruiters and reviewers to test the application immediately without providing their own documents.

---

# 🔒 Error Handling

The application includes:

* URL validation for profile links
* Graceful handling of invalid or missing data
* Gemini API retry logic
* API rate-limit fallbacks
* Cached demo analysis
* Robust parsing fallbacks
* Friendly error messages

---

# 🔮 Future Improvements

* OCR support for scanned resumes
* Resume keyword highlighting
* Multi-language resume parsing
* Interview question generation
* Email candidate recommendations
* Recruiter authentication
* PostgreSQL support
* Docker deployment
* Cloud deployment (Render / Railway / AWS)

---

# 👨‍💻 Author

**Raju S. Baradur**

* GitHub: https://github.com/RAJUS248
* LinkedIn: https://www.linkedin.com/in/rajubaradur24/
* Portfolio: https://rajus248.github.io/

---

## ⭐ If you found this project useful, consider giving it a Star on GitHub!
