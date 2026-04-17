export default function MetricCard({ label, value, sub, highlight, icon }) {
  return (
    <div
      className={`rounded-2xl p-4 h-full ${
        highlight
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-medium ${highlight ? 'text-primary-100' : 'text-gray-400'}`}>
          {label}
        </span>
        {icon && <span className="text-base leading-none">{icon}</span>}
      </div>
      <div className={`text-lg font-bold leading-snug ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
      {sub && (
        <div className={`text-xs mt-1.5 ${highlight ? 'text-primary-100' : 'text-gray-400'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}
