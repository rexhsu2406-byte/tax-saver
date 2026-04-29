# 決策樹定義
# 每個節點結構：
#   "id"       : 唯一識別碼
#   "question" : 顯示給使用者的問題
#   "hint"     : 補充說明（可選）
#   "options"  : list of {"label": str, "next": str}
#                next 可指向另一個節點 id 或以 "result:" 開頭的結果集
#
# 葉節點（結果）以 id 前綴 "result:" 表示，
# value 為 strategy id 的 list，從 knowledge/strategies.py 取得

TREE: dict[str, dict] = {
    # ── 起點 ──────────────────────────────────────────────────
    "start": {
        "question": "您目前的主要收入來源是？",
        "hint": "請選擇最符合您現況的選項",
        "options": [
            {"label": "受薪員工（有固定雇主）", "next": "salary_income_level"},
            {"label": "自雇 / 自由業 / 接案", "next": "self_employed_type"},
            {"label": "退休 / 無工作收入", "next": "retiree_assets"},
        ],
    },

    # ── 受薪員工路線 ──────────────────────────────────────────
    "salary_income_level": {
        "question": "您的年度薪資所得大約是？",
        "hint": "以去年度實際收入為準",
        "options": [
            {"label": "50 萬元以下", "next": "salary_low_deduction"},
            {"label": "50～120 萬元", "next": "salary_mid_deduction"},
            {"label": "120 萬元以上", "next": "salary_high_deduction"},
        ],
    },
    "salary_low_deduction": {
        "question": "您目前有以下哪些支出？（請選最主要的一項）",
        "hint": "選擇後我們將推薦最適合的扣除策略",
        "options": [
            {"label": "有繳納人身保險費", "next": "salary_low_has_loan"},
            {"label": "有租屋（無自有房屋）", "next": "result:salary_low_rent"},
            {"label": "有醫療或生育相關費用", "next": "result:salary_low_medical"},
            {"label": "以上皆無", "next": "result:salary_low_basic"},
        ],
    },
    "salary_low_has_loan": {
        "question": "您有購屋房貸（自用住宅）嗎？",
        "options": [
            {"label": "有購屋房貸", "next": "result:salary_low_loan"},
            {"label": "沒有房貸", "next": "result:salary_low_insurance"},
        ],
    },
    "salary_mid_deduction": {
        "question": "您家中有以下哪些情況？（請選最主要的一項）",
        "options": [
            {"label": "有就讀大學以上的子女", "next": "salary_mid_has_loan"},
            {"label": "有購屋房貸（自用住宅）", "next": "result:salary_mid_loan"},
            {"label": "有大額捐贈計畫", "next": "result:salary_mid_donation"},
            {"label": "以上皆無", "next": "result:salary_mid_basic"},
        ],
    },
    "salary_mid_has_loan": {
        "question": "您同時有購屋房貸嗎？",
        "options": [
            {"label": "有購屋房貸", "next": "result:salary_mid_edu_loan"},
            {"label": "沒有房貸", "next": "result:salary_mid_edu"},
        ],
    },
    "salary_high_deduction": {
        "question": "您有投資股票或基金並領取股利嗎？",
        "options": [
            {"label": "有，且股利所得較多", "next": "salary_high_dividend"},
            {"label": "有，但股利所得不多", "next": "salary_high_no_dividend"},
            {"label": "沒有投資股票", "next": "salary_high_no_dividend"},
        ],
    },
    "salary_high_dividend": {
        "question": "您名下有自用住宅房貸或計畫捐贈公益嗎？",
        "options": [
            {"label": "有購屋房貸", "next": "result:salary_high_dividend_loan"},
            {"label": "有捐贈計畫", "next": "result:salary_high_dividend_donation"},
            {"label": "皆無", "next": "result:salary_high_dividend_basic"},
        ],
    },
    "salary_high_no_dividend": {
        "question": "您或家人有身心障礙或重大傷病情況嗎？",
        "options": [
            {"label": "有", "next": "result:salary_high_disability"},
            {"label": "沒有", "next": "result:salary_high_basic"},
        ],
    },

    # ── 自雇路線 ─────────────────────────────────────────────
    "self_employed_type": {
        "question": "您的自雇型態屬於？",
        "options": [
            {"label": "執行業務者（醫師、律師、顧問等）", "next": "self_exec_expense"},
            {"label": "接案 / 斜槓副業（非主要業務）", "next": "self_side_income"},
            {"label": "經營商業（有開立公司或行號）", "next": "result:self_business"},
        ],
    },
    "self_exec_expense": {
        "question": "您有保留業務相關費用的憑證嗎？",
        "hint": "如辦公室租金、設備購置、交通費、廣告費等收據",
        "options": [
            {"label": "有，且金額超過費用率估算", "next": "result:self_exec_itemized"},
            {"label": "沒有或金額不多，想用費用率", "next": "result:self_exec_rate"},
        ],
    },
    "self_side_income": {
        "question": "您的副業年收入大約是？",
        "options": [
            {"label": "20 萬元以下", "next": "result:self_side_low"},
            {"label": "20 萬元以上", "next": "result:self_side_high"},
        ],
    },

    # ── 退休路線 ─────────────────────────────────────────────
    "retiree_assets": {
        "question": "您退休後的主要財務狀況是？",
        "options": [
            {"label": "即將或剛領退休金", "next": "retiree_pension_type"},
            {"label": "主要靠存款利息 / 股利生活", "next": "result:retiree_savings"},
            {"label": "名下有不動產考慮出售", "next": "result:retiree_real_estate"},
        ],
    },
    "retiree_pension_type": {
        "question": "您的退休金領取方式是？",
        "options": [
            {"label": "一次領取", "next": "result:retiree_pension_lump"},
            {"label": "分期（月退）領取", "next": "result:retiree_pension_monthly"},
            {"label": "尚未決定", "next": "result:retiree_pension_plan"},
        ],
    },
}

