/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Master Database of 300+ Software Engineering & AI Skills grouped by Category

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const MASTER_SKILLS: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: [
      "Python", "JavaScript", "TypeScript", "C++", "C", "C#", "Java", "Go", "Golang", 
      "Rust", "Ruby", "PHP", "Kotlin", "Swift", "Scala", "R", "MATLAB", "SQL", "NoSQL",
      "HTML5", "CSS3", "Sass", "GraphQL", "Bash", "Shell", "PowerShell", "Perl", "Haskell",
      "Elixir", "Julia", "Dart", "Objective-C", "Assembly", "Fortran", "Lisp"
    ]
  },
  {
    name: "Frontend Frameworks & Libraries",
    skills: [
      "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte", "SvelteKit",
      "Tailwind CSS", "Bootstrap", "Material UI", "MUI", "Chakra UI", "Shadcn UI", "Radix UI",
      "Redux", "Redux Toolkit", "Zustand", "MobX", "Recoil", "React Query", "TanStack Query",
      "Gatsby", "Nuxt.js", "Remix", "SolidJS", "Webpack", "Vite", "Babel", "Eslint", "Prettier",
      "HTML", "CSS", "Less", "PostCSS", "jQuery"
    ]
  },
  {
    name: "Backend Frameworks & Technologies",
    skills: [
      "Node.js", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask", 
      "Spring Boot", "Spring", "Ruby on Rails", "Rails", "Laravel", "ASP.NET", "Dotnet",
      "Koa", "Hapi", "Fiber", "Gin", "Echo", "Sanic", "Tornado", "Celery", "Socket.io",
      "GraphQL", "Apollo Server", "gRPC", "Protocol Buffers", "REST API", "SOAP", "Microservices",
      "Message Queues", "RabbitMQ", "Apache Kafka", "Kafka", "ActiveMQ", "BullMQ"
    ]
  },
  {
    name: "Databases & Storage",
    skills: [
      "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "SQLite3", 
      "DynamoDB", "Cassandra", "MariaDB", "Oracle DB", "SQL Server", "MSSQL", "Firebase",
      "Firestore", "Realtime Database", "InfluxDB", "TimescaleDB", "Neo4j", "ArangoDB",
      "Elasticsearch", "Logstash", "Kibana", "Opensearch", "Supabase", "Pocketbase",
      "Amazon S3", "MinIO", "Google Cloud Storage", "Azure Blob Storage"
    ]
  },
  {
    name: "Vector Databases",
    skills: [
      "Pinecone", "Milvus", "Chroma", "ChromaDB", "Weaviate", "Qdrant", "Faiss",
      "PGVector", "LanceDB", "Vald", "Vespa"
    ]
  },
  {
    name: "AI, Machine Learning & Deep Learning",
    skills: [
      "Machine Learning", "Deep Learning", "Artificial Intelligence", "AI", "Neural Networks",
      "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "Sklearn", "XGBoost", "LightGBM",
      "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "OpenCV", "NLTK", "Spacy",
      "Hugging Face", "Transformers", "Computer Vision", "Natural Language Processing", "NLP",
      "Speech Recognition", "Reinforcement Learning", "GANs", "Diffusion Models", "MLops",
      "DVC", "MLflow", "Weights & Biases", "W&B", "Kubeflow"
    ]
  },
  {
    name: "Generative AI & LLMs",
    skills: [
      "LLM", "Large Language Models", "Generative AI", "GPT-4", "GPT-3.5", "Gemini",
      "Gemini API", "Claude", "Anthropic", "Llama", "Mistral", "Cohere", "LangChain",
      "LlamaIndex", "Vector Embeddings", "RAG", "Retrieval-Augmented Generation",
      "Prompt Engineering", "Fine-Tuning", "LoRA", "QLoRA", "DSPy", "AutoGPT",
      "CrewAI", "LangGraph", "Semantic Kernel", "Hugging Face Hub", "Ollama"
    ]
  },
  {
    name: "Cloud Platforms & Infrastructure",
    skills: [
      "AWS", "Amazon Web Services", "EC2", "S3", "Lambda", "RDS", "ECS", "EKS", "Fargate",
      "GCP", "Google Cloud Platform", "Google Cloud", "Cloud Run", "Compute Engine", "GKE",
      "BigQuery", "App Engine", "Azure", "Microsoft Azure", "Azure Functions", "AKS",
      "Heroku", "Vercel", "Netlify", "DigitalOcean", "Linode", "Cloudflare", "Cloudflare Workers"
    ]
  },
  {
    name: "DevOps & CI/CD",
    skills: [
      "Docker", "Kubernetes", "K8s", "Terraform", "Ansible", "Puppet", "Chef",
      "CI/CD", "GitHub Actions", "GitLab CI/CD", "Jenkins", "CircleCI", "TravisCI",
      "ArgoCD", "Prometheus", "Grafana", "Datadog", "New Relic", "Sentry", "Nginx",
      "Apache", "HAProxy", "Linux", "Unix", "Ubuntu", "Debian", "CentOS", "Alpine",
      "Bash Scripting", "Infrastructure as Code", "IaC", "Helm"
    ]
  },
  {
    name: "Testing, Tools & Agile Methodologies",
    skills: [
      "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Trello", "Agile",
      "Scrum", "Kanban", "Jest", "Mocha", "Chai", "Cypress", "Selenium", "Playwright",
      "PyTest", "JUnit", "Postman", "Swagger", "Storybook", "Docker Compose", "Webpack",
      "Vite", "ESLint", "Prettier", "npm", "yarn", "pnpm"
    ]
  },
  {
    name: "Mobile & Desktop Development",
    skills: [
      "React Native", "Flutter", "Ionic", "Cordova", "Xamarin", "SwiftUI", "UIKit",
      "Kotlin Multiplatform", "Electron", "Tauri", "PyQt", "Tkinter", "Unity", "Unreal Engine"
    ]
  },
  {
    name: "Soft Skills & Principles",
    skills: [
      "System Design", "Microservices Architecture", "Object-Oriented Programming", "OOP",
      "Functional Programming", "Design Patterns", "Data Structures", "Algorithms",
      "Clean Code", "TDD", "Test-Driven Development", "DDD", "Domain-Driven Design",
      "Software Architecture", "Project Management", "Technical Leadership", "Mentoring",
      "Collaboration", "Agile Development", "Scrum Master", "CI/CD Pipelines", "API Design",
      "Database Design", "Security Best Practices", "Scalability", "High Availability"
    ]
  }
];

