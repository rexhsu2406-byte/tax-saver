import streamlit as st
from engine.decision_tree import (
    START_NODE,
    get_node,
    get_result_strategies,
    is_result_node,
    count_total_questions,
)
from knowledge.strategies import STRATEGIES

# ── 頁面設定 ──────────────────────────────────────────────────
st.set_page_config(
    page_title="台灣節稅專家系統",
    page_icon="💰",
    layout="centered",
)

# ── 自訂樣式 ──────────────────────────────────────────────────
st.markdown(
    """
    <style>
    /* 整體背景 */
    .main { background-color: #f8fafc; }

    /* 問題標題 */
    .question-box {
        background: white;
        border-radius: 12px;
        padding: 28px 32px;
        margin: 16px 0 24px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        border-left: 5px solid #2563eb;
    }
    .question-text {
        font-size: 1.35rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 6px;
    }
    .hint-text {
        font-size: 0.92rem;
        color: #64748b;
    }

    /* 策略卡片 */
    .strategy-card {
        background: white;
        border-radius: 12px;
        padding: 24px 28px;
        margin-bottom: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        border-top: 4px solid #2563eb;
    }
    .card-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 4px;
    }
    .card-category {
        display: inline-block;
        background: #dbeafe;
        color: #1d4ed8;
        border-radius: 20px;
        padding: 2px 12px;
        font-size: 0.78rem;
        font-weight: 600;
        margin-bottom: 12px;
    }
    .card-summary {
        font-size: 1rem;
        color: #334155;
        margin-bottom: 12px;
    }
    .card-savings {
        background: #f0fdf4;
        border-left: 4px solid #22c55e;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 0.92rem;
        color: #166534;
        margin-bottom: 14px;
        font-weight: 600;
    }
    .card-tag {
        display: inline-block;
        background: #f1f5f9;
        color: #475569;
        border-radius: 16px;
        padding: 2px 10px;
        font-size: 0.76rem;
        margin-right: 6px;
        margin-bottom: 4px;
    }

    /* 按鈕微調 */
    div[data-testid="stButton"] > button {
        width: 100%;
        text-align: left;
        border-radius: 8px;
        font-size: 1rem;
        padding: 12px 18px;
        font-weight: 500;
    }
    div[data-testid="stButton"] > button:hover {
        border-color: #2563eb;
        color: #2563eb;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Session state 初始化 ──────────────────────────────────────
if "history" not in st.session_state:
    # history: list of node_id strings（已回答過的節點）
    st.session_state.history = []
if "current_node" not in st.session_state:
    st.session_state.current_node = START_NODE
if "show_details" not in st.session_state:
    # dict: strategy_id -> bool
    st.session_state.show_details = {}

MAX_DEPTH = count_total_questions()


def go_back() -> None:
    if st.session_state.history:
        st.session_state.current_node = st.session_state.history.pop()
    st.session_state.show_details = {}


def choose_option(next_node: str) -> None:
    st.session_state.history.append(st.session_state.current_node)
    st.session_state.current_node = next_node
    st.session_state.show_details = {}


def restart() -> None:
    st.session_state.history = []
    st.session_state.current_node = START_NODE
    st.session_state.show_details = {}


# ── Header ────────────────────────────────────────────────────
st.markdown("## 💰 台灣節稅專家系統")
st.caption("回答幾個問題，系統將為您推薦最適合的節稅策略")
st.divider()

current = st.session_state.current_node
answered = len(st.session_state.history)

# ── 進度條 ────────────────────────────────────────────────────
if not is_result_node(current):
    progress = min(answered / MAX_DEPTH, 0.99) if answered > 0 else 0.0
    st.progress(progress, text=f"第 {answered + 1} 題，共約 {MAX_DEPTH} 題")
else:
    st.progress(1.0, text="已完成所有問題")

st.markdown("")  # spacing

# ── 問題頁面 ──────────────────────────────────────────────────
if not is_result_node(current):
    node = get_node(current)

    if node is None:
        st.error(f"找不到節點：{current}，請重新開始。")
        st.button("重新開始", on_click=restart)
    else:
        subtitle_html = (
            f'<div class="hint-text">{node["subtitle"]}</div>'
            if node.get("subtitle")
            else ""
        )
        st.markdown(
            f"""
            <div class="question-box">
                <div class="question-text">{node["text"]}</div>
                {subtitle_html}
            </div>
            """,
            unsafe_allow_html=True,
        )

        for label, next_id in node["options"].items():
            st.button(
                label,
                key=f"opt_{current}_{next_id}",
                on_click=choose_option,
                args=(next_id,),
            )

        st.markdown("")
        if st.session_state.history:
            st.button("← 上一題", on_click=go_back, type="secondary")

# ── 結果頁面 ──────────────────────────────────────────────────
else:
    strategy_ids = get_result_strategies(current)

    st.markdown("### 為您推薦的節稅策略")
    st.caption(
        f"根據您的狀況，以下共 {len(strategy_ids)} 項策略可幫您合法降低稅負，點擊「查看詳情」了解操作步驟。"
    )
    st.markdown("")

    if not strategy_ids:
        st.info("目前無符合條件的策略，建議諮詢稅務專業人員。")
    else:
        for sid in strategy_ids:
            s = STRATEGIES.get(sid)
            if not s:
                continue

            tags_html = "".join(
                f'<span class="card-tag">#{t}</span>' for t in s.get("tags", [])
            )
            refs_html = (
                "、".join(s.get("references", [])) if s.get("references") else ""
            )

            st.markdown(
                f"""
                <div class="strategy-card">
                    <div class="card-title">{s['title']}</div>
                    <span class="card-category">{s['category']}</span>
                    <div class="card-summary">{s['summary']}</div>
                    <div class="card-savings">💡 節稅估算：{s['savings_estimate']}</div>
                    <div>{tags_html}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # 展開詳情按鈕
            show_key = f"show_{sid}"
            is_open = st.session_state.show_details.get(sid, False)
            label = "▲ 收起詳情" if is_open else "▼ 查看詳情"

            if st.button(label, key=f"btn_{sid}"):
                st.session_state.show_details[sid] = not is_open
                st.rerun()

            if is_open:
                with st.container():
                    st.markdown("**詳細說明**")
                    st.write(s["details"])

                    steps = s.get("steps", [])
                    if steps:
                        st.markdown("**操作步驟**")
                        for i, step in enumerate(steps, 1):
                            st.markdown(f"{i}. {step}")

                    if refs_html:
                        st.caption(f"法規依據：{refs_html}")

                st.markdown("")

    st.divider()
    col1, col2 = st.columns([1, 3])
    with col1:
        st.button("← 上一題", on_click=go_back, type="secondary")
    with col2:
        st.button("🔄 重新開始", on_click=restart)

# ── Footer ────────────────────────────────────────────────────
st.markdown("")
st.caption(
    "⚠️ 本系統提供之資訊僅供參考，實際稅務狀況因人而異，建議重大決策前諮詢專業稅務顧問或會計師。"
)