# ── 結果節點定義 ──────────────────────────────────────────────
# key 格式：result:<id>，value 為推薦的策略 ID list

RESULTS: dict[str, list[str]] = {
    # 受薪低收入
    "result:salary_low_basic": [
        "salary_standard_deduction",
        "savings_investment_deduction",
    ],
    "result:salary_low_rent": [
        "salary_standard_deduction",
        "rent_deduction",
        "savings_investment_deduction",
    ],
    "result:salary_low_medical": [
        "salary_standard_deduction",
        "medical_deduction",
        "insurance_deduction",
    ],
    "result:salary_low_insurance": [
        "salary_standard_deduction",
        "insurance_deduction",
        "nhi_premium_deduction",
    ],
    "result:salary_low_loan": [
        "salary_standard_deduction",
        "insurance_deduction",
        "housing_loan_deduction",
    ],
    # 受薪中收入
    "result:salary_mid_basic": [
        "salary_standard_deduction",
        "insurance_deduction",
        "savings_investment_deduction",
        "nhi_premium_deduction",
    ],
    "result:salary_mid_loan": [
        "salary_standard_deduction",
        "housing_loan_deduction",
        "insurance_deduction",
        "savings_investment_deduction",
    ],
    "result:salary_mid_edu": [
        "salary_standard_deduction",
        "education_deduction",
        "insurance_deduction",
    ],
    "result:salary_mid_edu_loan": [
        "salary_standard_deduction",
        "education_deduction",
        "housing_loan_deduction",
        "insurance_deduction",
    ],
    "result:salary_mid_donation": [
        "salary_standard_deduction",
        "donation_deduction",
        "insurance_deduction",
    ],
    # 受薪高收入
    "result:salary_high_basic": [
        "salary_standard_deduction",
        "savings_investment_deduction",
        "insurance_deduction",
        "nhi_premium_deduction",
    ],
    "result:salary_high_disability": [
        "salary_standard_deduction",
        "disability_deduction",
        "insurance_deduction",
        "medical_deduction",
    ],
    "result:salary_high_dividend_basic": [
        "salary_standard_deduction",
        "savings_investment_deduction",
        "nhi_premium_deduction",
        "insurance_deduction",
    ],
    "result:salary_high_dividend_loan": [
        "salary_standard_deduction",
        "savings_investment_deduction",
        "housing_loan_deduction",
        "nhi_premium_deduction",
    ],
    "result:salary_high_dividend_donation": [
        "salary_standard_deduction",
        "savings_investment_deduction",
        "donation_deduction",
        "nhi_premium_deduction",
    ],
    # 自雇
    "result:self_exec_itemized": [
        "business_expense_deduction",
        "insurance_deduction",
        "nhi_premium_deduction",
    ],
    "result:self_exec_rate": [
        "business_expense_deduction",
        "insurance_deduction",
        "savings_investment_deduction",
    ],
    "result:self_side_low": [
        "salary_standard_deduction",
        "insurance_deduction",
        "savings_investment_deduction",
    ],
    "result:self_side_high": [
        "business_expense_deduction",
        "salary_standard_deduction",
        "nhi_premium_deduction",
    ],
    "result:self_business": [
        "business_expense_deduction",
        "nhi_premium_deduction",
        "insurance_deduction",
    ],
    # 退休
    "result:retiree_pension_lump": [
        "retirement_pension_exemption",
        "savings_investment_deduction",
    ],
    "result:retiree_pension_monthly": [
        "retirement_pension_exemption",
        "medical_deduction",
        "insurance_deduction",
    ],
    "result:retiree_pension_plan": [
        "retirement_pension_exemption",
        "savings_investment_deduction",
        "insurance_deduction",
    ],
    "result:retiree_savings": [
        "savings_investment_deduction",
        "insurance_deduction",
        "medical_deduction",
        "donation_deduction",
    ],
    "result:retiree_real_estate": [
        "real_estate_tax_planning",
        "savings_investment_deduction",
        "donation_deduction",
    ],
}


def get_node(node_id: str) -> dict | None:
    """回傳 TREE 中對應節點，若不存在回傳 None。"""
    return TREE.get(node_id)


def is_result_node(node_id: str) -> bool:
    return node_id.startswith("result:")


def get_result_strategies(result_id: str) -> list[str]:
    """回傳結果節點對應的策略 ID list。"""
    return RESULTS.get(result_id, [])


def count_total_questions(start_id: str = "start") -> int:
    """估算從起點到最深葉節點的最大問題數（用於進度條）。"""
    visited: set[str] = set()
    max_depth = [0]

    def dfs(node_id: str, depth: int) -> None:
        if node_id in visited or is_result_node(node_id):
            max_depth[0] = max(max_depth[0], depth)
            return
        visited.add(node_id)
        node = TREE.get(node_id)
        if not node:
            return
        for opt in node.get("options", []):
            dfs(opt["next"], depth + 1)

    dfs(start_id, 0)
    return max_depth[0]
