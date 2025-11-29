class AnalyzerAgent:
    def run(self, metrics):
        alerts = []

        if metrics["cpu"] > 85:
            alerts.append("High CPU Usage")

        if metrics["memory"] > 80:
            alerts.append("High Memory Usage")

        if metrics["disk"] > 90:
            alerts.append("High Disk Usage")

        return alerts
