function CounterRow({ label, sub, value, onChange, min = 0, max = 10 }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1 pr-4">
        <div className="font-medium text-gray-800 text-sm">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{sub}</div>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg leading-none disabled:opacity-30 hover:border-primary-400 hover:text-primary-500 active:scale-90 transition-all duration-100"
        >
          −
        </button>
        <span className="w-6 text-center font-bold text-gray-900 text-xl tabular-nums">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg leading-none disabled:opacity-30 hover:border-primary-400 hover:text-primary-500 active:scale-90 transition-all duration-100"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function Step2Dependents({ data, update, onNext, onBack }) {
  const handleDependentsChange = (v) => {
    update('dependents', v)
    if (data.seniorDependents > v) update('seniorDependents', v)
    if (data.youngChildren > v) update('youngChildren', v)
  }

  return (
    <div className="max-w-lg mx-auto px-6 pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">扶養親屬</h2>
      <p className="text-gray-400 text-sm mb-8">不含本人與配偶，填入您申報扶養的親屬</p>

      <div className="bg-white rounded-2xl border border-gray-100 px-5 divide-y divide-gray-50 mb-4">
        <CounterRow
          label="扶養親屬人數"
          sub="父母、子女、兄弟姊妹等（不含配偶）"
          value={data.dependents}
          onChange={handleDependentsChange}
          max={6}
        />
        {data.dependents > 0 && (
          <>
            <CounterRow
              label="其中 70 歲以上長輩"
              sub={`免稅額較高（每人 145,500 元 vs 97,000 元）`}
              value={data.seniorDependents}
              onChange={(v) => update('seniorDependents', Math.min(v, data.dependents))}
              max={data.dependents}
            />
            <CounterRow
              label="其中 5 歲以下幼兒"
              sub="可申報幼兒學前特別扣除額（每人 12 萬元）"
              value={data.youngChildren}
              onChange={(v) => update('youngChildren', Math.min(v, data.dependents))}
              max={data.dependents}
            />
          </>
        )}
      </div>

      {data.dependents === 0 && (
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <p className="text-gray-400 text-xs">
            若無扶養親屬，直接點「下一步」繼續。
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-8">
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
          下一步
        </button>
      </div>
    </div>
  )
}
