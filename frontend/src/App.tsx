import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type Evaluation = {
  score: number
  feedback: string
}

function App() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  const [role, setRole] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  // Derived: which step are we on?
  const step = evaluation ? 4 : selectedQuestion ? 3 : questions.length > 0 ? 2 : 1

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setQuestions([])
    setSelectedQuestion(null)
    setEvaluation(null)

    try {
      const res = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      setQuestions(data.questions)
    } catch (err) {
      setError('Something went wrong. Check the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function selectQuestion(q: string, i: number) {
    setSelectedQuestion(q)
    setSelectedIndex(i)
    setAnswer('')
    setEvaluation(null)
  }

  function backToQuestions() {
    setSelectedQuestion(null)
    setSelectedIndex(null)
    setAnswer('')
    setEvaluation(null)
  }

  function startOver() {
    setRole('')
    setQuestions([])
    setSelectedQuestion(null)
    setSelectedIndex(null)
    setAnswer('')
    setEvaluation(null)
    setError('')
  }

  async function handleEvaluate(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedQuestion) return

    setEvaluating(true)
    setEvaluation(null)

    try {
      const res = await fetch(`${API_BASE_URL}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: selectedQuestion, answer }),
      })

      if (!res.ok) throw new Error('Request failed')

      const data = await res.json()
      setEvaluation(data)
    } catch (err) {
      setError('Something went wrong evaluating your answer.')
    } finally {
      setEvaluating(false)
    }
  }

  const scoreColor =
    evaluation && evaluation.score >= 7
      ? 'text-sage border-sage'
      : evaluation && evaluation.score >= 4
        ? 'text-gold border-gold'
        : 'text-rust border-rust'

  const steps = [
    { n: 1, label: 'Choose a role' },
    { n: 2, label: 'Pick a question' },
    { n: 3, label: 'Write your answer' },
    { n: 4, label: 'Get feedback' },
  ]

  return (
    <div className="min-h-screen bg-ink text-parchment">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase mb-3">
            AI Interview Coach
          </p>
          <h1 className="font-display text-5xl font-semibold text-parchment leading-tight">
            Ready when you are.
          </h1>
          <p className="mt-3 text-parchment/60 font-body">
            Pick a role, answer a question, get real feedback.{' '}
            <span
              className={
                status === 'ok'
                  ? 'text-sage'
                  : status === 'error'
                    ? 'text-rust'
                    : 'text-parchment/40'
              }
            >
              ● {status === 'ok' ? 'connected' : status === 'error' ? 'offline' : 'checking'}
            </span>
          </p>
        </div>

        {/* Step tracker */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 transition-colors ${
                    step > s.n
                      ? 'bg-sage text-ink'
                      : step === s.n
                        ? 'bg-gold text-ink'
                        : 'bg-parchment/10 text-parchment/40'
                  }`}
                >
                  {step > s.n ? '✓' : s.n}
                </div>
                <span
                  className={`text-xs font-body hidden sm:inline ${
                    step === s.n ? 'text-parchment' : 'text-parchment/40'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px flex-1 transition-colors ${
                    step > s.n ? 'bg-sage' : 'bg-parchment/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Role input */}
        <form onSubmit={handleGenerate} className="mb-4">
          <p className="text-xs font-mono text-parchment/50 uppercase tracking-wider mb-2">
            Step 1 — What role are you prepping for?
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer Intern"
              className="flex-1 bg-transparent border-b-2 border-parchment/30 focus:border-gold outline-none px-1 py-2 font-body text-parchment placeholder:text-parchment/40 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading || role.trim().length === 0}
              className="bg-gold text-ink font-body font-semibold px-5 py-2 rounded-sm hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </form>

        {error && <p className="text-rust mb-6 font-body text-sm">{error}</p>}

        {/* Empty state hint before first generate */}
        {questions.length === 0 && !loading && (
          <p className="text-parchment/40 font-body text-sm mb-10">
            Type a job title above and hit Generate — you'll get 5 tailored interview questions to practice with.
          </p>
        )}

        {/* Step 2: Question cards */}
        {questions.length > 0 && !selectedQuestion && (
          <div className="mb-10">
            <p className="text-xs font-mono text-parchment/50 uppercase tracking-wider mb-3">
              Step 2 — Click a question to answer it
            </p>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={i}
                  onClick={() => selectQuestion(q, i)}
                  className="relative bg-parchment text-ink rounded-sm p-5 pl-14 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="absolute left-5 top-5 font-mono text-xs text-ink/40">
                    Q{i + 1}
                  </span>
                  <p className="font-body leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Answer form */}
        {selectedQuestion && !evaluation && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono text-parchment/50 uppercase tracking-wider">
                Step 3 — Write your answer
              </p>
              <button
                onClick={backToQuestions}
                className="text-xs font-body text-parchment/50 hover:text-gold transition-colors"
              >
                ← back to questions
              </button>
            </div>
            <form onSubmit={handleEvaluate} className="bg-parchment text-ink rounded-sm p-5 space-y-3">
              <p className="font-display text-lg font-semibold">
                <span className="text-ink/40 font-mono text-sm mr-2">
                  Q{selectedIndex !== null ? selectedIndex + 1 : ''}
                </span>
                {selectedQuestion}
              </p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer as if you were in the interview…"
                rows={6}
                autoFocus
                className="w-full bg-ink/5 border border-ink/15 focus:border-gold outline-none rounded-sm px-3 py-2 font-body text-ink placeholder:text-ink/40 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={evaluating || answer.trim().length === 0}
                className="bg-ink text-parchment font-body font-semibold px-5 py-2 rounded-sm hover:bg-ink/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {evaluating ? 'Evaluating…' : 'Submit Answer'}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Evaluation result */}
        {evaluation && (
          <div className="mb-8">
            <p className="text-xs font-mono text-parchment/50 uppercase tracking-wider mb-3">
              Step 4 — Your feedback
            </p>
            <div className="bg-parchment text-ink rounded-sm p-6 flex gap-5 items-start">
              <div
                className={`shrink-0 w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono font-semibold text-lg ${scoreColor}`}
              >
                {evaluation.score}/10
              </div>
              <p className="font-body leading-relaxed text-ink/85">{evaluation.feedback}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={backToQuestions}
                className="text-sm font-body text-parchment/60 hover:text-gold transition-colors"
              >
                ← try another question
              </button>
              <button
                onClick={startOver}
                className="text-sm font-body text-parchment/60 hover:text-gold transition-colors"
              >
                start over with a new role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App