from citation_verifier import verify_citation, verify_evidence

trusted_sources = {
    "doc_001": "Abuja is the capital of Nigeria.",
    "doc_002": "Lagos is the former capital of Nigeria.",
    "doc_003": "Nigeria is located in West Africa."
}

citations = [
    "doc_001",
    "doc_002",
    "doc_003",
    "doc_009",
    None,
    ""
]

for citation in citations:
    result = verify_citation(citation, trusted_sources)
    print(citation, result)

test_cases = [
    ("Abuja", "doc_001"),
    ("Abuja", "doc_002"),
    ("Abuja", "doc_003"),
    ("Abuja", "doc_009"),
    ("Lagos", "doc_002"),
    (" ABUJA ", "doc_001"),
    (None, "doc_001"),
    ("", "doc_001"),
    ("Abuja", None)
]

for answer, citation in test_cases:
    result = verify_evidence(answer, citation, trusted_sources)
    print(f"Answer: {answer}, Citation: {citation}, Result: {result}")