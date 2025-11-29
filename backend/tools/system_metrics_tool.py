import psutil

class SystemMetricsTool:

    name = "system_metrics"

    def get(self):
        return {
            "cpu": psutil.cpu_percent(interval=1),
            "memory": psutil.virtual_memory().percent,
            "disk": psutil.disk_usage("/").percent
        }
