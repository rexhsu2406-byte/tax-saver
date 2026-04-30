# 台灣節稅專家系統

透過問答方式，依據你的收入來源與財務狀況，推薦最適合的節稅策略。

## 本地執行

```bash
pip install streamlit
streamlit run app.py
```

瀏覽器會自動開啟 `http://localhost:8501`。

## 部署到 Streamlit Cloud（免費公開網址）

1. 將整個 `tax-expert-system/` 資料夾上傳到 GitHub repository
2. 前往 [share.streamlit.io](https://share.streamlit.io) 並登入 GitHub 帳號
3. 點擊 **New app**，選擇你的 GitHub repo
4. **Main file path** 填入 `app.py`（或對應的相對路徑）
5. 點擊 **Deploy**，完成後會得到 `https://xxx.streamlit.app` 公開網址

## 專案結構

```
tax-expert-system/
├── app.py                  # Streamlit 主程式
├── requirements.txt        # 套件依賴
├── engine/
│   └── decision_tree.py   # 問題決策樹與結果對應邏輯
└── knowledge/
    └── strategies.py      # 節稅策略知識庫（29 筆）
```

## 涵蓋策略類型

| 分類 | 適用對象 | 策略數 |
|------|----------|--------|
| 上班族 | 薪資收入、ESOP、扶養 | 10 項 |
| 企業主 | 公司架構、薪資、盈餘規劃 | 10 項 |
| 高資產 | 股票、藝術品、傳承、不動產 | 9 項 |
