from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_features_are_truthful():
    response = client.get("/api/v1/features")
    assert response.status_code == 200

    features = {item["name"]: item["status"] for item in response.json()["features"]}
    assert features["text-to-video"] == "unavailable"
    assert features["image-to-video"] == "unavailable"
    assert features["authentication"] == "unavailable"
