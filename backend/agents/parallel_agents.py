import psutil
import asyncio

async def cpu_agent():
    return {"cpu": psutil.cpu_percent(interval=1)}

async def memory_agent():
    return {"memory": psutil.virtual_memory().percent}

async def disk_agent():
    return {"disk": psutil.disk_usage("/").percent}

async def run_parallel_agents():
    results = await asyncio.gather(
        cpu_agent(),
        memory_agent(),
        disk_agent()
    )

    merged = {}
    for r in results:
        merged.update(r)
    return merged
