// ─── Quiz Questions ──────────────────────────────────────────────────────────
export const QUIZ_QUESTIONS = [
  {
    scenario: '🖥️ Weekend Activity',
    question: 'You have a completely free weekend. What sounds most exciting?',
    options: [
      { text: 'Build a small app or website just for fun', traits: ['software', 'frontend', 'fullstack'] },
      { text: 'Explore a dataset and find interesting patterns', traits: ['data', 'ml', 'analytics'] },
      { text: 'Set up a home server and automate everything', traits: ['devops', 'sysadmin', 'cloud'] },
      { text: 'Design a beautiful UI/UX mockup for an imaginary product', traits: ['design', 'frontend', 'ux'] },
    ],
  },
  {
    scenario: '🔧 System Crisis',
    question: 'A production system is crashing under load. What is your instinct?',
    options: [
      { text: 'Dive into the code and optimize the bottleneck', traits: ['software', 'backend', 'performance'] },
      { text: 'Set up monitoring, alerts, and auto-scaling', traits: ['devops', 'cloud', 'sre'] },
      { text: 'Analyze logs and metrics to find root cause', traits: ['data', 'analytics', 'sre'] },
      { text: 'Write a clear incident report and coordinate the team', traits: ['management', 'pm', 'leadership'] },
    ],
  },
  {
    scenario: '🤝 Group Project',
    question: 'During a group project, which role do you naturally take?',
    options: [
      { text: 'The one who writes most of the code', traits: ['software', 'backend', 'frontend'] },
      { text: 'The one who organizes tasks and keeps everyone on track', traits: ['pm', 'management', 'leadership'] },
      { text: 'The one who researches the best technical approach', traits: ['research', 'ml', 'data'] },
      { text: 'The one who presents the work and explains it clearly', traits: ['communication', 'marketing', 'sales'] },
    ],
  },
  {
    scenario: '💡 Creation Vision',
    question: 'When you imagine creating something meaningful, what do you picture?',
    options: [
      { text: 'A product that millions of users interact with daily', traits: ['software', 'frontend', 'product'] },
      { text: 'An intelligent system that learns and improves on its own', traits: ['ml', 'ai', 'research'] },
      { text: 'Secure, reliable infrastructure that never goes down', traits: ['devops', 'security', 'cloud'] },
      { text: 'A business that solves a real social or economic problem', traits: ['entrepreneur', 'business', 'impact'] },
    ],
  },
  {
    scenario: '📚 Self-Learning',
    question: 'Which topic would you happily read about on your own time?',
    options: [
      { text: 'How compilers, operating systems, or networks really work', traits: ['systems', 'backend', 'embedded'] },
      { text: 'Statistics, probability, and how ML models work under the hood', traits: ['ml', 'data', 'research'] },
      { text: 'How successful startups grew and the strategies they used', traits: ['business', 'entrepreneur', 'marketing'] },
      { text: 'Cybersecurity, ethical hacking, or privacy engineering', traits: ['security', 'hacking', 'privacy'] },
    ],
  },
  {
    scenario: '💰 Dream Career',
    question: 'Which career path sounds most fulfilling to you?',
    options: [
      { text: 'Senior Engineer at a tech giant building large-scale systems', traits: ['software', 'backend', 'systems'] },
      { text: 'AI/ML Research Scientist publishing impactful papers', traits: ['ml', 'ai', 'research'] },
      { text: 'CTO or Founder of my own tech startup', traits: ['entrepreneur', 'leadership', 'business'] },
      { text: 'Product Manager shaping the future of a great product', traits: ['pm', 'product', 'management'] },
    ],
  },
  {
    scenario: '🌐 Impact Type',
    question: 'Which type of impact matters most to you?',
    options: [
      { text: 'Technical excellence — elegant, scalable solutions', traits: ['software', 'backend', 'architecture'] },
      { text: 'Data insights — helping organizations make smarter decisions', traits: ['data', 'analytics', 'bi'] },
      { text: 'Security — protecting systems and people\'s privacy', traits: ['security', 'hacking', 'compliance'] },
      { text: 'Social impact — technology for underserved communities', traits: ['impact', 'nonprofit', 'social'] },
    ],
  },
  {
    scenario: '🎮 Deep Focus',
    question: 'Which activity could you spend hours on without getting bored?',
    options: [
      { text: 'Debugging a tricky coding problem until it finally works', traits: ['software', 'backend', 'quality'] },
      { text: 'Playing around with data visualizations and finding patterns', traits: ['data', 'analytics', 'visualization'] },
      { text: 'Drawing wireframes and prototyping user interfaces', traits: ['design', 'ux', 'frontend'] },
      { text: 'Writing about tech or teaching others what you know', traits: ['education', 'content', 'communication'] },
    ],
  },
  {
    scenario: '🏢 Ideal Workday',
    question: 'What does your perfect workday look like?',
    options: [
      { text: 'Deep focused coding sessions with minimal interruptions', traits: ['software', 'backend', 'research'] },
      { text: 'Meetings with stakeholders, making product decisions', traits: ['pm', 'management', 'leadership'] },
      { text: 'Experimenting with models and analyzing results', traits: ['ml', 'data', 'research'] },
      { text: 'Working with clients, translating their needs into solutions', traits: ['consulting', 'frontend', 'solutions'] },
    ],
  },
  {
    scenario: '🔮 Emerging Tech',
    question: 'Which emerging technology excites you most?',
    options: [
      { text: 'Generative AI & Large Language Models (GPT, Claude, Gemini)', traits: ['ai', 'ml', 'nlp'] },
      { text: 'Web3, Blockchain & Decentralized systems', traits: ['web3', 'blockchain', 'crypto'] },
      { text: 'Cloud-native architecture & Edge Computing', traits: ['cloud', 'devops', 'distributed'] },
      { text: 'Augmented Reality / Virtual Reality experiences', traits: ['ar', 'vr', 'graphics'] },
    ],
  },
]

