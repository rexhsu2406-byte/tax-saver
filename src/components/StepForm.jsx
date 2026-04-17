import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import Step1Basic from './steps/Step1Basic.jsx'
import Step2Dependents from './steps/Step2Dependents.jsx'
import Step3Deductions from './steps/Step3Deductions.jsx'
import Step4Result from './steps/Step4Result.jsx'
import { calculateTax } from '../utils/taxCalculator.js'

const INITIAL = {
  salary: '',
  married: false,
  dependents: 0,
  seniorDependents: 0,
  youngChildren: 0,
  insurance: '',
  medical: '',
  rent: '',
  mortgage: '',
  donation: '',
  savingsInterest: '',
}

function parseNum(val) {
  return Number(String(val).replace(/,/g, '')) || 0
}

export default function StepForm({ onReset }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('forward')
  const [form, setForm] = useState(INITIAL)
  const [result, setResult] = useState(null)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const goNext = () => {
    setDirection('forward')
    if (step === 3) {
      setResult(calculateTax({
        ...form,
        salary:        parseNum(form.salary),
        insurance:     parseNum(form.insurance),
        medical:       parseNum(form.medical),
        rent:          parseNum(form.rent),
        mortgage:      parseNum(form.mortgage),
        donation:      parseNum(form.donation),
        savingsInterest: parseNum(form.savingsInterest),
      }))
    }
    setStep(s => s + 1)
  }

  const goBack = () => {
    setDirection('back')
    setStep(s => s - 1)
  }

  const animClass = direction === 'forward' ? 'step-enter' : 'step-enter-back'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-6 py-3 flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -ml-1 rounded-lg"
            aria-label="返回首頁"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
              稅
            </div>
            <span className="font-semibold text-gray-800">稅省小幫手</span>
          </div>
        </div>
        <ProgressBar current={step} total={4} />
      </div>

      {/* Step content with slide animation */}
      <div key={step} className={`${animClass} pb-10`}>
        {step === 1 && <Step1Basic data={form} update={update} onNext={goNext} />}
        {step === 2 && <Step2Dependents data={form} update={update} onNext={goNext} onBack={goBack} />}
        {step === 3 && <Step3Deductions data={form} update={update} onNext={goNext} onBack={goBack} />}
        {step === 4 && result && <Step4Result result={result} onReset={onReset} onBack={goBack} />}
      </div>
    </div>
  )
}
