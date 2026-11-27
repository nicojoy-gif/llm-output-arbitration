from agreement import collect_valid_answers, calculate_agreement

candidates = [
    {"schema_valid": True, "validated_answer": "Abuja"},
    {"schema_valid": True, "validated_answer": " ABUJA "},
    {"schema_valid": True, "validated_answer": "Lagos"},
    {"schema_valid": False, "validated_answer": None},
    {"schema_valid": True, "validated_answer": ""},
    {"schema_valid": True, "validated_answer": "   "}
]

result = collect_valid_answers(candidates)

print("Valid answers:", result)

print("Abuja:", calculate_agreement("Abuja", result))
print("Lagos:", calculate_agreement("Lagos", result))
print("London:", calculate_agreement("London", result))
print("None:", calculate_agreement(None, result))
print("Empty:", calculate_agreement("", result))
print("Single answer:", calculate_agreement("Abuja", ["abuja"]))
print("No answers:", calculate_agreement("Abuja", []))