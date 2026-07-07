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
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

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

  function selectQuestion(q: string) {
    setSelectedQuestion(q)
    setAnswer('')
    setEvaluation(null)
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

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-slate-50 py-12 px-4">
      <h1 className="text-3xl font-semibold text-slate-900">
        AI Interview Prep Coach
      </h1>

      <p className="text-slate-600">
        Backend status:{' '}
        <span
          className={
            status === 'ok'
              ? 'text-green-600 font-medium'
              : status === 'error'
                ? 'text-red-600 font-medium'
                : 'text-slate-500'
          }
        >
          {status}
        </span>
      </p>

      <form onSubmit={handleGenerate} className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Software Engineer Intern"
          className="flex-1 border border-slate-300 rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {questions.length > 0 && (
        <ul className="w-full max-w-md space-y-2">
          {questions.map((q, i) => (
            <li
              key={i}
              onClick={() => selectQuestion(q)}
              className={`bg-white border rounded p-3 text-slate-800 cursor-pointer hover:border-slate-400 ${
                selectedQuestion === q ? 'border-slate-900' : 'border-slate-200'
              }`}
            >
              {q}
            </li>
          ))}
        </ul>
      )}

      {selectedQuestion && (
        <form onSubmit={handleEvaluate} className="w-full max-w-md space-y-2">
          <p className="font-medium text-slate-800">{selectedQuestion}</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            rows={5}
            className="w-full border border-slate-300 rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={evaluating}
            className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {evaluating ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </form>
      )}

      {evaluation && (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded p-4 space-y-2">
          <p className="font-semibold text-slate-900">
            Score: {evaluation.score}/10
          </p>
          <p className="text-slate-700">{evaluation.feedback}</p>
        </div>
      )}
    </div>
  )
}

export default App