// ─── Career Profiles ─────────────────────────────────────────────────────────
export const CAREER_PROFILES: Record<string, CareerProfile> = {
  software: {
    key: 'software',
    title: 'Software Development Engineer (SDE)',
    icon: '💻',
    match: 'Technical Builder',
    salaryIN: { entry: '6–10 LPA', mid: '15–30 LPA', senior: '35–80 LPA', lead: '60 LPA – 1.5 Cr' },
    salaryUS: { entry: '$90K–$120K', mid: '$140K–$200K', senior: '$220K–$350K', lead: '$350K+' },
    growth: 88, demand: 95,
    wlb: { stress: 65, flexibility: 75, remote: 85, satisfaction: 80 },
    quote: { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
    promo: ['Junior Dev', 'SDE-I', 'SDE-II', 'Senior SDE', 'Staff Eng', 'Principal Eng', 'VP Eng'],
    promoYrs: ['0', '0–1.5y', '1.5–3y', '3–5y', '5–8y', '8–12y', '12y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Master DSA — LeetCode 200+ problems', 'Build 3 full-stack projects for portfolio', 'Learn Git, Linux, and AWS free tier basics', 'Contribute to 1 open-source project'] },
      { phase: 'mid', label: 'Phase 2: Specialization (6–18 months)', items: ['Choose specialty: Frontend / Backend / Fullstack', 'Deep-dive system design concepts', 'Crack internship / first job', 'Learn CI/CD and code review practices'] },
      { phase: 'late', label: 'Phase 3: Growth (18 months+)', items: ['Own and architect features end-to-end', 'Mentor junior developers', 'Study engineering blogs (Netflix, Uber, Google)', 'Target promotion by demonstrating leadership'] },
    ],
    alts: [{ title: 'DevOps / SRE', overlap: '75%', desc: 'Automate & scale infrastructure' }, { title: 'Mobile Developer', overlap: '80%', desc: 'iOS or Android development' }, { title: 'Cloud Architect', overlap: '70%', desc: 'Design scalable cloud systems' }],
    traitMap: ['software', 'backend', 'frontend', 'fullstack', 'systems', 'performance', 'quality', 'architecture'],
  },
  data: {
    key: 'data',
    title: 'Data Scientist / Analyst',
    icon: '📊',
    match: 'Insight Seeker',
    salaryIN: { entry: '5–9 LPA', mid: '12–25 LPA', senior: '28–60 LPA', lead: '55 LPA – 1.2 Cr' },
    salaryUS: { entry: '$85K–$115K', mid: '$130K–$180K', senior: '$200K–$300K', lead: '$300K+' },
    growth: 92, demand: 90,
    wlb: { stress: 60, flexibility: 80, remote: 80, satisfaction: 82 },
    quote: { text: 'Data is the new oil — but like oil, it\'s only valuable after it\'s refined.', author: 'Clive Humby' },
    promo: ['Data Intern', 'Jr. Analyst', 'Data Analyst', 'Sr. Analyst', 'Data Scientist', 'Lead Scientist', 'Head of Data'],
    promoYrs: ['0', '0–1y', '1–2y', '2–4y', '4–6y', '6–9y', '9y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Master Python, Pandas, NumPy, Matplotlib', 'Complete SQL — joins, window functions, CTEs', 'Statistics & probability fundamentals', 'Kaggle: complete 3 beginner competitions'] },
      { phase: 'mid', label: 'Phase 2: ML & Analytics (6–18 months)', items: ['Learn scikit-learn, XGBoost, feature engineering', 'Build end-to-end ML pipelines', 'Create Tableau / Power BI dashboard portfolio', 'Study A/B testing and experiment design'] },
      { phase: 'late', label: 'Phase 3: Advanced (18 months+)', items: ['Deep learning: TensorFlow or PyTorch', 'MLOps: model deployment and monitoring', 'Develop domain expertise (fintech/health/etc.)', 'Present findings to non-technical stakeholders'] },
    ],
    alts: [{ title: 'ML Engineer', overlap: '82%', desc: 'Build & deploy ML models at scale' }, { title: 'Business Analyst', overlap: '78%', desc: 'Bridge business & data insights' }, { title: 'Data Engineer', overlap: '75%', desc: 'Build data pipelines & warehouses' }],
    traitMap: ['data', 'analytics', 'bi', 'visualization'],
  },
  ml: {
    key: 'ml',
    title: 'ML / AI Engineer',
    icon: '🤖',
    match: 'Intelligence Builder',
    salaryIN: { entry: '8–14 LPA', mid: '18–40 LPA', senior: '40–90 LPA', lead: '80 LPA – 2 Cr' },
    salaryUS: { entry: '$110K–$150K', mid: '$170K–$250K', senior: '$280K–$400K', lead: '$400K+' },
    growth: 96, demand: 97,
    wlb: { stress: 70, flexibility: 78, remote: 82, satisfaction: 85 },
    quote: { text: 'Machine intelligence is the last invention humanity will ever need to make.', author: 'Nick Bostrom' },
    promo: ['ML Intern', 'Jr. ML Eng', 'ML Engineer', 'Sr. ML Eng', 'Staff ML Eng', 'Principal Scientist', 'AI Research Lead'],
    promoYrs: ['0', '0–1.5y', '1.5–3y', '3–5y', '5–8y', '8–12y', '12y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Math Foundation (0–6 months)', items: ['Linear algebra, calculus, probability (3Blue1Brown)', 'Python fluency: NumPy, Pandas, Matplotlib', 'Andrew Ng\'s Machine Learning Specialization', 'Implement algorithms from scratch'] },
      { phase: 'mid', label: 'Phase 2: Deep Learning (6–18 months)', items: ['Deep Learning Specialization (deeplearning.ai)', 'NLP: transformers, BERT, fine-tune an LLM', 'Computer Vision: CNNs, YOLO, segmentation', 'Build & deploy a production ML API (FastAPI)'] },
      { phase: 'late', label: 'Phase 3: Research & Scale (18 months+)', items: ['Read & implement papers from Arxiv', 'Contribute to Hugging Face / open-source AI', 'MLOps: Kubeflow, MLflow, model monitoring', 'Target top AI labs or publish original research'] },
    ],
    alts: [{ title: 'Data Scientist', overlap: '88%', desc: 'Statistical analysis & insights' }, { title: 'NLP Engineer', overlap: '85%', desc: 'Language models & text AI' }, { title: 'AI Research Scientist', overlap: '80%', desc: 'Cutting-edge AI research' }],
    traitMap: ['ml', 'ai', 'nlp', 'research', 'ar', 'vr'],
  },
  devops: {
    key: 'devops',
    title: 'DevOps / Cloud Engineer',
    icon: '☁️',
    match: 'System Automator',
    salaryIN: { entry: '6–10 LPA', mid: '14–28 LPA', senior: '30–65 LPA', lead: '60 LPA – 1.3 Cr' },
    salaryUS: { entry: '$95K–$125K', mid: '$145K–$200K', senior: '$220K–$320K', lead: '$320K+' },
    growth: 85, demand: 88,
    wlb: { stress: 72, flexibility: 80, remote: 88, satisfaction: 76 },
    quote: { text: 'Infrastructure as code: because clicking through UIs is so last century.', author: 'DevOps Community' },
    promo: ['Ops Intern', 'Jr. DevOps Eng', 'DevOps Eng', 'Sr. DevOps Eng', 'Cloud Architect', 'Staff Infra Eng', 'VP Infrastructure'],
    promoYrs: ['0', '0–1y', '1–2.5y', '2.5–4y', '4–7y', '7–11y', '11y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Linux fundamentals & bash scripting', 'Docker & containerization basics', 'Git workflows & CI/CD concepts', 'AWS/GCP/Azure free tier hands-on'] },
      { phase: 'mid', label: 'Phase 2: Automation (6–18 months)', items: ['Kubernetes: pods, deployments, services, HPA', 'Infrastructure as code: Terraform & Ansible', 'Set up a full CI/CD pipeline (GitHub Actions)', 'AWS Solutions Architect certification'] },
      { phase: 'late', label: 'Phase 3: Architecture (18 months+)', items: ['Design multi-region high-availability systems', 'Cost optimization & FinOps practices', 'Service mesh: Istio / Linkerd', 'Security hardening & compliance (SOC2, ISO27001)'] },
    ],
    alts: [{ title: 'Site Reliability Eng', overlap: '90%', desc: 'Reliability & performance engineering' }, { title: 'Cloud Architect', overlap: '85%', desc: 'Design scalable cloud infrastructure' }, { title: 'Platform Engineer', overlap: '80%', desc: 'Internal developer platforms' }],
    traitMap: ['devops', 'cloud', 'sre', 'distributed'],
  },
  security: {
    key: 'security',
    title: 'Cybersecurity Engineer',
    icon: '🔐',
    match: 'Digital Guardian',
    salaryIN: { entry: '5–9 LPA', mid: '12–25 LPA', senior: '28–55 LPA', lead: '50 LPA – 1.1 Cr' },
    salaryUS: { entry: '$90K–$120K', mid: '$140K–$190K', senior: '$210K–$300K', lead: '$300K+' },
    growth: 88, demand: 93,
    wlb: { stress: 75, flexibility: 65, remote: 72, satisfaction: 78 },
    quote: { text: 'Security is not a product, but a process.', author: 'Bruce Schneier' },
    promo: ['Security Intern', 'Jr. Security Analyst', 'Security Engineer', 'Sr. Security Eng', 'Security Architect', 'CISO', 'VP Security'],
    promoYrs: ['0', '0–1y', '1–3y', '3–5y', '5–8y', '8–12y', '12y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Networking fundamentals (TCP/IP, DNS, HTTP)', 'Linux security & command-line tools', 'CompTIA Security+ certification', 'Set up a home lab (Kali Linux, Metasploitable)'] },
      { phase: 'mid', label: 'Phase 2: Specialization (6–18 months)', items: ['Web application security (OWASP Top 10)', 'Bug bounty programs (HackerOne, Bugcrowd)', 'Penetration testing methodology', 'CEH or OSCP certification path'] },
      { phase: 'late', label: 'Phase 3: Advanced (18 months+)', items: ['Specialize: red team / blue team / SOC', 'Cloud security: AWS Security Specialty', 'Incident response and digital forensics', 'Build a responsible disclosure portfolio'] },
    ],
    alts: [{ title: 'Penetration Tester', overlap: '90%', desc: 'Ethical hacking & vulnerability testing' }, { title: 'Security Analyst', overlap: '85%', desc: 'Monitor & respond to threats' }, { title: 'Cloud Security Eng', overlap: '78%', desc: 'Secure cloud infrastructure' }],
    traitMap: ['security', 'hacking', 'privacy', 'compliance'],
  },
  pm: {
    key: 'pm',
    title: 'Product Manager (PM)',
    icon: '🎯',
    match: 'Vision Driver',
    salaryIN: { entry: '8–14 LPA', mid: '20–40 LPA', senior: '45–90 LPA', lead: '80 LPA – 2 Cr' },
    salaryUS: { entry: '$100K–$140K', mid: '$160K–$230K', senior: '$250K–$350K', lead: '$350K+' },
    growth: 82, demand: 85,
    wlb: { stress: 68, flexibility: 72, remote: 75, satisfaction: 83 },
    quote: { text: 'A product manager is the CEO of the product — without the authority.', author: 'Ben Horowitz' },
    promo: ['APM', 'PM', 'Senior PM', 'Group PM', 'Director of PM', 'VP Product', 'CPO'],
    promoYrs: ['0', '0–2y', '2–4y', '4–6y', '6–9y', '9–12y', '12y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Read: Inspired by Marty Cagan, Lean Startup', 'Learn user research & interview techniques', 'Understand SQL and basic analytics tools', 'Build a product case study portfolio'] },
      { phase: 'mid', label: 'Phase 2: Practice (6–18 months)', items: ['APM program or transition from engineering', 'Master Agile/Scrum & sprint planning', 'Learn OKR frameworks & metric definition', 'Build a product from zero-to-one (side project)'] },
      { phase: 'late', label: 'Phase 3: Leadership (18 months+)', items: ['Own a product line end-to-end with a team', 'Stakeholder management & executive comms', 'Develop data-driven roadmapping skills', 'Study platform strategy & ecosystem thinking'] },
    ],
    alts: [{ title: 'Program Manager', overlap: '85%', desc: 'Manage complex cross-team programs' }, { title: 'Growth PM', overlap: '80%', desc: 'User acquisition & retention focus' }, { title: 'Technical PM', overlap: '75%', desc: 'PM with deep technical background' }],
    traitMap: ['pm', 'management', 'leadership', 'product'],
  },
  entrepreneur: {
    key: 'entrepreneur',
    title: 'Tech Entrepreneur / Founder',
    icon: '🚀',
    match: 'Builder & Visionary',
    salaryIN: { entry: 'Variable', mid: 'Equity + Salary', senior: 'Depends on exit', lead: 'Unlimited potential' },
    salaryUS: { entry: '$0–$80K (pre-seed)', mid: '$100K–$200K (seed)', senior: '$200K+ (Series A+)', lead: 'Exit: $M–$B' },
    growth: 90, demand: 78,
    wlb: { stress: 85, flexibility: 90, remote: 90, satisfaction: 88 },
    quote: { text: 'The biggest risk is not taking any risk. In a world that\'s changing really quickly, the only strategy guaranteed to fail is not taking risks.', author: 'Mark Zuckerberg' },
    promo: ['Side Project', 'Co-Founder', 'Founder/CEO', 'Seed Stage', 'Series A', 'Growth Stage', 'IPO / Exit'],
    promoYrs: ['0', '0–1y', '1–3y', '2–5y', '4–7y', '6–10y', '10y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Discovery (0–6 months)', items: ['Identify a real problem worth solving', 'Validate idea with 20+ customer interviews', 'Learn no-code tools to build fast MVPs', 'Study startup fundamentals (YC Startup School)'] },
      { phase: 'mid', label: 'Phase 2: Build & Launch (6–18 months)', items: ['Build & launch MVP, get first 100 users', 'Apply to accelerators (YC, Techstars, NASSCOM)', 'Learn fundraising basics & pitch deck creation', 'Build co-founder & early team relationships'] },
      { phase: 'late', label: 'Phase 3: Scale (18 months+)', items: ['Achieve product-market fit (NPS > 40)', 'Raise seed / Series A funding', 'Build repeatable sales & growth channels', 'Hire key executives: CTO, CMO, CFO'] },
    ],
    alts: [{ title: 'Product Manager', overlap: '80%', desc: 'Shape products at established companies' }, { title: 'VC / Investor', overlap: '72%', desc: 'Fund & guide other startups' }, { title: 'Tech Consultant', overlap: '75%', desc: 'Solve problems across industries' }],
    traitMap: ['entrepreneur', 'business', 'startup'],
  },
  design: {
    key: 'design',
    title: 'UX / Product Designer',
    icon: '🎨',
    match: 'Experience Crafter',
    salaryIN: { entry: '4–8 LPA', mid: '10–20 LPA', senior: '22–45 LPA', lead: '40–80 LPA' },
    salaryUS: { entry: '$75K–$100K', mid: '$110K–$160K', senior: '$180K–$260K', lead: '$260K+' },
    growth: 78, demand: 80,
    wlb: { stress: 55, flexibility: 82, remote: 80, satisfaction: 84 },
    quote: { text: 'Design is not just what it looks like and feels like. Design is how it works.', author: 'Steve Jobs' },
    promo: ['Jr. Designer', 'UX Designer', 'Sr. UX Designer', 'Lead Designer', 'Principal Designer', 'Head of Design', 'VP/CDO'],
    promoYrs: ['0', '0–1.5y', '1.5–3y', '3–5y', '5–8y', '8–11y', '11y+'],
    roadmap: [
      { phase: 'early', label: 'Phase 1: Foundation (0–6 months)', items: ['Master Figma & design systems', 'User research: personas, journey maps, usability tests', 'Study design principles: typography, color theory', 'Build a portfolio with 3 detailed case studies'] },
      { phase: 'mid', label: 'Phase 2: Practice (6–18 months)', items: ['Collaborate with engineers on real products', 'Learn basic HTML/CSS (builds empathy for devs)', 'Study interaction design & micro-animations', 'Contribute to design critique communities'] },
      { phase: 'late', label: 'Phase 3: Leadership (18 months+)', items: ['Own design system for a product line', 'Mentor junior designers & set team standards', 'Learn design strategy & business metrics', 'Speak at design conferences / write case studies'] },
    ],
    alts: [{ title: 'UI Engineer', overlap: '80%', desc: 'Build pixel-perfect UI with code' }, { title: 'Motion Designer', overlap: '72%', desc: 'Animation & interactive experiences' }, { title: 'Design Researcher', overlap: '78%', desc: 'Deep user research & insights' }],
    traitMap: ['design', 'ux', 'graphics'],
  },
}

