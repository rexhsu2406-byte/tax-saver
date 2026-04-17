const STYLES = {
  success: {
    wrap: 'bg-emerald-50 border-emerald-100',
    icon: '✅',
    title: 'text-emerald-800',
    body: 'text-emerald-700',
  },
  info: {
    wrap: 'bg-blue-50 border-blue-100',
    icon: '💡',
    title: 'text-blue-800',
    body: 'text-blue-700',
  },
  warning: {
    wrap: 'bg-amber-50 border-amber-100',
    icon: '⚠️',
    title: 'text-amber-800',
    body: 'text-amber-700',
  },
}

export default function TipList({ tips }) {
  return (
    <div className="space-y-3">
      {tips.map((tip, i) => {
        const s = STYLES[tip.type] ?? STYLES.info
        return (
          <div
            key={i}
            className={`rounded-2xl p-4 border ${s.wrap} animate-fade-in-up`}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
              <div>
                <div className={`font-semibold text-sm mb-1 ${s.title}`}>{tip.title}</div>
                <div className={`text-sm leading-relaxed ${s.body}`}>{tip.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
