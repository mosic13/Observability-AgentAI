class ReporterAgent:
    def run(self, metrics, alerts):
        return {
            "metrics": metrics,
            "alerts": alerts,
            "status": "OK" if not alerts else "WARN"
        }
