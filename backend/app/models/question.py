from pydantic import BaseModel
from typing import Optional, List


class QuestionRequest(BaseModel):
    role: str
    job_description: Optional[str] = None


class QuestionResponse(BaseModel):
    questions: List[str]


class EvaluateRequest(BaseModel):
    question: str
    answer: str


class EvaluateResponse(BaseModel):
    score: int
    feedback: str