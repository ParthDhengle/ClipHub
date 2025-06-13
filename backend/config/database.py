import firebase_admin
from firebase_admin import credentials, firestore
import os

def initialize_firebase():
    """Initialize Firebase app if not already initialized"""
    try:
        # Check if default app exists
        firebase_admin.get_app()
        print("Firebase app already initialized")
    except ValueError:
        # Default app doesn't exist, initialize it
        try:
            # Get credentials path from environment variable
            creds_path = os.getenv('FIREBASE_CREDENTIALS_PATH', './firebase-service-account.json')
            
            # Check if the credentials file exists
            if os.path.exists(creds_path):
                cred = credentials.Certificate(creds_path)
                firebase_admin.initialize_app(cred)
                print("Firebase app initialized successfully with service account")
            else:
                # Try to use default credentials (for production environments)
                try:
                    cred = credentials.ApplicationDefault()
                    firebase_admin.initialize_app(cred)
                    print("Firebase app initialized successfully with default credentials")
                except Exception as default_error:
                    print(f"Error with default credentials: {default_error}")
                    print(f"Please ensure {creds_path} exists or set up Application Default Credentials")
                    raise
                    
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            raise

# Initialize Firebase when module is imported
initialize_firebase()

# Get Firestore client
def get_db():
    return firestore.client()