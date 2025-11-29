class AgentEvaluator:
    def evaluate(self, metrics):
        score = 100
        issues = []

        # CPU evaluation
        if metrics["cpu"] > 85:
            score -= 30
            issues.append("High CPU")

        # Memory evaluation
        if metrics["memory"] > 80:
            score -= 30
            issues.append("High Memory")

        # Disk evaluation
        if metrics["disk"] > 90:
            score -= 40
            issues.append("High Disk")

        return {
            "score": max(score, 0),
            "issues": issues,
            "rating": self._rating(score)
        }

    def _rating(self, score):
        if score >= 90:
            return "Excellent"
        if score >= 70:
            return "Good"
        if score >= 40:
            return "Fair"
        return "Poor"
