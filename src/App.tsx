import { Scene } from './components/Scene'
import './App.css'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function App() {
  useEffect(() => {
    // Force a re-render after initial mount
    const root = document.getElementById('root')
    if (root) {
      root.style.display = 'none'
      root.offsetHeight // Force reflow
      root.style.display = ''
    }
  }, [])

  return (
    <div className="app" style={{ background: '#000000' }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading...</div>}>
          <Scene />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App 