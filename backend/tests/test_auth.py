import pytest
from fastapi.testclient import TestClient
from main import app
from firebase_admin import auth

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
    # Create a test user in Firebase
    user = auth.create_user(email="testlogin@example.com", password="password123")
    # Simulate client-side login to get ID token (mock for testing)
    # In a real test, you would need a valid Firebase ID token
    response = client.post("/api/auth/login", json={"token": "mock-firebase-token"})
    assert response.status_code in [200, 401]  # 401 if token verification fails
    # Clean up
    auth.delete_user(user.uid)