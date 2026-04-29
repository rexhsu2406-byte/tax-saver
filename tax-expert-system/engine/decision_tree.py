QUESTION_TREE: dict[str, dict] = {
    "Q1": {
        "text": "你的收入主要來源是什麼？",
        "subtitle": "可能不只一種，請選最主要的",
        "options": {
            "薪資（上班族）": "Q2A",
            "公司營業所得（自己開公司）": "Q2B",
            "股票、基金、不動產等資本利得": "Q2C",
        },
    },
    "Q2A": {
        "text": "除了薪資之外，你有以下情況嗎？",
        "options": {
            "有扶養父母、子女或其他親屬": "Q3A1",
            "有租屋或房貸支出": "Q3A2",
            "公司有給股票選擇權（ESOP）": "Q3A3",
            "以上都沒有": "RESULT_A0",
        },
    },
    "Q3A1": {
        "text": "你扶養的親屬中，有70歲以上（含）的嗎？",
        "options": {
            "有，住在一起": "RESULT_A1_LIVE",
            "有，沒住在一起": "RESULT_A1_SEPARATE",
            "沒有70歲以上的": "RESULT_A1_YOUNG",
        },
    },
    "Q3A2": {
        "text": "你目前的住房狀況是？",
        "options": {
            "租屋，每月付房租": "RESULT_A2_RENT",
            "有房貸，每月繳利息": "RESULT_A2_LOAN",
            "兩者都有": "RESULT_A2_BOTH",
        },
    },
    "Q3A3": {
        "text": "你的股票選擇權目前狀態？",
        "options": {
            "還沒行使，尚未拿到股票": "RESULT_A3_NOT_YET",
            "已行使，手上有股票": "RESULT_A3_HOLD",
        },
    },
    "Q2B": {
        "text": "公司目前的年營業額大概是？",
        "options": {
            "500萬以下（小規模）": "Q3B1",
            "500萬～3000萬": "Q3B2",
            "3000萬以上": "Q3B3",
        },
    },
    "Q3B1": {
        "text": "公司目前有哪些主要支出？",
        "options": {
            "人事費用（員工薪資、自己的薪水）": "RESULT_B1_SALARY",
            "設備、車輛、軟體等採購": "RESULT_B1_ASSET",
            "都有": "RESULT_B1_ALL",
        },
    },
    "Q3B2": {
        "text": "你有把公司獲利以股利形式分給自己嗎？",
        "options": {
            "有，每年都分": "RESULT_B2_DIVIDEND",
            "沒有，留在公司裡": "RESULT_B2_RETAIN",
            "不確定怎麼做比較好": "RESULT_B2_UNSURE",
        },
    },
    "Q3B3": {
        "text": "公司股權目前的狀況？",
        "options": {
            "全部自己持有": "RESULT_B3_SOLO",
            "有家人一起持股": "RESULT_B3_FAMILY",
            "考慮未來傳給下一代": "RESULT_B3_INHERIT",
        },
    },
    "Q2C": {
        "text": "你的資產主要是哪種形式？",
        "options": {
            "股票（上市櫃或未上市）": "Q3C1",
            "不動產（房子、土地）": "Q3C2",
            "現金或存款為主": "Q3C3",
        },
    },
    "Q3C1": {
        "text": "這些股票你打算怎麼處理？",
        "options": {
            "長期持有，不打算賣": "RESULT_C1_HOLD",
            "未來會賣，想規劃節稅": "RESULT_C1_SELL",
            "想傳給下一代": "RESULT_C1_INHERIT",
        },
    },
    "Q3C2": {
        "text": "不動產的用途？",
        "options": {
            "出租收租金": "RESULT_C2_RENT",
            "自住，未來可能出售": "RESULT_C2_SELL",
            "想傳承給子女": "RESULT_C2_INHERIT",
        },
    },
    "Q3C3": {
        "text": "這些資金未來的規劃？",
        "options": {
            "想投資但不確定怎麼節稅": "RESULT_C3_INVEST",
            "想做財富傳承規劃": "RESULT_C3_INHERIT",
        },
    },
}

RESULT_MAP: dict[str, list[str]] = {
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

START_NODE = "Q1"


def get_node(node_id: str) -> dict | None:
    return QUESTION_TREE.get(node_id)


def is_result_node(node_id: str) -> bool:
    return node_id.startswith("RESULT_")


def get_result_strategies(result_id: str) -> list[str]:
    return RESULT_MAP.get(result_id, [])


def count_total_questions() -> int:
    """BFS 求從 START_NODE 到任一結果節點的最大深度（用於進度條）。"""
    visited: set[str] = set()
    max_depth = [0]

    def dfs(node_id: str, depth: int) -> None:
        if is_result_node(node_id):
            max_depth[0] = max(max_depth[0], depth)
            return
        if node_id in visited:
            return
        visited.add(node_id)
        node = QUESTION_TREE.get(node_id)
        if not node:
            return
        for next_id in node["options"].values():
            dfs(next_id, depth + 1)

    dfs(START_NODE, 0)
    return max_depth[0]
