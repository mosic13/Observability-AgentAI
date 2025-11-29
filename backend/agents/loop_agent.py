import asyncio
import psutil

async def loop_agent(cycles: int = 3, interval: int = 2):
    results = []

    for _ in range(cycles):
        metrics = {
            "cpu": psutil.cpu_percent(interval=1),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("/").percent
        }
        results.append(metrics)

        await asyncio.sleep(interval)

    return results