// Flat list of all skills for rapid lookup
export const ALL_SKILLS_FLAT: string[] = MASTER_SKILLS.flatMap(cat => cat.skills);

// Map of lowercased skills to their canonical capitalization
export const SKILLS_LOWER_MAP: Record<string, string> = ALL_SKILLS_FLAT.reduce((acc, skill) => {
  acc[skill.toLowerCase()] = skill;
  return acc;
}, {} as Record<string, string>);

/**
 * Normalizes and matches text to extract skills
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  const matchedSkills = new Set<string>();

  // Use boundary-aware checking to avoid matching partial substrings (e.g. "Go" in "Google")
  for (const skill of ALL_SKILLS_FLAT) {
    const lowerSkill = skill.toLowerCase();
    
    // Escape regex characters
    const escapedSkill = lowerSkill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Create boundary regex
    let regex: RegExp;
    if (lowerSkill === 'c' || lowerSkill === 'r' || lowerSkill === 'go') {
      // Single letter or small word needs strict word boundaries
      regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    } else if (lowerSkill.includes('.') || lowerSkill.includes('#') || lowerSkill.includes('+')) {
      // Technical terms like C++, C#, .NET, Node.js might not work with standard \b
      regex = new RegExp(`(?:^|\\s|[,;:.()_\\-\\/])${escapedSkill}(?:$|\\s|[,;:.()_\\-\\/])`, 'i');
    } else {
      regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    }

    if (regex.test(normalizedText)) {
      matchedSkills.add(skill);
    }
  }

  return Array.from(matchedSkills);
}
