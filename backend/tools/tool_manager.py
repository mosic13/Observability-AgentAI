from .system_metrics_tool import SystemMetricsTool
from .google_search_tool import GoogleSearchTool
from .code_execution_tool import CodeExecutionTool
from backend.observability.logging_utils import log_event


class ToolManager:
    def __init__(self):
        self.tools = {
            "system_metrics": SystemMetricsTool(),
            "google_search": GoogleSearchTool(),
            "code_execution": CodeExecutionTool()
        }

    def call(self, tool_name, action="get", **kwargs):
        log_event("tool_call", {
        "tool": tool_name,
        "action": action,
        "args": kwargs })

        
        if tool_name not in self.tools:
            raise Exception(f"Tool '{tool_name}' not found")

        tool = self.tools[tool_name]

        if not hasattr(tool, action):
            raise Exception(f"Tool '{tool_name}' has no action '{action}'")

        return getattr(tool, action)(**kwargs)
