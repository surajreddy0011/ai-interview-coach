from fastapi import APIRouter, HTTPException
from app.models.question import (
    QuestionRequest,
    QuestionResponse,
    EvaluateRequest,
    EvaluateResponse,
)
from app.services.question_service import generate_questions, evaluate_answer

router = APIRouter(tags=["questions"])


@router.post("/questions", response_model=QuestionResponse)
def create_questions(request: QuestionRequest) -> QuestionResponse:
    questions = generate_questions(request.role, request.job_description)
    return QuestionResponse(questions=questions)


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(request: EvaluateRequest) -> EvaluateResponse:
    try:
        result = evaluate_answer(request.question, request.answer)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    return EvaluateResponse(score=result["score"], feedback=result["feedback"])