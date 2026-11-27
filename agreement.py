def collect_valid_answers(candidates):
    valid_answers = []

    for candidate in candidates:
        answer = candidate["validated_answer"]

        if candidate["schema_valid"] and answer is not None:
            normalized_answer = answer.strip().lower()

            if normalized_answer:
                valid_answers.append(normalized_answer)

    return valid_answers

def calculate_agreement(answer, valid_answers):
    if answer is None or len(valid_answers) < 2:
        return 0.0

    normalized_answer = answer.strip().lower()

    if not normalized_answer:
        return 0.0

    matching_count = valid_answers.count(normalized_answer)

    return matching_count / len(valid_answers)