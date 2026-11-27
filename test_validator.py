from validator import validate_response
test_responses = [
    '{"answer": "Abuja"}',
    '{"answer": 123}',
    '{"answer": "Abuja", "citation": "doc_001"}',
    '{"answer": "Abuja", "citation": null}',
    '{"answer": "Abuja", "citation": 123}',
    'The capital is Abuja.',
    '{"answer": "Lagos"}',
    '{"city": "Abuja"}',
    '{"answer": ""}'
]
for response in test_responses:
    validated_response = validate_response(response)
    print(f"original response is {response} and the answer is {validated_response}")