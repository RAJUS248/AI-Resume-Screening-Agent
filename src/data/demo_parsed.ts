/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ParsedJobDescription, ParsedResume } from "../types";

export const DEMO_JD_PARSED: ParsedJobDescription = {
  title: "Senior Full Stack AI Engineer",
  requiredSkills: [
    "Python",
    "TypeScript",
    "JavaScript",
    "React.js",
    "Tailwind CSS",
    "Next.js",
    "Redux",
    "Node.js",
    "Express",
    "FastAPI",
    "REST APIs",
    "WebSockets",
    "PostgreSQL",
    "Redis",
    "MongoDB",
    "Pinecone / Vector Databases",
    "LLM integrations (Gemini API, OpenAI API)",
    "PyTorch",
    "Hugging Face",
    "LangChain",
    "Docker",
    "AWS (S3, EC2)",
    "CI/CD pipelines",
    "Git"
  ],
  preferredSkills: [
    "Experience with Google Cloud Platform (GCP) or Firebase",
    "Knowledge of RAG (Retrieval-Augmented Generation) architectures",
    "Familiarity with D3.js or Recharts for interactive analytics visualization"
  ],
  responsibilities: [
    "Build and maintain responsive web applications using React and Tailwind CSS.",
    "Design, implement, and secure robust API services using Express or FastAPI.",
    "Implement Retrieval-Augmented Generation (RAG) and orchestrate LLM workflows using frameworks like LangChain.",
    "Collaborate with product designers and backend engineers to integrate advanced AI features.",
    "Optimize application performance and ensure high availability of services.",
    "Write clean, modular, and well-tested code, contributing to continuous improvement of deployment pipelines."
  ],
  minimumExperience: 4,
  educationRequirement: "Bachelor's or Master's degree in Computer Science, engineering, or a related technical field.",
  keywords: [
    "Python",
    "TypeScript",
    "React.js",
    "Node.js",
    "Express",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Pinecone",
    "LLM",
    "RAG",
    "LangChain",
    "Docker",
    "AWS",
    "Git"
  ],
  technologies: [
    "React.js",
    "Tailwind CSS",
    "Next.js",
    "Node.js",
    "Express",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "MongoDB",
    "Pinecone",
    "PyTorch",
    "Docker",
    "AWS"
  ],
  softSkills: [
    "Collaboration",
    "Problem Solving",
    "Communication",
    "Mentoring",
    "Self-motivation"
  ]
};

