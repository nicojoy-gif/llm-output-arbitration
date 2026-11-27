import unittest
from scorer import score_candidate


class TestScorer(unittest.TestCase):

    def test_perfect_score(self):
        candidate = {
            "schema_valid": True,
            "factual_correct": True,
            "evidence_valid": True,
            "agreement_ratio": 1.0
        }

        self.assertEqual(score_candidate(candidate), 100)

    def test_all_checks_failed(self):
        candidate = {
            "schema_valid": False,
            "factual_correct": False,
            "evidence_valid": False,
            "agreement_ratio": 0.0
        }

        self.assertEqual(score_candidate(candidate), 0)

    def test_correct_without_citation(self):
        candidate = {
            "schema_valid": True,
            "factual_correct": True,
            "evidence_valid": False,
            "agreement_ratio": 0.0
        }

        self.assertEqual(score_candidate(candidate), 70)

    def test_wrong_answer_with_agreement(self):
        candidate = {
            "schema_valid": True,
            "factual_correct": False,
            "evidence_valid": False,
            "agreement_ratio": 1.0
        }

        self.assertEqual(score_candidate(candidate), 30)

    def test_partial_agreement(self):
        candidate = {
            "schema_valid": True,
            "factual_correct": True,
            "evidence_valid": True,
            "agreement_ratio": 0.5
        }

        self.assertEqual(score_candidate(candidate), 95)

    def test_correct_without_agreement(self):
        candidate = {
            "schema_valid": True,
            "factual_correct": True,
            "evidence_valid": True,
            "agreement_ratio": 0.0
        }

        self.assertEqual(score_candidate(candidate), 90)


if __name__ == "__main__":
    unittest.main()