// ─── Badge Definitions (mirrors DB) ─────────────────────────────────────────
export const BADGES: Record<string, BadgeDefinition> = {
  first_login:       { key: 'first_login',       name: 'First Step',         icon: '👋', xp: 50,  desc: 'Logged in for the first time' },
  quiz_complete:     { key: 'quiz_complete',      name: 'Self-Aware',         icon: '🧠', xp: 100, desc: 'Completed the career interest quiz' },
  github_connected:  { key: 'github_connected',   name: 'Open Source Hero',  icon: '💻', xp: 75,  desc: 'Connected your GitHub profile' },
  first_assessment:  { key: 'first_assessment',   name: 'Career Explorer',   icon: '🗺️', xp: 150, desc: 'Completed your first full assessment' },
  streak_3:          { key: 'streak_3',           name: '3-Day Streak',       icon: '🔥', xp: 100, desc: 'Active 3 days in a row' },
  streak_7:          { key: 'streak_7',           name: 'Week Warrior',       icon: '⚡', xp: 200, desc: 'Active 7 days in a row' },
  milestone_1:       { key: 'milestone_1',        name: 'First Step Forward', icon: '✅', xp: 75,  desc: 'Completed your first roadmap milestone' },
  milestone_5:       { key: 'milestone_5',        name: 'On a Roll',          icon: '🎯', xp: 150, desc: 'Completed 5 roadmap milestones' },
  milestone_10:      { key: 'milestone_10',       name: 'Dedicated',          icon: '🏆', xp: 300, desc: 'Completed 10 roadmap milestones' },
  level_5:           { key: 'level_5',            name: 'Rising Star',        icon: '⭐', xp: 200, desc: 'Reached Level 5' },
  level_10:          { key: 'level_10',           name: 'Career Pro',         icon: '🌟', xp: 500, desc: 'Reached Level 10' },
  reassessed:        { key: 'reassessed',         name: 'Growth Mindset',     icon: '📈', xp: 100, desc: 'Retook the assessment to track growth' },
}

