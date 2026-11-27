def evaluate_correctness(answer, expected_answer):
    if answer is None:
        return False
    return answer.lower().strip() == expected_answer.lower().strip() 
        