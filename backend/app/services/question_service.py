import os
import json
import re
from typing import Optional, List
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def extract_json(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def generate_questions(role: str, job_description: Optional[str] = None) -> List[str]:
    prompt = f"""Generate 5 interview questions for a {role} position.
"""
    if job_description:
        prompt += f"Base them on this job description:\n{job_description}\n"
    prompt += """Return ONLY valid JSON in this exact format, nothing else:
{"questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]}"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    text = extract_json(response.content[0].text)
    data = json.loads(text)
    return data["questions"]


def evaluate_answer(question: str, answer: str) -> dict:
    prompt = f"""You are an interview coach. Evaluate this candidate's answer.

Question: {question}
Answer: {answer}

Score the answer from 1 to 10 based on clarity, structure, and relevance.
Give specific, constructive feedback on how to improve it.

Return ONLY valid JSON in this exact format, nothing else:
{{"score": 7, "feedback": "your feedback text here"}}"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    text = extract_json(response.content[0].text)

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        print("PARSE FAILED. stop_reason:", response.stop_reason)
        print("Full response was:", response)
        raise ValueError("Claude returned an unexpected response format. Please try again.")

    return data