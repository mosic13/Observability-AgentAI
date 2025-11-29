import uuid
from datetime import datetime

class InMemorySessionService:
    def __init__(self):
        self.sessions = {}

    def create_session(self):
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "created": datetime.utcnow().isoformat(),
            "history": []
        }
        return session_id

    def add_event(self, session_id, event):
        if session_id not in self.sessions:
            raise ValueError("Invalid session_id")

        self.sessions[session_id]["history"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "event": event
        })

    def get_session(self, session_id):
        return self.sessions.get(session_id, None)

    def list_sessions(self):
        return list(self.sessions.keys())


#  Extend session storage to hold agent state
    def set_flag(self, session_id, flag_name, value):
        if session_id not in self.sessions:
            raise ValueError("Invalid session_id")
        self.sessions[session_id][flag_name] = value

    def get_flag(self, session_id, flag_name):
        if session_id not in self.sessions:
            raise ValueError("Invalid session_id")
        return self.sessions[session_id].get(flag_name, None)
