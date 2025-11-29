from backend.tools.tool_manager import ToolManager
from backend.services.session_service import InMemorySessionService
from .analyzer import AnalyzerAgent
from .reporter import ReporterAgent
from .agent_evaluator import AgentEvaluator
from backend.observability.logging_utils import log_event


class MultiAgentService:
    def __init__(self, session_service: InMemorySessionService):
        self.tools = ToolManager()
        self.session_service = session_service

    def run(self, session_id: str = None):
        # Tool-based metrics collection
        metrics = self.tools.call("system_metrics", "get")
        
        analyzer = AnalyzerAgent()
        reporter = ReporterAgent()
        evaluator = AgentEvaluator()


        alerts = analyzer.run(metrics)
        result = reporter.run(metrics, alerts)
        evaluation = evaluator.evaluate(metrics)

        final = {
            "metrics": metrics,
            "alerts": alerts,
            "status": result["status"],
            "evaluation": evaluation
        }


        log_event("agent_chain_run", {"metrics": metrics,"alerts": alerts}, trace_id=session_id)



        # Optional session logging
        if session_id:
            self.session_service.add_event(session_id, {
                "type": "agent_chain",
                "metrics": metrics,
                "alerts": alerts,
                "evaluation": evaluation
            })

        return final
