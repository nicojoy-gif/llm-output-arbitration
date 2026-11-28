from model_client import call_model
from validator import validate_response
from evaluator import evaluate_correctness
from scorer import score_candidate
from citation_verifier import verify_evidence
from agreement import collect_valid_answers, calculate_agreement
from arbitrator import select_winner
from arbitration_logger import log_arbitration
from question_bank import QUESTIONS
from model_statistics import display_statistics


MODELS = ["llama3.2:1b", "qwen2.5-coder:1.5b"]


def run_arbitration(question, expected_answer, trusted_sources):

    prompt = f"""
    Answer the following question using the provided sources.

    Question: {question}

    Trusted sources:
    {trusted_sources}

    Return only valid JSON in this format:
    {{"answer": "short answer", "citation": "source ID"}}

    Use only the provided source IDs.
    If no source supports your answer, return null as the citation.
    Do not include explanations or Markdown formatting.
    """

    candidates = []

    for model in MODELS:
        print(f"\nEvaluating {model}...")

        answer = call_model(model, prompt, 0.1)

        print(f"Raw response from {model}: {repr(answer)}")

        validated_answer = validate_response(answer)

        extracted_answer = (
            validated_answer.answer
            if validated_answer is not None
            else None
        )

        extracted_citation = (
            validated_answer.citation
            if validated_answer is not None
            else None
        )

        factual_answer = evaluate_correctness(
            extracted_answer,
            expected_answer
        )

        evidence_valid = verify_evidence(
            extracted_answer,
            extracted_citation,
            trusted_sources
        )

        candidate = {
            "model_name": model,
            "answer": answer,
            "temperature": 0.1,
            "schema_valid": validated_answer is not None,
            "validated_answer": extracted_answer,
            "factual_correct": factual_answer,
            "citation": extracted_citation,
            "evidence_valid": evidence_valid
        }

        candidates.append(candidate)

    valid_answers = collect_valid_answers(candidates)

    for candidate in candidates:
        candidate["agreement_ratio"] = calculate_agreement(
            candidate["validated_answer"],
            valid_answers
        )

        candidate["score"] = score_candidate(candidate)

        print(f"\nModel: {candidate['model_name']}")
        print(f"Answer: {candidate['validated_answer']}")
        print(f"Schema valid: {candidate['schema_valid']}")
        print(f"Factual correct: {candidate['factual_correct']}")
        print(f"Evidence valid: {candidate['evidence_valid']}")
        print(f"Score: {candidate['score']}/100")

    winner = select_winner(candidates)

    if winner is None:
        print("\nNo acceptable answer found.")

    else:
        print("\n--- ARBITRATION RESULT ---")
        print("Winning model:", winner["model_name"])
        print("Answer:", winner["validated_answer"])
        print("Citation:", winner["citation"])
        print("Score:", winner["score"])

    log_arbitration(question, candidates, winner)

    print("\nArbitration decision saved.")

    return {
    "question": question,
    "candidates": candidates,
    "winner": winner,
    "status": "success" if winner is not None else "failed"
}


def main():

    while True:
        print("\n" + "=" * 50)
        print("LLM OUTPUT ARBITRATION SYSTEM")
        print("=" * 50)

        for index, item in enumerate(QUESTIONS, start=1):
            print(f"{index}. {item['question']}")

        statistics_option = len(QUESTIONS) + 1

        print(f"{statistics_option}. View model statistics")
        print("0. Exit")

        choice = input("\nEnter your choice: ").strip()

        if choice == "0":
            print("Goodbye!")
            break

        if choice == str(statistics_option):
            display_statistics()
            continue

        if not choice.isdigit():
            print("Invalid choice. Try again.")
            continue

        choice = int(choice)

        if 1 <= choice <= len(QUESTIONS):

            selected = QUESTIONS[choice - 1]

            run_arbitration(
                selected["question"],
                selected["expected_answer"],
                selected["trusted_sources"]
            )

        else:
            print("Invalid choice. Try again.")


if __name__ == "__main__":
    main()