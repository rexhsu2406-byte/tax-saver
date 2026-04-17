const STEP_LABELS = ['基本資料', '扶養親屬', '列舉支出', '試算結果']

export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100

  return (
    <div className="px-6 py-3">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">步驟 {current} / {total}</span>
          <span className="text-xs font-medium text-primary-600">{STEP_LABELS[current - 1]}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
