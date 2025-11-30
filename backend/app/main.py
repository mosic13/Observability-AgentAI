from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil

from backend.agents.parallel_agents import run_parallel_agents
import asyncio

from backend.agents.loop_agent import loop_agent
from backend.services.session_service import InMemorySessionService

from backend.agents.long_running_agent import long_running_agent

from backend.tools.google_search_tool import GoogleSearchTool # Google search

# Request Tracing Middleware
from backend.observability.logging_utils import log_event
import uuid
from fastapi import Request

import os


app = FastAPI(title="Observability AgentAI Backend")
session_service = InMemorySessionService()


from backend.agents.multi_agent_service import MultiAgentService

# ----------------------------
# CORS CONFIGURATION
# ----------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_trace_id(request: Request, call_next):
    print("Middleware hit:", request.url.path)
    trace_id = str(uuid.uuid4())
    request.state.trace_id = trace_id

    log_event("request_start", {
        "path": request.url.path,
        "method": request.method
    }, trace_id)

    response = await call_next(request)

    log_event("request_end", {
        "path": request.url.path,
        "status": response.status_code
    }, trace_id)

    return response



@app.get("/")
def root():
    return {"message": "Observability AgentAI backend running"}

@app.get("/metrics/system")
def get_system_metrics():
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    return {
        "cpu_usage": cpu,
        "memory_usage": memory,
        "disk_usage": disk
    }


@app.get("/agent/metrics")
def run_agent_chain(session_id: str = None):
    service = MultiAgentService(session_service)
    return service.run(session_id=session_id)


from backend.tools.tool_manager import ToolManager

@app.get("/tools/search")
def test_google_search(q: str):
    tm = ToolManager()
    return tm.call("google_search", "search", query=q)

@app.post("/tools/exec")
def test_code_exec(body: dict):
    tm = ToolManager()
    return tm.call("code_execution", "run", code=body.get("code", ""))



@app.get("/agent/parallel")
async def run_parallel():
    return await run_parallel_agents()


@app.get("/agent/loop")
async def run_loop(cycles: int = 3, interval: int = 2):
    return await loop_agent(cycles, interval)

@app.post("/session/create")
def create_session():
    session_id = session_service.create_session()
    return {"session_id": session_id}

@app.post("/session/add")
def add_session_event(body: dict):
    session_id = body.get("session_id")
    event = body.get("event")
    session_service.add_event(session_id, event)
    return {"status": "added"}

@app.get("/session/{session_id}")
def get_session(session_id: str):
    return session_service.get_session(session_id)

@app.get("/sessions")
def list_sessions():
    return session_service.list_sessions()



# Long-Running Operations (Pause / Resume Agents)
@app.post("/agent/longrun/start")
async def start_long_run(body: dict):
    session_id = body.get("session_id")
    cycles = body.get("cycles", 10)
    interval = body.get("interval", 2)

    return await long_running_agent(session_service, session_id, cycles, interval)

@app.post("/agent/longrun/pause")
def pause_long_run(body: dict):
    session_id = body.get("session_id")
    session_service.set_flag(session_id, "paused", True)
    return {"status": "paused"}

@app.post("/agent/longrun/resume")
def resume_long_run(body: dict):
    session_id = body.get("session_id")
    session_service.set_flag(session_id, "paused", False)
    return {"status": "resumed"}


@app.get("/logs")
def get_logs():
    log_path = os.path.join(os.getcwd(), "agent_logs.jsonl")

    if not os.path.exists(log_path):
        return {"logs": []}

    with open(log_path, "r") as f:
        lines = f.readlines()

    # return last 200 lines for safety
    return {"logs": [line.strip() for line in lines[-200:]]}


@app.get("/tools/google_search")
def google_search(query: str):
    tool = GoogleSearchTool()
    result = tool.search(query)
    return {"query": query, "result": result}
