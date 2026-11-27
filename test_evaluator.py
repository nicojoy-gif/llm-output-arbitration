from evaluator import evaluate_correctness
test_input = ["Abuja","abuja","ABUJA", " Abuja ", "Lagos",None,"","The capital is Abuja."]
expected_answer = "Abuja"

for answer in test_input:
    response = evaluate_correctness(answer, expected_answer)
    print(f"origina is {answer} response is {response} ")

