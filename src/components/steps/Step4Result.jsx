import MetricCard from '../MetricCard.jsx'
import TipList from '../TipList.jsx'
import { formatNumber, generateTips } from '../../utils/taxCalculator.js'

function taxRateLabel(rate) {
  if (rate >= 0.40) return '高稅率，節稅空間大'
  if (rate >= 0.30) return '高稅率，節稅空間大'
  if (rate >= 0.20) return '中高稅率'
  if (rate >= 0.12) return '中等稅率'
  return '低稅率'
}

export default function Step4Result({ result, onReset, onBack }) {
  const tips = generateTips(result)

  const handleShare = async () => {
    const text = [
      '【稅省小幫手試算結果】',
      `全年薪資：${formatNumber(result.salary)} 元`,
      `估算應繳稅額：${formatNumber(result.estimatedTax)} 元`,
      `所得淨額：${formatNumber(result.netIncome)} 元`,
      `建議扣除方式：${result.useItemized ? '列舉扣除' : '標準扣除'}`,
      `（節省 ${formatNumber(result.deductionSavings)} 元）`,
    ].join('\n')

    if (navigator.share) {
      try { await navigator.share({ title: '稅省小幫手', text }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
        alert('試算結果已複製到剪貼簿！')
      } catch {
        alert('請手動複製結果')
      }
    }
  }

  // Build breakdown rows for the deduction table
  const rows = [
    { label: '薪資收入',         value: result.salary,               type: 'income' },
    { label: '免稅額',           value: result.totalExemption,       type: 'deduct',
      note: `${result.totalPeople} 人` },
    {
      label: result.useItemized ? '列舉扣除額' : '標準扣除額',
      value: result.chosenDeduction,
      type: 'deduct',
      badge: result.useItemized ? '列舉' : '標準',
    },
    { label: '薪資特別扣除額',   value: result.salarySpecialDeduction, type: 'deduct' },
    result.savingsDeduction > 0 && {
      label: '儲蓄投資特別扣除額', value: result.savingsDeduction, type: 'deduct',
    },
    result.basicLivingDiff > 0 && {
      label: '基本生活費差額', value: result.basicLivingDiff, type: 'deduct',
      note: '自動計入',
    },
    { label: '所得淨額',         value: result.netIncome,            type: 'result' },
  ].filter(Boolean)

  // Itemized breakdown items
  const itemizedItems = [
    result.effectiveInsurance > 0 && { label: '人身保險費',     value: result.effectiveInsurance },
    result.effectiveMedical   > 0 && { label: '醫藥及生育費',   value: result.effectiveMedical },
    result.effectiveRent      > 0 && { label: '房屋租金',       value: result.effectiveRent },
    result.effectiveMortgage  > 0 && { label: '房貸利息',       value: result.effectiveMortgage },
    result.effectiveDonation  > 0 && { label: '捐贈',           value: result.effectiveDonation },
  ].filter(Boolean)

  return (
    <div className="max-w-lg mx-auto px-6 pt-8">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">🎉</span>
        <h2 className="text-2xl font-bold text-gray-900">試算結果</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6">以下為 2024 年度預估，僅供參考</p>

      {/* Metric cards — 2×2 layout */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="col-span-2">
          <MetricCard
            label="估算應繳稅額"
            value={`${formatNumber(result.estimatedTax)} 元`}
            sub={`稅率 ${result.taxRate * 100}%・${taxRateLabel(result.taxRate)}`}
            highlight
            icon="💰"
          />
        </div>
        <MetricCard
          label="所得淨額"
          value={`${formatNumber(result.netIncome)} 元`}
          icon="📊"
        />
        <MetricCard
          label="建議扣除方式"
          value={result.useItemized ? '列舉扣除' : '標準扣除'}
          sub={`另一方案差 ${formatNumber(result.deductionSavings)} 元`}
          icon={result.useItemized ? '📝' : '📋'}
        />
        <div className="col-span-2">
          <MetricCard
            label="與另一扣除方式相比節省"
            value={`${formatNumber(result.deductionSavings)} 元`}
            sub={result.useItemized ? '列舉 vs 標準' : '標準 vs 列舉'}
            icon="💵"
          />
        </div>
      </div>

      {/* Deduction breakdown table */}
      <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">計算明細</h3>
        <div className="space-y-0 divide-y divide-gray-50">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2.5 ${
                row.type === 'result' ? 'border-t-2 border-gray-200 mt-1 pt-3' : ''
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-sm ${row.type === 'result' ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                  {row.label}
                </span>
                {row.badge && (
                  <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                    {row.badge}採用
                  </span>
                )}
                {row.note && (
                  <span className="text-xs text-gray-400 flex-shrink-0">{row.note}</span>
                )}
              </div>
              <span
                className={`text-sm font-medium tabular-nums flex-shrink-0 ml-2 ${
                  row.type === 'income'
                    ? 'text-gray-900'
                    : row.type === 'result'
                      ? 'text-primary-600 font-semibold'
                      : 'text-red-500'
                }`}
              >
                {row.type === 'income' ? '' : '−'}{formatNumber(row.value)} 元
              </span>
            </div>
          ))}
        </div>

        {/* Unused deduction comparison note */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {result.useItemized ? '標準扣除額' : '列舉扣除額'}（未採用）
              ＝ {formatNumber(result.useItemized ? result.standardDeduction : result.itemizedDeduction)} 元
            </span>
            <span>差 {formatNumber(result.deductionSavings)} 元</span>
          </div>
        </div>
      </div>

      {/* Itemized detail (only if itemized was chosen and has items) */}
      {result.useItemized && itemizedItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm">列舉扣除額明細</h3>
          <div className="divide-y divide-gray-50">
            {itemizedItems.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-800 tabular-nums">
                  {formatNumber(item.value)} 元
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200 mt-1">
            <span className="text-sm font-semibold text-gray-800">合計</span>
            <span className="text-sm font-semibold text-primary-600 tabular-nums">
              {formatNumber(result.itemizedDeduction)} 元
            </span>
          </div>
        </div>
      )}

      {/* Personalised tips */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">個人化節稅建議</h3>
        <TipList tips={tips} />
      </div>

      {/* Disclaimer */}
      <p className="text-gray-400 text-xs text-center leading-relaxed mb-6">
        本試算結果僅供參考，實際稅額請依財政部官方申報結果為準。
        <br />
        2024 年度綜合所得稅申報期間為 2025 年 5 月。
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-4 rounded-2xl font-semibold text-base border-2 border-gray-200 text-gray-600 hover:border-gray-300 active:scale-95 transition-all duration-150"
        >
          重新試算
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-4 rounded-2xl font-semibold text-base bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 active:scale-95 transition-all duration-150"
        >
          分享結果 ↗
        </button>
      </div>
    </div>
  )
}
