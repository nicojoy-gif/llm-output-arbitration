import json


def load_logs():
    logs = []

    try:
        with open(
            "arbitration_logs.jsonl",
            "r",
            encoding="utf-8"
        ) as file:

            for line in file:
                if line.strip():
                    logs.append(json.loads(line))

    except FileNotFoundError:
        return []

    return logs


logs = load_logs()

def calculate_statistics(logs):
    statistics = {}

    for log in logs:
        for candidate in log["candidates"]:
            model = candidate["model_name"]

            if model not in statistics:
                statistics[model] = {
                    "attempts": 0,
                    "wins": 0,
                    "total_score": 0,
                    "valid_responses": 0
                }

            statistics[model]["attempts"] += 1
            statistics[model]["total_score"] += candidate["score"]

            if candidate["schema_valid"]:
                statistics[model]["valid_responses"] += 1

        winner = log["winner"]

        if winner is not None:
            statistics[winner["model_name"]]["wins"] += 1

    return statistics
def calculate_metrics(statistics):
    for model, stats in statistics.items():
        attempts = stats["attempts"]

        stats["win_rate"] = round(
            (stats["wins"] / attempts) * 100, 2
        )

        stats["average_score"] = round(
            stats["total_score"] / attempts, 2
        )

        stats["schema_success_rate"] = round(
            (stats["valid_responses"] / attempts) * 100, 2
        )

    return statistics

def display_statistics():
    logs = load_logs()
    statistics = calculate_statistics(logs)
    metrics = calculate_metrics(statistics)

    if not metrics:
        print("No arbitration records found.")
        return

    for model, stats in metrics.items():
        print(f"\nModel: {model}")
        print(f"Attempts: {stats['attempts']}")
        print(f"Wins: {stats['wins']}")
        print(f"Win rate: {stats['win_rate']}%")
        print(f"Average score: {stats['average_score']}/100")
        print(f"Schema success rate: {stats['schema_success_rate']}%")


if __name__ == "__main__":
    display_statistics()