export const DEMO_CANDIDATES_PARSED: Record<string, ParsedResume> = {
  "resume_1_backend.txt": {
    name: "Alex Mercer",
    email: "alex.mercer@email.com",
    phone: "+1 (555) 019-2834",
    linkedin: "https://www.linkedin.com/in/alexbackend",
    github: "https://github.com/alexbackend",
    portfolio: "https://alexbackend.io/portfolio",
    location: "Seattle, WA",
    skills: [
      "Python", "SQL", "JavaScript", "Go", "HTML5", "CSS3",
      "FastAPI", "Django", "Flask", "Express", "Node.js",
      "PostgreSQL", "MongoDB", "Redis", "MySQL",
      "AWS (EC2, RDS, S3)", "Docker", "Kubernetes", "CI/CD", "Git",
      "Agile/Scrum", "REST API Design", "Microservices Architecture"
    ],
    projects: [
      {
        title: "Scalable Queueing System",
        description: "Built a highly parallel background tasks orchestrator in Python using Redis and asyncio, open-sourced on GitHub.",
        technologies: ["Python", "Redis", "asyncio", "Docker"]
      },
      {
        title: "API Gateway Proxy",
        description: "Developed a lightweight API gateway with rate-limiting and JWT authentication using Go and Redis.",
        technologies: ["Go", "Redis", "JWT"]
      }
    ],
    experience: [
      {
        role: "Senior Backend Engineer",
        company: "CloudScale Solutions",
        duration: "Jan 2023 - Present",
        description: "Designed and built high-performance microservices using FastAPI and Docker, reducing API response latency by 35%.\nStructured complex database schemas in PostgreSQL, utilizing indexing and query optimization to handle 10M+ daily records.\nIntegrated third-party security, payment (Stripe), and messaging queues (RabbitMQ/Celery) into core transaction workflows.\nLed a team of 3 junior developers, maintaining code standards through code reviews and mentoring."
      },
      {
        role: "Python Backend Developer",
        company: "ByteForce Technologies",
        duration: "Aug 2020 - Dec 2022",
        description: "Developed RESTful API endpoints for an e-commerce platform using Django and Django Rest Framework.\nMigrated legacy monolithic services to Python-based microservices, improving deployment speed and fault tolerance.\nMaintained CI/CD pipelines in Gitlab, automating container builds and staging environment deployments."
      }
    ],
    totalExperienceYears: 6,
    education: [
      {
        degree: "B.S. in Computer Science",
        university: "University of Washington",
        gradYear: "2020",
        cgpa: "3.82/4.0"
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect - Associate",
      "Professional Scrum Master (PSM I)"
    ],
    achievements: [],
    languages: ["English"]
  },

  "resume_2_aiml.txt": {
    name: "Sophia Chen",
    email: "sophia.chen@email.com",
    phone: "+1 (555) 012-7489",
    linkedin: "https://www.linkedin.com/in/sophiaai",
    github: "https://github.com/sophia-ml-ai/research",
    portfolio: "https://sophia-ai.github.io",
    location: "San Francisco, CA",
    skills: [
      "Python", "SQL", "C++", "Bash",
      "PyTorch", "TensorFlow", "Hugging Face", "Scikit-learn",
      "Gemini API", "OpenAI API", "LangChain", "LlamaIndex", "RAG", "Prompt Engineering",
      "Pinecone", "Milvus", "PostgreSQL", "Redis",
      "AWS", "Google Cloud Platform (GCP)", "MLflow", "Docker", "Kubernetes", "Git"
    ],
    projects: [
      {
        title: "OpenRAG-Kernel",
        description: "A lightweight, modular semantic indexing search middleware built using LangChain, Hugging Face, and FastAPI.",
        technologies: ["Python", "LangChain", "FastAPI", "Pinecone"]
      },
      {
        title: "Neural-Pruner-CLI",
        description: "Open-source PyTorch command-line tool to perform structured pruning on neural network weight representations.",
        technologies: ["PyTorch", "Python", "CLI"]
      }
    ],
    experience: [
      {
        role: "Lead AI Engineer",
        company: "Cortex Intelligent Systems",
        duration: "Mar 2022 - Present",
        description: "Engineered a generative search engine using LangChain and Gemini API, leveraging RAG architectures to query 100k+ PDF documents with Pinecone.\nDeveloped and fine-tuned BERT and LLama-based models for custom domain-specific sentiment and entity extraction, boosting accuracy by 18%.\nBuilt highly optimized inference pipelines inside AWS SageMaker, decreasing container invocation overhead by 40%.\nDesigned and maintained custom LLM prompt evaluation frameworks to measure output semantic drift."
      },
      {
        role: "Machine Learning Research Engineer",
        company: "Nexus Labs",
        duration: "Oct 2020 - Feb 2022",
        description: "Conducted deep learning research on multi-modal models for speech and vision analysis using PyTorch and Hugging Face Transformers.\nPrepared high-quality data pipelines handling raw text, images, and audio, feeding automated preprocessing architectures.\nPublished research on neural networks optimization techniques for edge-device compute environments."
      }
    ],
    totalExperienceYears: 5,
    education: [
      {
        degree: "M.S. in Intelligent Systems & Machine Learning",
        university: "Stanford University",
        gradYear: "2020",
        cgpa: "3.90/4.0"
      },
      {
        degree: "B.S. in Computer Science & Mathematics",
        university: "UC Berkeley",
        gradYear: "2018",
        cgpa: "3.85/4.0"
      }
    ],
    certifications: [
      "Google Cloud Certified Professional Machine Learning Engineer",
      "DeepLearning.AI Generative AI with LLMs specialization"
    ],
    achievements: [
      "Published research paper on neural network compression at NeurIPS Workshop"
    ],
    languages: ["English", "Mandarin"]
  },

  "resume_3_fullstack.txt": {
    name: "Marcus Thorne",
    email: "marcus.thorne@email.com",
    phone: "+1 (555) 018-9944",
    linkedin: "https://www.linkedin.com/in/marcusfullstack",
    github: "https://github.com/marcusdev",
    portfolio: "http://marcus-codes.web.app",
    location: "Detroit, MI",
    skills: [
      "TypeScript", "JavaScript", "Python", "HTML/CSS", "SQL",
      "React.js", "Tailwind CSS", "Next.js", "Redux", "D3.js", "Recharts",
      "Node.js", "Express", "FastAPI", "WebSockets", "GraphQL", "REST",
      "PostgreSQL", "MongoDB", "Redis", "Pinecone",
      "Docker", "AWS (S3, Lambda)", "Git", "Github Actions"
    ],
    projects: [
      {
        title: "GeoInsight Dashboard",
        description: "Interactive visual dashboard displaying geolocalized demographic data using React, D3.js, and Leaflet.",
        technologies: ["React.js", "D3.js", "Leaflet"]
      },
      {
        title: "AI Resume Parser",
        description: "Open-source project on GitHub utilizing TypeScript and LLM APIs to extract sections of resume profiles.",
        technologies: ["TypeScript", "Node.js", "Gemini API"]
      }
    ],
    experience: [
      {
        role: "Senior Full Stack Developer",
        company: "AppForge Labs",
        duration: "Aug 2022 - Present",
        description: "Designed and built a real-time analytics dashboard using React, Tailwind CSS, and Recharts, improving user retention by 25%.\nImplemented an AI chatbot interface powered by Gemini API and LangChain, processing over 50,000 queries daily with 98% uptime.\nDeveloped scalable serverless REST APIs using Node.js, TypeScript, and AWS Lambda, saving 45% in server maintenance costs.\nGuided structural frontend architecture, implementing custom hook states and optimizing bundle sizes for 5x faster loads."
      },
      {
        role: "Full Stack Software Engineer",
        company: "TechHive Systems",
        duration: "Jul 2020 - Jul 2022",
        description: "Created interactive data visualizations using D3.js for cloud infrastructure utilization metrics.\nDeveloped and maintained multiple responsive client-facing websites using React and Next.js, fully optimized for mobile platforms.\nSet up automated testing workflows with Jest and GitHub Actions, boosting test coverage to 85%."
      }
    ],
    totalExperienceYears: 5,
    education: [
      {
        degree: "B.S. in Software Engineering",
        university: "University of Michigan",
        gradYear: "2020",
        cgpa: "3.91/4.0"
      }
    ],
    certifications: [
      "React Nanodegree - Udacity",
      "Professional Developer Certification in Node.js"
    ],
    achievements: [],
    languages: ["English"]
  },

  "resume_4_datascientist.txt": {
    name: "Emily Miller",
    email: "emily.miller@email.com",
    phone: "+1 (555) 014-5312",
    linkedin: "https://www.linkedin.com/in/emilydata",
    github: "https://github.com/emily-stats",
    portfolio: "https://emilystats.com",
    location: "Chicago, IL",
    skills: [
      "Python", "R", "SQL", "MATLAB",
      "Pandas", "NumPy", "Scikit-learn", "SciPy", "Statsmodels", "XGBoost",
      "Tableau", "Seaborn", "Matplotlib", "Plotly",
      "MySQL", "Snowflake", "PostgreSQL",
      "Jupyter", "Git", "Docker", "Apache Spark"
    ],
    projects: [
      {
        title: "Housing Price Forecaster",
        description: "Built a detailed regression pipeline evaluating municipal real estate trends in major cities.",
        technologies: ["Python", "Scikit-learn", "Pandas"]
      },
      {
        title: "Customer Segmenter",
        description: "Unsupervised learning repository on GitHub utilizing K-Means Clustering and PCA on retail sales records.",
        technologies: ["Python", "K-Means", "PCA"]
      }
    ],
    experience: [
      {
        role: "Data Scientist",
        company: "Apex Financial Group",
        duration: "Sep 2021 - Present",
        description: "Created a predictive customer churn model using XGBoost and Scikit-learn, saving over $1.2M in annual retention expenditures.\nFormulated and executed continuous A/B tests for user landing pages, driving a 14% improvement in conversion ratios.\nDesigned automated Tableau dashboards querying Snowflake database, providing daily key performance metrics to executives.\nPerformed rigorous statistical analysis and regression modeling to identify core market and demographic trends."
      },
      {
        role: "Data Analyst",
        company: "Insight Analytics Partners",
        duration: "Jun 2020 - Aug 2021",
        description: "Cleaned, normalized, and engineered features from multi-source customer datasets using Pandas and SQL queries.\nCreated monthly market intelligence reports utilizing advanced statistical tests (t-tests, ANOVA).\nManaged data warehouse ETL pipelines, optimizing ingestion speeds by 20%."
      }
    ],
    totalExperienceYears: 4,
    education: [
      {
        degree: "B.S. in Statistics & Data Science",
        university: "University of Chicago",
        gradYear: "2020",
        cgpa: "3.75/4.0"
      }
    ],
    certifications: [
      "IBM Data Science Professional Certificate",
      "Certified Tableau Desktop Specialist"
    ],
    achievements: [],
    languages: ["English"]
  },

  "resume_5_fresher.txt": {
    name: "Samuel Green",
    email: "samuel.green@email.com",
    phone: "+1 (555) 016-8211",
    linkedin: "https://www.linkedin.com/in/fresher-sam",
    github: "https://github.com/sam-fresher",
    portfolio: "",
    location: "Boston, MA",
    skills: [
      "TypeScript", "JavaScript", "Python", "Java", "HTML5", "CSS3", "SQL",
      "React.js", "Tailwind CSS", "Redux",
      "Node.js", "Express", "Flask",
      "PostgreSQL", "SQLite",
      "Git", "GitHub", "VS Code", "Postman", "Linux"
    ],
    projects: [
      {
        title: "DevMatch Forum (Academic Capstone)",
        description: "Built a responsive developer discussion forum using React, Tailwind CSS, Express, and SQLite. Implemented JWT user authentication and user profile customization.",
        technologies: ["React.js", "Tailwind CSS", "Express", "SQLite", "JWT"]
      },
      {
        title: "Recipe Finder",
        description: "Developed a mobile-friendly recipe search tool using JavaScript and a third-party REST API.",
        technologies: ["JavaScript", "REST API"]
      }
    ],
    experience: [
      {
        role: "Software Engineering Intern",
        company: "TechStart Academy",
        duration: "Jun 2023 - Aug 2023",
        description: "Assisted in developing and testing interactive web modules using React and Tailwind CSS.\nParticipated in daily stand-up meetings, sprint planning, and team code reviews.\nResolved over 15 front-end UI bugs, improving mobile responsiveness of the core application.\nWrote clean, well-documented code following company design standards."
      }
    ],
    totalExperienceYears: 0.5,
    education: [
      {
        degree: "B.S. in Computer Science",
        university: "Boston University",
        gradYear: "2024",
        cgpa: "3.65/4.0"
      }
    ],
    certifications: [
      "Meta Front-End Developer Professional Certificate"
    ],
    achievements: [],
    languages: ["English"]
  }
};

export const DEMO_EXPLANATIONS: Record<string, { explanation: string; recommendation: "Strong Hire" | "Hire" | "Potential" | "No Match" }> = {
  "Alex Mercer": {
    recommendation: "Hire",
    explanation: `### AI Candidate Summary Report
**Alex Mercer** is a highly capable **Senior Backend Engineer** with **6 years of professional experience** focusing on Python (FastAPI, Django) and high-throughput PostgreSQL databases. 

### Core Strengths & Key Fits
- **Robust Backend Fit**: Demonstrates strong backend engineering credentials, with active production usage of FastAPI, Express, PostgreSQL, Redis, and microservices architecture.
- **Experience Requirement Met**: Holds 6 years of professional experience, exceeding the minimum 4 years requirement.
- **Docker & AWS Proficiency**: Experienced with modern cloud architecture, container deployments (Docker, Kubernetes), and CI/CD pipelines.

### Missing Core Requirements & Gaps
- **No Direct AI/LLM Experience**: No exposure to LLMs, generative AI prompt engineering, LangChain, or vector databases (such as Pinecone) listed in experience or projects.
- **No Modern Frontend Fit**: The job description specifically requests React, Next.js, and Tailwind CSS. Alex's frontend knowledge appears limited to basic JavaScript and HTML/CSS.

### Areas for Inquiry in Interviews
1. *"Since you have robust experience in Python API optimization, how would you design a backend worker queue to handle long-running generative AI model inference tasks asynchronously?"*
2. *"Are you familiar with or willing to pick up modern React and Tailwind CSS frontend architectures?"*`
  },

  "Sophia Chen": {
    recommendation: "Strong Hire",
    explanation: `### AI Candidate Summary Report
**Sophia Chen** is an outstanding **Lead AI Engineer** with **5 years of machine learning experience** and an M.S. from Stanford University. She has direct, production-grade experience building and deploying generative AI systems, RAG architectures, and NLP pipelines.

### Core Strengths & Key Fits
- **Deep GenAI Expertise**: Deep expertise in LLMs (Gemini, OpenAI APIs), LangChain, prompt engineering, and vector search (Pinecone, Milvus), perfectly matching the core AI requirements of the role.
- **Strong Technical Foundation**: Proven record of developing scalable ML pipelines, optimizing BERT/LLama-based inference times by 40% on AWS SageMaker.
- **Academic Distinction**: Holds an M.S. in Intelligent Systems from Stanford and B.S. from UC Berkeley.

### Missing Core Requirements & Gaps
- **Limited Frontend Experience**: While Sophia lists strong AI/ML and backend skills, her profile shows little professional frontend engineering experience (React, Next.js, Tailwind CSS), which is a core expectation for a Full Stack engineer.

### Areas for Inquiry in Interviews
1. *"How would you approach designing a full-stack user interface that streams LLM completions token-by-token in real-time?"*
2. *"Can you describe a challenge you faced when building a production RAG system, particularly around semantic search accuracy and vector embeddings?"*`
  },

  "Marcus Thorne": {
    recommendation: "Strong Hire",
    explanation: `### AI Candidate Summary Report
**Marcus Thorne** is the **most complete fit** for the **Senior Full Stack AI Engineer** position. Blending **5 years of robust full-stack software development experience** with active, production-ready AI integration (chatbot interfaces built on Gemini API & LangChain).

### Core Strengths & Key Fits
- **Perfect Full-Stack Balance**: Seamless match for both ends of the stack. Extensive professional history with React, Tailwind CSS, Next.js, Node.js, Express, and TypeScript.
- **Active AI Integration Experience**: Developed and deployed an AI chatbot powered by the Gemini API and LangChain that successfully handles over 50,000 queries daily.
- **Exceptional Analytical Visualizations**: Deep familiarity with Recharts and D3.js (the exact preferred technologies listed in the job description).

### Missing Core Requirements & Gaps
- **Slightly Less Heavy ML Modeling**: Focuses primarily on application development and LLM API integrations rather than custom PyTorch/TensorFlow deep learning model design or fine-tuning (though this is secondary to the full-stack engineering focus).

### Areas for Inquiry in Interviews
1. *"You built an AI chatbot with 50,000 daily queries. How did you handle LLM rate limiting and context window optimizations to ensure 98% uptime?"*
2. *"Can you walk us through how you designed the interactive analytical visualizations using D3.js or Recharts?"*`
  },

  "Emily Miller": {
    recommendation: "No Match",
    explanation: `### AI Candidate Summary Report
**Emily Miller** is a focused **Data Scientist** with **4 years of professional experience** in predictive modeling, statistical analysis, and business intelligence. While highly skilled in statistical analysis, her profile does not match the active software development and AI engineering requirements of this role.

### Core Strengths & Key Fits
- **Strong Statistics & Data foundations**: Outstanding stats background with experience building predictive models (XGBoost), regression analyses, and custom SQL/Snowflake structures.
- **Data Visualization**: Expert in BI tools (Tableau, Seaborn, Matplotlib) for executive reports.

### Missing Core Requirements & Gaps
- **No Web Application Engineering**: Entirely lacks professional experience in modern web development frameworks requested in the JD (React, Tailwind CSS, Next.js, Node.js, Express, FastAPI).
- **No Generative AI / LLM Experience**: Experience is centered around traditional machine learning and tabular statistics, rather than modern generative LLMs, RAG, prompt orchestration, or vector search.

### Areas for Inquiry in Interviews
- Emily's profile represents a career track distinct from full-stack engineering. If considered, inquiry should focus on her interest in transitioning to product engineering:
1. *"Are you interested in moving away from statistics and data analytics toward active, full-stack product development?"*`
  },

  "Samuel Green": {
    recommendation: "Potential",
    explanation: `### AI Candidate Summary Report
**Samuel Green** is an enthusiastic, motivated **recent Computer Science graduate** from Boston University. He displays excellent academic projects, high potential, and solid foundational skills in React, TypeScript, and Python.

### Core Strengths & Key Fits
- **Modern Tech Stack**: Familiar with the modern technologies requested in the JD (React, TypeScript, Tailwind CSS, Node.js, Express, Python).
- **Strong Academic Capstone**: Developed a responsive capstone project utilizing React, Express, and JWT user authentication, proving hands-on understanding of basic full-stack principles.

### Missing Core Requirements & Gaps
- **Severe Experience Gap**: Lacks the required **4+ years of professional software engineering experience** (has only 3 months of internship experience).
- **No Production AI Deployment**: While mathematically and computationally literate, he has no professional production exposure to orchestrating LLMs, RAG, or Pinecone databases.

### Areas for Inquiry in Interviews
1. *"Tell us about your capstone forum project. How did you structure the JWT authentication flow and what challenges did you encounter?"*
2. *"As a fresher, what is your self-learning approach to picking up production-grade tools like LangChain, Docker, or AWS?"*`
  }
};
