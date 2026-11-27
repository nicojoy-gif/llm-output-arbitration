import unittest
from arbitrator import select_winner


class TestArbitrator(unittest.TestCase):

    def create_candidate(
        self, model, schema_valid, factual_correct, score
    ):
        return {
            "model_name": model,
            "schema_valid": schema_valid,
            "factual_correct": factual_correct,
            "score": score
        }

    def test_highest_score_wins(self):
        candidates = [
            self.create_candidate("A", True, True, 70),
            self.create_candidate("B", True, True, 90),
            self.create_candidate("C", True, True, 100)
        ]

        winner = select_winner(candidates)

        assert winner is not None

        self.assertEqual(winner["model_name"], "C")

    def test_incorrect_answer_cannot_win(self):
        candidates = [
            self.create_candidate("A", True, False, 100),
            self.create_candidate("B", True, True, 70)
        ]

        winner = select_winner(candidates)

        assert winner is not None

        self.assertEqual(winner["model_name"], "B")

    def test_invalid_schema_cannot_win(self):
        candidates = [
            self.create_candidate("A", False, True, 100),
            self.create_candidate("B", True, True, 90)
        ]

        winner = select_winner(candidates)

        assert winner is not None

        self.assertEqual(winner["model_name"], "B")

    def test_tie_breaking(self):
        candidates = [
            self.create_candidate("A", True, True, 100),
            self.create_candidate("B", True, True, 100)
        ]

        winner = select_winner(candidates)

        assert winner is not None

        self.assertEqual(winner["model_name"], "A")

    def test_all_candidates_fail(self):
        candidates = [
            self.create_candidate("A", False, False, 0),
            self.create_candidate("B", True, False, 30)
        ]

        self.assertIsNone(select_winner(candidates))

    def test_empty_candidates(self):
        self.assertIsNone(select_winner([]))


if __name__ == "__main__":
    unittest.main()