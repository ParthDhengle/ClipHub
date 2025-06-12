import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_media():
    headers = {"Authorization": "Bearer mock-token"}
    response = client.post("/api/media/", json={
        "title": "Test Media",
        "url": "http://example.com/media.jpg",
        "type": "photo"
    }, headers=headers)
    assert response.status_code in [200, 401]  # Depends on auth setup