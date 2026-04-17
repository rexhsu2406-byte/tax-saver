import { useState } from 'react'

function CurrencyInput({ label, hint, value, onChange }) {
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')

  const handleFocus = () => {
    setFocused(true)
    setRaw(value !== '' ? String(value) : '')
  }

  const handleChange = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    setRaw(digits)
    onChange(digits ? parseInt(digits, 10) : '')
  }

  const handleBlur = () => setFocused(false)

  const displayVal = focused
    ? raw
    : value !== '' && value !== 0
      ? Number(value).toLocaleString('zh-TW')
      : ''

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <div
        className={`flex items-center border rounded-xl overflow-hidden transition-all duration-150 ${
          focused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200'
        } bg-white`}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="flex-1 px-4 py-3.5 text-gray-900 text-base outline-none bg-transparent min-w-0"
          placeholder="0"
          value={displayVal}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className="px-4 text-gray-400 text-sm font-medium border-l border-gray-100 py-3.5 bg-gray-50 flex-shrink-0">
          元
        </span>
      </div>
    </div>
  )
}

const MARITAL_OPTIONS = [
  { value: false, label: '單身', sub: '未婚或單獨申報' },
  { value: true,  label: '已婚合併申報', sub: '配偶所得一併計入' },
]

export default function Step1Basic({ data, update, onNext }) {
  const salary = typeof data.salary === 'number' ? data.salary : parseInt(data.salary) || 0
  const canNext = salary > 0

  return (
    <div className="max-w-lg mx-auto px-6 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">基本資料</h2>
      <p className="text-gray-400 text-sm mb-8">填寫您的年度薪資與婚姻狀況</p>

      <div className="space-y-7">
        <CurrencyInput
          label="全年薪資收入"
          hint="填入全年稅前薪資總額，可參考綜合所得稅扣繳憑單"
          value={data.salary}
          onChange={(v) => update('salary', v)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">婚姻狀況</label>
          <div className="grid grid-cols-2 gap-3">
            {MARITAL_OPTIONS.map((opt) => {
              const selected = data.married === opt.value
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => update('married', opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    selected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`font-semibold text-sm ${selected ? 'text-primary-700' : 'text-gray-800'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canNext}
        className={`w-full mt-10 py-4 rounded-2xl font-semibold text-base transition-all duration-150 ${
          canNext
            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        下一步
      </button>

      {!canNext && (
        <p className="text-center text-xs text-gray-400 mt-3">請先填入薪資收入才能繼續</p>
      )}
    </div>
  )
}