// ─── XP thresholds per level ─────────────────────────────────────────────────
export function xpForLevel(level: number): number {
  return level * level * 100
}

export function levelFromXP(xp: number): number {
  return Math.min(20, Math.floor(Math.sqrt(xp / 100)) + 1)
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CareerProfile {
  key: string
  title: string
  icon: string
  match: string
  salaryIN: SalaryBand
  salaryUS: SalaryBand
  growth: number
  demand: number
  wlb: WLBScores
  quote: { text: string; author: string }
  promo: string[]
  promoYrs: string[]
  roadmap: RoadmapPhase[]
  alts: AltCareer[]
  traitMap: string[]
}

export interface SalaryBand { entry: string; mid: string; senior: string; lead: string }
export interface WLBScores { stress: number; flexibility: number; remote: number; satisfaction: number }
export interface RoadmapPhase { phase: 'early' | 'mid' | 'late'; label: string; items: string[] }
export interface AltCareer { title: string; overlap: string; desc: string }
export interface BadgeDefinition { key: string; name: string; icon: string; xp: number; desc: string }

export interface AssessmentInput {
  quizAnswers: number[]
  githubRepos: { name: string; lang: string | null; stars: number; desc: string | null }[]
  skills: { langs: string[]; frameworks: string[]; tools: string[] }
  projectDesc: string
  preferences: { workEnv: string; jobPriority: string; companyType: string; extraNotes: string }
  profile: { status: string; field: string; region: string; gpa: string }
}
