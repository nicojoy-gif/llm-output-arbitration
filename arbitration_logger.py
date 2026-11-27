import json
from datetime import datetime, timezone


def log_arbitration(question, candidates, winner):

    eligible_candidates = [
        candidate for candidate in candidates
        if candidate["schema_valid"]
        and candidate["factual_correct"]
    ]

    tie = False

    if winner is None:
        reason = "No candidate passed the mandatory checks."

    else:
        tied_candidates = [
            candidate for candidate in eligible_candidates
            if candidate["score"] == winner["score"]
        ]

        tie = len(tied_candidates) > 1

        if tie:
            reason = "Equal highest scores. First eligible tied candidate selected."
        else:
            reason = "Highest score among eligible candidates."

    log_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "question": question,
        "candidates": candidates,
        "winner": winner,
        "status": "success" if winner is not None else "failed",
        "tie": tie,
        "selection_reason": reason
    }

    with open("arbitration_logs.jsonl", "a", encoding="utf-8") as file:
        file.write(json.dumps(log_entry) + "\n")

    return log_entry