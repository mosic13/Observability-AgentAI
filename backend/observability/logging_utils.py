import json
import uuid
import logging
from datetime import datetime

# Configure global logger
logger = logging.getLogger("agent_observability")
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("agent_logs.jsonl")
file_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

def log_event(event_type, details, trace_id=None):
    if trace_id is None:
        trace_id = str(uuid.uuid4())

    record = {
        "timestamp": datetime.utcnow().isoformat(),
        "trace_id": trace_id,
        "event_type": event_type,
        "details": details
    }
    print("LOG EVENT:", event_type)
    logger.info(json.dumps(record))
    return record
