import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export async function POST(req: NextRequest) {
  const { job } = await req.json()
  if (!job || typeof job !== 'string' || job.trim().length < 2) {
    return NextResponse.json({ error: 'Please enter a valid job title.' }, { status: 400 })
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 })
  }

  const prompt = `List the top 8 most important exams/certifications for getting a "${job.trim()}" job.
Return ONLY this JSON (no markdown):
{"exams":[{"name":"","body":"","purpose":"","difficulty":"Beginner|Intermediate|Advanced","cost":"","link":"","category":"Certification|Government Exam|Entrance Test|Placement Test"}]}`

  try {
    const model = genai.getGenerativeModel({
      model: 'gemini-3.8-flash',
      generationConfig: { maxOutputTokens: 1200, temperature: 0.1 },
    })

    // Use streaming so the UI can show a loading state faster
    const stream = await model.generateContentStream(prompt)

    let raw = ''
    for await (const chunk of stream.stream) {
      raw += chunk.text()
    }

    // Aggressively extract JSON from response
    let cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    // Find the first { and last } to extract just the JSON object
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.slice(start, end + 1)
    }

    let exams: any[] = []
    try {
      const parsed = JSON.parse(cleaned)
      exams = Array.isArray(parsed) ? parsed : (parsed.exams ?? Object.values(parsed)[0] ?? [])
    } catch (parseErr: any) {
      console.error('JSON parse error, raw response:', raw)
      return NextResponse.json({ error: 'AI returned invalid response. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ exams })
  } catch (err: any) {
    console.error('Exams API error:', err?.message ?? err)
    const is503 = err?.message?.includes('503') || err?.message?.includes('high demand') || err?.message?.includes('Service Unavailable')
    const msg = is503
      ? 'Our Gemini model is facing high demand spikes. Please try again in a moment.'
      : 'Something went wrong. Please try again.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
