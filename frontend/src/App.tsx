import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function App() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking')

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
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
    </div>
  )
}

export default App
