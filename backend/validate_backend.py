import requests
import time

BASE = "http://localhost:8000"

def check(label, condition):
    print(f"[{'PASS' if condition else 'FAIL'}] {label}")

def get(url):
    try:
        return requests.get(url, timeout=5)
    except:
        return None

def post(url, json=None):
    try:
        return requests.post(url, json=json, timeout=5)
    except:
        return None

# -------------------------------------------------------
# START VALIDATIONS
# -------------------------------------------------------
print("\n=== Observability AgentAI Backend Validation ===\n")

# 1. Root endpoint
resp = get(f"{BASE}/")
check("Root endpoint reachable", resp is not None and resp.status_code == 200)

# 2. Sequential Agent Chain
resp = get(f"{BASE}/agent/metrics")
check("Sequential Agent Chain", resp is not None and resp.status_code == 200)

# 3. Parallel Agents
resp = get(f"{BASE}/agent/parallel")
check("Parallel Agents", resp is not None and resp.status_code == 200)

# 4. Loop Agent
resp = get(f"{BASE}/agent/loop?cycles=2&interval=1")
check("Loop Agent", resp is not None and resp.status_code == 200)

# 5. Session Create
resp = post(f"{BASE}/session/create")
session_ok = resp is not None and resp.status_code == 200
check("Session Create", session_ok)

session_id = resp.json()["session_id"] if session_ok else None

# 6. Session Add Event
if session_ok:
    resp = post(f"{BASE}/session/add", {
        "session_id": session_id,
        "event": "validation_test_event"
    })
    check("Session Add Event", resp is not None and resp.status_code == 200)
else:
    check("Session Add Event", False)

# 7. Session Read
if session_ok:
    resp = get(f"{BASE}/session/{session_id}")
    check("Session Read", resp is not None and resp.status_code == 200)
else:
    check("Session Read", False)

# 8. Tool: Code Execution
resp = post(
    f"{BASE}/tools/exec",
    {"code": "x = 1+2"}
)
check("Tool: Code Execution", resp is not None and resp.status_code == 200)

# 9. Tool: System Metrics (via agent chain)
resp = get(f"{BASE}/agent/metrics")
metrics_ok = resp is not None and "metrics" in resp.json()
check("Tool: System Metrics", metrics_ok)

# 10. Evaluate included in agent output
if metrics_ok:
    eval_ok = "evaluation" in resp.json()
    check("Evaluation Agent", eval_ok)
else:
    check("Evaluation Agent", False)

# 11. Observability Logs File
try:
    with open("agent_logs.jsonl", "r") as f:
        content = f.read().strip()
        log_ok = len(content) > 0
except:
    log_ok = False

check("Observability Logs (JSONL)", log_ok)

# 12. Long-running agent
if session_ok:
    resp = post(
        f"{BASE}/agent/longrun/start",
        {"session_id": session_id, "cycles": 2, "interval": 1}
    )
    check("Long-running Agent", resp is not None and resp.status_code == 200)
else:
    check("Long-running Agent", False)

print("\n=== Validation Complete ===\n")

