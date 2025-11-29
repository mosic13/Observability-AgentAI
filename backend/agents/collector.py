import psutil

class CollectorAgent:
    def run(self):
        cpu = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory().percent
        disk = psutil.disk_usage("/").percent

        return {
            "cpu": cpu,
            "memory": memory,
            "disk": disk
        }
