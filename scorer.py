def score_candidate(candidate):
    score = 0

    if candidate["schema_valid"]:
        score += 20

    if candidate["factual_correct"]:
        score += 50

    if candidate["evidence_valid"]:
        score += 20

    score += candidate["agreement_ratio"] * 10

    return round(score, 2)