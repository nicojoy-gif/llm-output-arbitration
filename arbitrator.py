def select_winner(candidates):
    eligible_candidates = []

    for candidate in candidates:
        if candidate["schema_valid"] and candidate["factual_correct"]:
            eligible_candidates.append(candidate)

    if not eligible_candidates:
        return None

    highest_score = max(
    candidate["score"]
    for candidate in eligible_candidates
)

    tied_candidates = []

    for candidate in eligible_candidates:
      if candidate["score"] == highest_score:
        tied_candidates.append(candidate)

    return tied_candidates[0]