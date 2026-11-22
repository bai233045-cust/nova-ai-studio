import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def _cors_origins() -> list[str]:
    configured = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )
    return [origin.strip() for origin in configured.split(",") if origin.strip()]

app = FastAPI(
    title="Nova AI Studio",
    description="AI Video Generation Platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Nova AI Studio",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Nova AI Studio Backend",
    }


@app.get("/api/v1/features")
def features():
    return {
        "features": [
            {
                "name": "text-to-video",
                "status": "unavailable",
                "reason": "No provider adapter configured",
            },
            {
                "name": "image-to-video",
                "status": "unavailable",
                "reason": "No provider adapter configured",
            },
            {
                "name": "voice-generation",
                "status": "unavailable",
                "reason": "No voice provider configured",
            },
            {
                "name": "video-editing",
                "status": "unavailable",
                "reason": "No editing endpoints implemented",
            },
            {
                "name": "projects",
                "status": "unavailable",
                "reason": "No persistence or authentication implemented",
            },
            {
                "name": "authentication",
                "status": "unavailable",
                "reason": "No authentication provider implemented",
            },
            {
                "name": "uploads",
                "status": "unavailable",
                "reason": "No upload validation or storage implemented",
            },
        ]
    }