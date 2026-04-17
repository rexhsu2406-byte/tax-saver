import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import StepForm from './components/StepForm.jsx'

export default function App() {
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen">
      {started ? (
        <StepForm onReset={() => setStarted(false)} />
      ) : (
        <LandingPage onStart={() => setStarted(true)} />
      )}
    </div>
  )
}
