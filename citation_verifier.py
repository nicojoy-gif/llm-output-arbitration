trusted_sources = {
    "doc_001": "Abuja is the capital of Nigeria.",
    "doc_002": "Lagos is the former capital of Nigeria.",
    "doc_003": "Nigeria is located in West Africa."
}

def verify_citation(citation, trusted_sources):
    return citation in trusted_sources

def verify_evidence(answer, citation, trusted_sources):
    if answer is None or not answer.strip():
        return False

    if not verify_citation(citation, trusted_sources):
        return False

    content = trusted_sources[citation]

    return answer.lower().strip() in content.lower()