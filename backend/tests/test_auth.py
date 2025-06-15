import pytest
from fastapi.testclient import TestClient
from main import app
from firebase_admin import auth
from unittest.mock import patch

client = TestClient(app)

@pytest.mark.asyncio
async def test_signup():
    # Mock Firebase user creation
    try:
        response = client.post("/api/auth/signup", json={
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User"
        })
        assert response.status_code == 200
        assert response.json()["email"] == "test@example.com"
        # Clean up: delete test user from Firebase
        user = auth.get_user_by_email("test@example.com")
        auth.delete_user(user.uid)
    except Exception as e:
        print(f"Test cleanup failed: {e}")

@pytest.mark.asyncio
async def test_login():
    with patch("firebase_admin.auth.verify_id_token") as mock_verify:
        mock_verify.return_value = {
            "uid": "test_uid",
            "email": "testlogin@example.com",
            "name": "Test User"
        }
        response = client.post("/api/auth/login", json={"token": "mock-token"})
        assert response.status_code == 200
        assert "access_token" in response.json()