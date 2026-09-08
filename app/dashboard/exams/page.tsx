'use client'
import { useState } from 'react'

type Exam = {
  name: string
  body: string
  purpose: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  cost: string
  link: string
  category: string
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-500/10 border-green-500/30',
  Intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Advanced: 'text-red-400 bg-red-500/10 border-red-500/30',
}

const CATEGORY_ICON: Record<string, string> = {
  Certification: '🎓',
  'Government Exam': '🏛️',
  'Entrance Test': '📝',
  'Placement Test': '🏢',
}

export default function ExamsPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [exams, setExams] = useState<Exam[] | null>(null)
  const [error, setError] = useState('')
  const [searchedJob, setSearchedJob] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setExams(null)
    setSearchedJob(query.trim())

    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: query.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setExams(data.exams)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exams.')
    } finally {
      setLoading(false)
    }
  }

  const grouped = exams
    ? exams.reduce<Record<string, Exam[]>>((acc, exam) => {
        const cat = exam.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(exam)
        return acc
      }, {})
    : {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📋 Job Exam Finder</h1>
        <p className="text-slate-400 text-sm">
          Search any job title and get a complete list of real exams, certifications &amp; tests you need to qualify for it.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. Software Engineer, Data Scientist, IAS Officer, Ethical Hacker..."
          className="flex-1 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0"
        >
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </form>

      {/* Popular searches */}
      {!exams && !loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Popular Searches</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Software Engineer', 'Data Scientist', 'Cloud Engineer', 'Cybersecurity Analyst',
              'IAS Officer', 'DevOps Engineer', 'Machine Learning Engineer', 'UI/UX Designer',
              'Product Manager', 'Full Stack Developer', 'Network Engineer', 'Ethical Hacker',
            ].map(job => (
              <button
                key={job}
                onClick={() => { setQuery(job) }}
                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
              >
                {job}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-4 animate-pulse">🔍</div>
          <p className="text-slate-400 text-sm">Finding all exams &amp; certifications for <span className="text-white font-semibold">"{searchedJob}"</span>...</p>
          <p className="text-slate-600 text-xs mt-2">This may take a few seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {exams && !loading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">
                Results for <span className="text-indigo-400">"{searchedJob}"</span>
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">{exams.length} exams &amp; certifications found</p>
            </div>
            <button
              onClick={() => { setExams(null); setQuery(''); setSearchedJob('') }}
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              ✕ Clear
            </button>
          </div>

          {/* Grouped by category */}
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <span>{CATEGORY_ICON[category] ?? '📌'}</span>
                {category}
                <span className="text-slate-600 font-normal normal-case">({items.length})</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((exam, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-colors flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-white font-bold text-sm leading-snug">{exam.name}</h4>
                        <p className="text-slate-500 text-xs mt-0.5">{exam.body}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[exam.difficulty] ?? 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                        {exam.difficulty}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed">{exam.purpose}</p>

                    <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-800">
                      <span className="text-xs text-slate-500">
                        💰 <span className="text-slate-300">{exam.cost}</span>
                      </span>
                      {exam.link && exam.link.startsWith('http') ? (
                        <a
                          href={exam.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                          Apply / Learn more →
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">{exam.link}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Search again */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-slate-500 text-sm mb-3">Want to search for a different job?</p>
            <button
              onClick={() => { setExams(null); setQuery(''); setSearchedJob('') }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              🔍 New Search
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
