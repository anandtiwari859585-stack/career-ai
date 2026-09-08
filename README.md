# 🎓 CareerAI — AI-Powered Student Career Guidance Platform

> A full-stack web app that helps students discover their ideal career path through AI-powered assessments, personalized roadmaps, salary insights, gamified progress tracking, and a job exam finder.

---

## 🚀 Live Demo

> Coming soon — deploy on Vercel

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Smart Career Quiz** | Multi-step assessment analyzing traits, preferences, and skills |
| 🤖 **AI Career Analysis** | Gemini AI generates personalized strengths, gaps, action items, and career summaries |
| 🗺️ **Personalized Roadmap** | Phase-based milestones tailored to your matched career path |
| 💰 **Salary Insights** | Real salary data by level (entry / mid / senior) for India & USA |
| 🏆 **XP & Badges System** | Gamified progress — earn XP and badges for completing assessments and milestones |
| 🏅 **Global Leaderboard** | Compete with other students ranked by XP |
| 📋 **Job Exam Finder** | Search any job title → AI returns all relevant exams, certifications & entrance tests |
| 🔐 **Google OAuth** | Passwordless sign-in via Google |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | Supabase (PostgreSQL + RLS + Views + Triggers) |
| **Auth** | Supabase Auth + Google OAuth |
| **AI** | Google Gemini API (`gemini-3.8-flash`) |

---

## 📁 Project Structure

```
career-ai/
├── app/
│   ├── page.tsx                  # Landing page (GSAP animated)
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard shell + nav
│   │   ├── page.tsx              # Dashboard home
│   │   ├── assess/               # Career assessment flow
│   │   ├── roadmap/              # Personalized roadmap
│   │   ├── exams/                # Job exam finder
│   │   ├── badges/               # Badge collection
│   │   └── leaderboard/          # Global XP leaderboard
│   └── api/
│       ├── analyze/route.ts      # AI career analysis endpoint
│       ├── exams/route.ts        # Job exam finder endpoint
│       └── progress/route.ts     # Roadmap progress updates
├── components/
│   └── DashboardNav.tsx          # Sticky glassmorphism navbar
├── lib/
│   ├── data.ts                   # Career profiles, quiz questions, badges
│   └── supabase/                 # Supabase client (browser + server)
└── supabase/
    └── schema.sql                # Full DB schema, RLS policies, triggers
```

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/career-ai.git
cd career-ai
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Enable **Google OAuth** under **Authentication → Providers → Google**

### 3. Set up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID
3. Add authorized origins: `http://localhost:3000`
4. Add redirect URI: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`

### 4. Set up Gemini API
1. Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 5. Configure environment variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🧩 Challenges & How We Solved Them

### 1. 🔐 Google OAuth Redirect URI Mismatch
**Challenge:** Getting `redirect_uri_mismatch` error when trying to sign in with Google.

**Root Cause:** The redirect URI configured in Google Cloud Console was pointing to the app (`localhost:3000/auth/callback`) instead of Supabase's OAuth handler.

**Solution:** The correct flow is:
```
User → Google → Supabase (/auth/v1/callback) → App (/auth/callback)
```
Google Console redirect URI must be: `https://<project>.supabase.co/auth/v1/callback`
Supabase redirect URL must be: `http://localhost:3000/auth/callback`

---

### 2. 🤖 OpenAI API Credits Exhausted
**Challenge:** The app originally used OpenAI GPT-4o-mini. During development, credits ran out causing all AI features to fail.

**Solution:** Migrated entirely to **Google Gemini API** (`gemini-3.8-flash`) which offers:
- ✅ Free tier — 1500 requests/day
- ✅ No credit card required
- ✅ Comparable quality and speed

---

### 3. ⚡ AI Response Too Slow
**Challenge:** Job Exam Finder was taking 8–12 seconds per search because the prompt asked to "list ALL exams" and used `generateContent` which waits for the full response.

**Solution (3 optimizations):**
1. Changed prompt from "list ALL" to "top 8 most important"
2. Reduced `maxOutputTokens` from 2000 → 1200
3. Switched to `generateContentStream` to start processing immediately
4. Set `temperature: 0.1` for faster, deterministic output

Result: Response time dropped from ~10s to ~3s.

---

### 4. 🔄 Gemini Model Deprecations
**Challenge:** Gemini model names kept returning 404 errors as Google deprecated older models mid-development (`gemini-1.5-flash` → `gemini-2.0-flash` → `gemini-3.6-flash`).

**Solution:** Built a utility to programmatically query the available models list from the Gemini API:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"
```
This lets us always pick the latest available model. Currently using `gemini-3.8-flash`.

---

### 5. 🧩 Inconsistent JSON from AI
**Challenge:** Gemini sometimes returned JSON wrapped in markdown code fences (` ```json `) or with extra text before/after, causing `JSON.parse()` to throw errors.

**Solution:** Added an aggressive JSON extraction function:
```ts
const start = cleaned.indexOf('{')
const end = cleaned.lastIndexOf('}')
cleaned = cleaned.slice(start, end + 1)
```
This extracts just the JSON object regardless of what the model wraps around it.

---

### 6. 🏅 Leaderboard Showing Empty
**Challenge:** The leaderboard view queries all profiles, but Supabase RLS (Row Level Security) was set to `auth.uid() = id` — meaning each user could only see their own row.

**Solution:** Added a separate public read policy specifically for the leaderboard:
```sql
CREATE POLICY "Public leaderboard read"
ON public.profiles FOR SELECT
USING (true);
```

---

### 7. 🎨 UI/UX Polish with GSAP
**Challenge:** The default Tailwind UI looked flat and lacked the premium feel expected for a career platform.

**Solution:** Integrated GSAP animations on the landing page:
- Staggered entrance animations for each element
- Floating ambient orbs in background
- Button glow pulse and scale-on-hover interactions
- Matched deep-space color scheme across landing + dashboard (violet/indigo/blue palette with glassmorphism cards)

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 🗺️ Roadmap

- [ ] Deploy to Vercel
- [ ] Add email/password auth option
- [ ] Add resume builder based on career match
- [ ] Add AI mock interview feature
- [ ] Add community discussion per career path
- [ ] Mobile app (React Native)

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ using Next.js, Supabase & Google Gemini
</div>
