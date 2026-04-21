import { useState, useEffect } from 'react'
import { getHealthCheck } from './services/healthCheckService'

function App() {
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealthCheck = async () => {
      try {
        const data = await getHealthCheck()
        setApiStatus(data)
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching API')
      } finally {
        setLoading(false)
      }
    }

    fetchHealthCheck()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-white text-center tracking-tight">
            BlindBag Frontend
          </h1>
          <p className="text-blue-100 text-center mt-2 font-medium">React + Vite + Tailwind</p>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">API Connection</h2>
            {loading ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            ) : error ? (
              <span className="flex h-3 w-3 relative">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            ) : (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
            {loading ? (
              <div className="text-gray-500 flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to Backend...
              </div>
            ) : error ? (
              <div className="text-red-500 font-medium">
                <span className="block mb-1 text-sm font-semibold uppercase tracking-wider text-red-600">Error Details:</span>
                {error}
              </div>
            ) : (
              <div className="text-green-600 font-medium whitespace-pre-wrap font-mono text-sm">
                {JSON.stringify(apiStatus, null, 2)}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            Edit <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">src/App.tsx</code> to test HMR
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
