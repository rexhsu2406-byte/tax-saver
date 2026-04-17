const features = [
  {
    icon: '✨',
    title: '操作簡單',
    desc: '不需懂稅務知識，用日常語言回答問題，3 分鐘完成試算。',
  },
  {
    icon: '💡',
    title: '個人化建議',
    desc: '不只算稅額，還根據你的狀況告訴你該怎麼省錢、能省多少。',
  },
  {
    icon: '📋',
    title: '最新稅法',
    desc: '依據財政部 2024 年度最新規定，稅率級距與扣除額皆已更新。',
  },
]

export default function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
            稅
          </div>
          <span className="text-xl font-bold text-gray-800">稅省小幫手</span>
        </div>
      </header>

      <main className="px-6 pt-8 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 text-sm font-medium px-4 py-1.5 rounded-full mb-5 border border-primary-100">
              2024 年度報稅試算
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              5 分鐘找出你的
              <br />
              <span className="text-primary-500">最佳節稅方案</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              台灣上班族專屬・輸入基本資料
              <br />
              系統自動計算並給出個人化節稅建議
            </p>
            <button
              onClick={onStart}
              className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-10 py-4 rounded-2xl text-lg shadow-lg shadow-primary-500/25 transition-all duration-150 active:scale-95"
            >
              開始免費試算 →
            </button>
            <p className="text-gray-400 text-sm mt-3">完全免費・不需註冊・資料不離開裝置</p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 mb-10">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs leading-relaxed">
            本工具提供試算參考，實際申報結果請依財政部規定為準。
            <br />
            所有計算於您的裝置本地完成，不儲存任何個人資料。
          </p>
        </div>
      </main>
    </div>
  )
}
