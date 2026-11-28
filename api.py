from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import run_arbitration
from question_bank import QUESTIONS
from model_statistics import (
    load_logs,
    calculate_statistics,
    calculate_metrics
)


app = FastAPI(
    title="LLM Output Arbitration API",
    description="Multi-model evaluation and arbitration system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


class ArbitrationRequest(BaseModel):
    question_id: int


@app.get("/")
def home():
    return {
        "message": "LLM Arbitration API is running",
        "status": "healthy"
    }


@app.get("/questions")
def get_questions():
    return [
        {
            "id": index,
            "question": item["question"]
        }
        for index, item in enumerate(QUESTIONS, start=1)
    ]


@app.post("/arbitrate")
def arbitrate(request: ArbitrationRequest):

    if not 1 <= request.question_id <= len(QUESTIONS):
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    selected = QUESTIONS[request.question_id - 1]

    return run_arbitration(
        selected["question"],
        selected["expected_answer"],
        selected["trusted_sources"]
    )


@app.get("/statistics")
def get_statistics():
    logs = load_logs()

    statistics = calculate_statistics(logs)
    metrics = calculate_metrics(statistics)

    successful_runs = sum(
        1 for log in logs
        if log["status"] == "success"
    )

    total_runs = len(logs)
    failed_runs = total_runs - successful_runs

    success_rate = (
        round(successful_runs / total_runs * 100, 2)
        if total_runs > 0 else 0
    )

    return {
        "total_runs": total_runs,
        "successful_runs": successful_runs,
        "failed_runs": failed_runs,
        "success_rate": success_rate,
        "models": metrics
    }


@app.get("/history")
def get_history():
    logs = load_logs()

    return list(reversed(logs))