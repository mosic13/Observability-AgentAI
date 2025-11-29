import asyncio
import psutil
from datetime import datetime

async def long_running_agent(session_service, session_id, cycles=10, interval=2):
    results = []

    session_service.set_flag(session_id, "paused", False)

    for i in range(cycles):

        # check pause flag
        if session_service.get_flag(session_id, "paused"):
            await asyncio.sleep(1)
            continue  # stay in loop, but do nothing

        # collect metrics
        metrics = {
            "cpu": psutil.cpu_percent(interval=1),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("/").percent,
            "iteration": i + 1,
            "timestamp": datetime.utcnow().isoformat()
        }

        results.append(metrics)

        # store each iteration event
        session_service.add_event(session_id, {
            "type": "long_running_step",
            "data": metrics
        })

        await asyncio.sleep(interval)

    return results
