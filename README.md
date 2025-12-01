# 🌀 Tanjiro Observability & Alerting Agent
### **The One Who “Smells” the Problems**
A multi-agent observability engine that collects, analyzes, enriches, and evaluates system telemetry while providing real-time visual insights into system health.

## 📘 Overview
Tanjiro Observability Agent is a multi-agent orchestration platform designed to transform raw system telemetry into actionable, explainable intelligence. Inspired by Tanjiro’s heightened sensing abilities, this system “sniffs out” anomalies by correlating CPU, memory, disk, logs, and tool outputs into a unified system health evaluation.

Every agent action—including metric collection, analysis, enrichment, and evaluation—is captured in **session memory** and exposed through a fully interactive dashboard with charts, logs, timeline, and agent controls.

## ❗ Problem Statement
Modern systems generate massive volumes of telemetry—metrics, logs, traces, alerts.  
Teams are forced to manually correlate these signals, slowing incident response and increasing alert fatigue.

Manual monitoring does **not** scale.

## ✅ Solution
A fully automated multi-agent observability engine that:

- Collects raw system metrics  
- Interprets and analyzes telemetry  
- Generates structured alerts  
- Scores system health  
- Executes diagnostics in loops or long-running modes  
- Maintains a full session timeline  
- Produces real-time visualizations via dashboard  

Agents operate sequentially, in parallel, periodically, or through long-running workflows—offering flexibility and intelligence at scale.

## ✨ Features
- Multi-agent orchestration (Collector → Analyzer → Reporter → Evaluator)
- Real-time metrics & visual dashboards
- Health scoring (Excellent → Poor)
- Parallel agents (concurrent CPU/memory/disk reads)
- Loop-based periodic monitoring
- Long-running diagnostic workflows (start, pause, resume)
- Tool integrations (System Metrics, Code Exec, Google Search)
- End-to-end request tracing with trace IDs
- Structured JSONL logging
- Full session timeline for auditability & debugging
- Modular, extensible architecture

## 🧠 Architecture
```
                ┌─────────────────────────────────────────┐
                │       Multi-Agent Orchestrator           │
                │   (coordinates agents + tools)           │
                └───────────────┬─────────────────────────┘
                                │
         ┌──────────────────────┼────────────────────────────┐
         │                      │                            │
┌────────▼────────┐   ┌────────▼────────┐         ┌─────────▼──────────┐
│ Collector Agent │   │ Analyzer Agent  │         │  Reporter Agent     │
│  (raw metrics)  │   │ (thresholding)  │         │ (standard output)   │
└────────┬────────┘   └────────┬────────┘         └─────────┬──────────┘
         │                      │                            │
         └──────────────────────▼────────────────────────────┘
                        ┌────────▼────────┐
                        │ Evaluator Agent │
                        │  (scoring)      │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │ Session Memory  │
                        │ (timeline/logs) │
                        └────────┬────────┘
                                 │
                         ┌───────▼────────┐
                         │   Dashboard     │
                         └─────────────────┘
```

## 🤖 Agent Overview
### Collector Agent
- Collects raw CPU, memory, disk usage  
- Uses low-level psutil calls  
- Foundation of the pipeline  

### Analyzer Agent
- Applies rule-based interpretation  
- Creates actionable alerts (e.g., CPU > 85%)  

### Reporter Agent
- Aggregates metrics and alerts  
- Determines `OK` vs `WARN`  
- Provides a standardized output schema  

### Evaluator Agent
- Scores system health  
- Produces qualitative insights (Excellent/Good/Fair/Poor)  

### Parallel Agents
- Concurrent CPU, memory, disk collection  
- Implemented using `asyncio.gather()`  

### Loop Agent
- Periodic monitoring for X cycles + Y seconds interval  

### Long-Running Agent
- Step-by-step diagnostics  
- Fully controllable (start, pause, resume)  
- Writes `long_running_step` into session memory each iteration  

## 🔧 Tools
### ToolManager
A central registry & executor for all tools.  
Agents call:
```
ToolManager.call(tool_name, action, **kwargs)
```

### Built-in Tools
- SystemMetricsTool  
- Code Execution Tool  
- Google Search Tool  

## 🗂️ Session Memory
Stores all chronological events:
- Agent outputs  
- Tool calls  
- Evaluations  
- Long-running steps  

Used for debugging, replay, and UI timeline.

## 📡 Observability & Tracing
- Request tracing with unique `trace_id`
- Structured JSONL logging
- Live log viewer via frontend

## 🛠️ Tech Stack
### Backend
- FastAPI  
- Python  
- Async endpoints  
- InMemorySessionService  

### Frontend
- React  
- Vite  
- Recharts  

## 🔌 Backend API Endpoints
- `/` — health  
- `/metrics/system`  
- `/agent/metrics`  
- `/agent/parallel`  
- `/agent/loop`  
- `/agent/longrun/start`  
- `/agent/longrun/pause`  
- `/agent/longrun/resume`  
- `/tools/search`  
- `/tools/exec`  
- `/session/create`, `/session/add`, `/session/{id}`, `/sessions`  
- `/logs`  

## 🖥️ Frontend Components
- Dashboard  
- SystemMetrics  
- SessionTimeline  
- LogViewer  
- AgentControlPanel  
- GoogleSearchUI  
- CodeExecutionUI  

## 📁 Directory Structure
```
backend/
  app/main.py
  agents/
  tools/
  memory/

frontend/
  src/components/
  src/pages/Dashboard.jsx
```

## 💡 Value Proposition
Transforms raw telemetry into actionable, explainable intelligence, reducing MTTR and improving operational clarity.

## ⚙️ Setup Instructions
```
git clone <repo>
python -m venv venv
pip install -r requirements.txt
cd frontend
npm install
```

## ▶️ How to Run
### Backend
```
uvicorn app.main:app --reload --port 8000
```

### Frontend
```
npm run dev
```

Visit: `http://localhost:5173`

## 🧪 Demo
(Insert screenshots/GIFs here)

## 🛣️ Roadmap
- LLM-based telemetry search  
- Advanced Grafana-style visualizations  
- Natural-language summaries  
- Automated incident timeline  
- Multi-host monitoring  

## 📄 License
MIT License
