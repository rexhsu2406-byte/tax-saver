import streamlit as st
from engine.decision_tree import QUESTION_TREE, get_next_question, is_result, get_strategies
from knowledge.strategies import STRATEGIES

st.set_page_config(page_title="台灣節稅專家系統", page_icon="💰", layout="centered")

TAG_COLORS = {
    "green": "#28a745",
    "orange": "#fd7e14",
    "red": "#dc3545",
}

def init_state():
    if "current_key" not in st.session_state:
        st.session_state.current_key = "Q1"
    if "history" not in st.session_state:
        st.session_state.history = []  # list of (question_key, answer_text)


def reset():
    st.session_state.current_key = "Q1"
    st.session_state.history = []


def render_progress():
    # 問題樹最深路徑為 3 題（Q1 → Q2x → Q3x → RESULT），共 3 步
    MAX_STEPS = 3
    steps_done = len(st.session_state.history)
    progress = min(steps_done / MAX_STEPS, 1.0)
    st.progress(progress)
    st.caption(f"第 {steps_done + 1} 步，共最多 {MAX_STEPS} 步")


def render_question(key):
    node = QUESTION_TREE[key]
    st.markdown(f"## {node['text']}")
    if node.get("subtitle"):
        st.markdown(f"*{node['subtitle']}*")
    st.markdown("---")

    for option_text in node["options"]:
        if st.button(option_text, use_container_width=True, key=f"opt_{key}_{option_text}"):
            next_key = get_next_question(key, option_text)
            st.session_state.history.append((key, option_text))
            st.session_state.current_key = next_key
            st.rerun()

    st.markdown("")
    if st.session_state.history:
        if st.button("← 上一題", key="back"):
            prev_key, _ = st.session_state.history.pop()
            st.session_state.current_key = prev_key
            st.rerun()


def render_strategy_card(strategy):
    tag = strategy.get("tag", "")
    tag_color = TAG_COLORS.get(strategy.get("tag_color", "green"), "#28a745")

    tag_html = (
        f'<span style="background-color:{tag_color};color:white;'
        f'padding:2px 10px;border-radius:12px;font-size:0.8em;">{tag}</span>'
    )
    title_html = f"**{strategy['title']}** &nbsp; {tag_html}"

    with st.expander(strategy["title"], expanded=True):
        st.markdown(tag_html, unsafe_allow_html=True)
        st.markdown(
            f"節稅潛力：{strategy['節稅潛力']} &nbsp;｜&nbsp; "
            f"風險等級：**{strategy['風險等級']}** &nbsp;｜&nbsp; "
            f"複雜度：**{strategy['複雜度']}**"
        )
        st.markdown("**📋 法規依據**")
        st.info(strategy["法規依據"])

        st.markdown("**💬 白話說明**")
        st.markdown(strategy["白話說明"])

        case = strategy.get("真實案例", {})
        if case:
            st.markdown("**📖 真實案例**")
            st.success(f"**{case['標題']}**\n\n{case['內容']}")

        st.markdown("**✅ 具體步驟**")
        for step in strategy.get("具體步驟", []):
            st.markdown(step)

        if strategy.get("注意事項"):
            st.warning(f"⚠️ {strategy['注意事項']}")


def render_results(result_key):
    st.markdown("## 🎯 你的節稅方案")

    path_answers = [answer for _, answer in st.session_state.history]
    if path_answers:
        path_str = " → ".join(path_answers)
        st.markdown(f"**你的狀況：** {path_str}")

    st.markdown("---")

    strategy_ids = get_strategies(result_key)
    if not strategy_ids:
        st.warning("找不到對應的節稅策略，請嘗試重新評估。")
    else:
        st.markdown(f"根據你的狀況，為你找到 **{len(strategy_ids)}** 項節稅策略：")
        st.markdown("")
        for sid in strategy_ids:
            strategy = STRATEGIES.get(sid)
            if strategy:
                render_strategy_card(strategy)
                st.markdown("")

    st.markdown("---")
    if st.button("🔄 重新評估", use_container_width=True):
        reset()
        st.rerun()


def main():
    st.title("💰 台灣節稅專家系統")
    st.markdown("回答幾個問題，找出最適合你的節稅策略。")
    st.markdown("---")

    init_state()
    current_key = st.session_state.current_key

    if is_result(current_key):
        render_results(current_key)
    else:
        render_progress()
        st.markdown("")
        render_question(current_key)


if __name__ == "__main__":
    main()
