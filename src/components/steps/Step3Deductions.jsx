import { useState } from 'react'

function CurrencyField({ label, hint, capLabel, value, onChange }) {
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
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {capLabel && (
          <span className="text-xs text-gray-400">{capLabel}</span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mb-2 leading-relaxed">{hint}</p>}
      <div
        className={`flex items-center border rounded-xl overflow-hidden transition-all duration-150 ${
          focused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200'
        } bg-white`}
      >
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="flex-1 px-4 py-3 text-gray-900 text-sm outline-none bg-transparent min-w-0"
          placeholder="0（可不填）"
          value={displayVal}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className="px-3 text-gray-400 text-xs font-medium border-l border-gray-100 py-3 bg-gray-50 flex-shrink-0">
          元
        </span>
      </div>
    </div>
  )
}

export default function Step3Deductions({ data, update, onNext, onBack }) {
  return (
    <div className="max-w-lg mx-auto px-6 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">列舉扣除支出</h2>

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-7">
        <p className="text-primary-700 text-sm leading-relaxed">
          <strong>💡 選填：</strong>以下欄位可以不填，系統會自動比較標準扣除與列舉扣除哪個划算，幫您選最有利的方式。
        </p>
      </div>

      <div className="space-y-5">
        <CurrencyField
          label="人身保險費合計"
          hint="壽險、醫療險、意外險等（不含健保費）"
          capLabel="每人上限 24,000 元"
          value={data.insurance}
          onChange={(v) => update('insurance', v)}
        />
        <CurrencyField
          label="醫藥及生育費"
          hint="就醫費用、手術費、生育費等（無上限）"
          value={data.medical}
          onChange={(v) => update('medical', v)}
        />
        <CurrencyField
          label="租屋支出"
          hint="租屋費用（自用，非營業用途）"
          capLabel="上限 180,000 元"
          value={data.rent}
          onChange={(v) => update('rent', v)}
        />
        <CurrencyField
          label="房貸利息（自住）"
          hint="自用住宅購屋借款利息，不含本金"
          capLabel="上限 300,000 元"
          value={data.mortgage}
          onChange={(v) => update('mortgage', v)}
        />
        <CurrencyField
          label="捐贈金額"
          hint="對政府機關或立案公益機構之捐贈"
          capLabel="上限所得 20%"
          value={data.donation}
          onChange={(v) => update('donation', v)}
        />
        <CurrencyField
          label="儲蓄投資利息收入"
          hint="銀行存款利息、債券利息等"
          capLabel="上限 270,000 元"
          value={data.savingsInterest}
          onChange={(v) => update('savingsInterest', v)}
        />
      </div>

      <div className="flex gap-3 mt-10">
        <button
          onClick={onBack}
          className="w-28 py-4 rounded-2xl font-semibold text-base border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
        >
          上一步
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl font-semibold text-base bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 active:scale-95 transition-all duration-150"
        >
          計算結果 →
        </button>
      </div>
    </div>
  )
}
