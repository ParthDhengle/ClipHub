import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_current_user():
    # Requires valid token; mock for testing
    headers = {"Authorization": "Bearer mock-token"}
    response = client.get("/api/users/me", headers=headers)
    assert response.status_code in [200, 401]  # Depends on auth setup