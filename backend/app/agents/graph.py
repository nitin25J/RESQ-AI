import logging
from langgraph.graph import StateGraph, START, END

from app.agents.state import EmergencyState
from app.agents.analysis import run_analysis_agent
from app.agents.first_aid import run_first_aid_agent
from app.agents.hospital_search import run_hospital_search_tool
from app.agents.report import run_report_agent
from app.agents.alert import run_alert_prep_step

logger = logging.getLogger("resq_ai.graph")

def create_emergency_graph():
    """Builds and compiles the sequential LangGraph workflow."""
    builder = StateGraph(EmergencyState)

    # 1. Register Nodes
    builder.add_node("analysis", run_analysis_agent)
    builder.add_node("first_aid", run_first_aid_agent)
    builder.add_node("hospital_search", run_hospital_search_tool)
    builder.add_node("report", run_report_agent)
    builder.add_node("alert", run_alert_prep_step)

    # 2. Wire Sequential Edges
    builder.add_edge(START, "analysis")
    builder.add_edge("analysis", "first_aid")
    builder.add_edge("first_aid", "hospital_search")
    builder.add_edge("hospital_search", "report")
    builder.add_edge("report", "alert")
    builder.add_edge("alert", END)

    # 3. Compile Graph
    compiled_graph = builder.compile()
    logger.info("LangGraph emergency response graph successfully compiled.")
    return compiled_graph

emergency_graph = create_emergency_graph()
