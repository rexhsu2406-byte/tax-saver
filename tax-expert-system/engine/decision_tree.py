# engine/decision_tree.py - 問題決策樹邏輯

QUESTION_TREE = {
    "Q1": {
        "text": "你的收入主要來源是什麼？",
        "subtitle": "可能不只一種，請選最主要的",
        "options": {
            "薪資（上班族）": "Q2A",
            "公司營業所得（自己開公司）": "Q2B",
            "股票、基金、不動產等資本利得": "Q2C",
        }
    },
    "Q2A": {
        "text": "除了薪資之外，你有以下情況嗎？",
        "subtitle": "",
        "options": {
            "有扶養父母、子女或其他親屬": "Q3A1",
            "有租屋或房貸支出": "Q3A2",
            "公司有給股票選擇權（ESOP）": "Q3A3",
            "以上都沒有": "RESULT_A0",
        }
    },
    "Q3A1": {
        "text": "你扶養的親屬中，有70歲以上（含）的嗎？",
        "subtitle": "",
        "options": {
            "有，住在一起": "RESULT_A1_LIVE",
            "有，沒住在一起": "RESULT_A1_SEPARATE",
            "沒有70歲以上的": "RESULT_A1_YOUNG",
        }
    },
    "Q3A2": {
        "text": "你目前的住房狀況是？",
        "subtitle": "",
        "options": {
            "租屋，每月付房租": "RESULT_A2_RENT",
            "有房貸，每月繳利息": "RESULT_A2_LOAN",
            "兩者都有": "RESULT_A2_BOTH",
        }
    },
    "Q3A3": {
        "text": "你的股票選擇權目前狀態？",
        "subtitle": "",
        "options": {
            "還沒行使，尚未拿到股票": "RESULT_A3_NOT_YET",
            "已行使，手上有股票": "RESULT_A3_HOLD",
        }
    },
    "Q2B": {
        "text": "公司目前的年營業額大概是？",
        "subtitle": "",
        "options": {
            "500萬以下（小規模）": "Q3B1",
            "500萬～3000萬": "Q3B2",
            "3000萬以上": "Q3B3",
        }
    },
    "Q3B1": {
        "text": "公司目前有哪些主要支出？",
        "subtitle": "",
        "options": {
            "人事費用（員工薪資、自己的薪水）": "RESULT_B1_SALARY",
            "設備、車輛、軟體等採購": "RESULT_B1_ASSET",
            "都有": "RESULT_B1_ALL",
        }
    },
    "Q3B2": {
        "text": "你有把公司獲利以股利形式分給自己嗎？",
        "subtitle": "",
        "options": {
            "有，每年都分": "RESULT_B2_DIVIDEND",
            "沒有，留在公司裡": "RESULT_B2_RETAIN",
            "不確定怎麼做比較好": "RESULT_B2_UNSURE",
        }
    },
    "Q3B3": {
        "text": "公司股權目前的狀況？",
        "subtitle": "",
        "options": {
            "全部自己持有": "RESULT_B3_SOLO",
            "有家人一起持股": "RESULT_B3_FAMILY",
            "考慮未來傳給下一代": "RESULT_B3_INHERIT",
        }
    },
    "Q2C": {
        "text": "你的資產主要是哪種形式？",
        "subtitle": "",
        "options": {
            "股票（上市櫃或未上市）": "Q3C1",
            "不動產（房子、土地）": "Q3C2",
            "現金或存款為主": "Q3C3",
        }
    },
    "Q3C1": {
        "text": "這些股票你打算怎麼處理？",
        "subtitle": "",
        "options": {
            "長期持有，不打算賣": "RESULT_C1_HOLD",
            "未來會賣，想規劃節稅": "RESULT_C1_SELL",
            "想傳給下一代": "RESULT_C1_INHERIT",
        }
    },
    "Q3C2": {
        "text": "不動產的用途？",
        "subtitle": "",
        "options": {
            "出租收租金": "RESULT_C2_RENT",
            "自住，未來可能出售": "RESULT_C2_SELL",
            "想傳承給子女": "RESULT_C2_INHERIT",
        }
    },
    "Q3C3": {
        "text": "這些資金未來的規劃？",
        "subtitle": "",
        "options": {
            "想投資但不確定怎麼節稅": "RESULT_C3_INVEST",
            "想做財富傳承規劃": "RESULT_C3_INHERIT",
        }
    },
}

RESULT_MAP = {
    "RESULT_A0":          ["standard_deduction_compare", "salary_basic"],
    "RESULT_A1_LIVE":     ["dependent_deduction", "elder_live_in", "standard_deduction_compare"],
    "RESULT_A1_SEPARATE": ["dependent_deduction", "elder_separate", "standard_deduction_compare"],
    "RESULT_A1_YOUNG":    ["dependent_deduction", "standard_deduction_compare"],
    "RESULT_A2_RENT":     ["rent_deduction", "standard_deduction_compare"],
    "RESULT_A2_LOAN":     ["mortgage_interest", "standard_deduction_compare"],
    "RESULT_A2_BOTH":     ["rent_deduction", "mortgage_interest", "standard_deduction_compare"],
    "RESULT_A3_NOT_YET":  ["esop_defer", "esop_timing"],
    "RESULT_A3_HOLD":     ["esop_hold", "unrealized_gain"],
    "RESULT_B1_SALARY":   ["salary_expense", "owner_salary"],
    "RESULT_B1_ASSET":    ["asset_depreciation", "expense_maximize"],
    "RESULT_B1_ALL":      ["salary_expense", "owner_salary", "asset_depreciation", "expense_maximize"],
    "RESULT_B2_DIVIDEND": ["dividend_vs_retain", "personal_vs_corp_tax"],
    "RESULT_B2_RETAIN":   ["retained_earnings", "dividend_vs_retain"],
    "RESULT_B2_UNSURE":   ["personal_vs_corp_tax", "dividend_vs_retain", "retained_earnings"],
    "RESULT_B3_SOLO":     ["family_company", "personal_vs_corp_tax"],
    "RESULT_B3_FAMILY":   ["family_company", "family_salary"],
    "RESULT_B3_INHERIT":  ["family_company", "trust_business", "gift_plan"],
    "RESULT_C1_HOLD":     ["unrealized_gain", "stock_pledge"],
    "RESULT_C1_SELL":     ["unrealized_gain", "art_investment", "charity_donate"],
    "RESULT_C1_INHERIT":  ["gift_plan", "trust_wealth", "charity_donate"],
    "RESULT_C2_RENT":     ["rental_expense", "rental_tax_optimize"],
    "RESULT_C2_SELL":     ["land_value_tax", "gift_plan"],
    "RESULT_C2_INHERIT":  ["gift_plan", "trust_wealth", "land_value_tax"],
    "RESULT_C3_INVEST":   ["art_investment", "unrealized_gain", "stock_pledge"],
    "RESULT_C3_INHERIT":  ["trust_wealth", "gift_plan", "charity_donate"],
}


def get_next_question(current_q, answer):
    """根據目前題目和答案，回傳下一題的 key"""
    if current_q not in QUESTION_TREE:
        return None
    return QUESTION_TREE[current_q]["options"].get(answer)


def is_result(key):
    """判斷是否為結果節點（非問題節點）"""
    return key.startswith("RESULT_")


def get_strategies(result_id):
    """根據結果 id 取得對應的策略 id 清單"""
    return RESULT_MAP.get(result_id, [])
