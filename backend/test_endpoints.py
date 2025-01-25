import os
from dotenv import load_dotenv
import requests
import json
from pathlib import Path

# Load environment variables
load_dotenv()

# Create audio directory if it doesn't exist
AUDIO_DIR = Path("audio")
AUDIO_DIR.mkdir(exist_ok=True)

# Base URL for the API
BASE_URL = "http://localhost:8000"

def test_root():
    print("\n=== Testing Root Endpoint ===")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_chat():
    print("\n=== Testing Chat Endpoint ===")
    # Send as query parameters instead of JSON body
    params = {
        "prompt": "What is 2+2?",
        "model": "gpt-3.5-turbo"
    }
    response = requests.post(f"{BASE_URL}/chat", params=params)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_text_to_speech():
    print("\n=== Testing Text-to-Speech Endpoint ===")
    params = {
        "text": "Hello, world!",
        "provider": "openai",
        "voice": "alloy"
    }
    response = requests.post(f"{BASE_URL}/text-to-speech", params=params)
    print(f"Status Code: {response.status_code}")
    
    # Save the audio file if successful
    if response.status_code == 200:
        output_path = AUDIO_DIR / "test_output3.mp3"
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Audio saved as '{output_path}'")

def test_speech_to_text():
    print("\n=== Testing Speech-to-Text Endpoint ===")
    # Make sure you have a test audio file
    test_audio_path = AUDIO_DIR / "test_output.mp3"
    try:
        with open(test_audio_path, "rb") as audio_file:
            files = {"audio": ("test_audio.mp3", audio_file, "audio/mpeg")}
            params = {
                "model": "whisper-1",
                "language": "en"
            }
            response = requests.post(
                f"{BASE_URL}/speech-to-text", 
                files=files, 
                params=params
            )
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
    except FileNotFoundError:
        print(f"Error: {test_audio_path} not found. Please ensure you have a test audio file.")

def main():
    print("Starting API endpoint tests...")
    print("Make sure your FastAPI server is running on http://localhost:8000")
    
    try:
        test_root()
        test_chat()
        test_text_to_speech()
        test_speech_to_text()
        
    except requests.exceptions.ConnectionError:
        print("\nError: Could not connect to the server.")
        print("Make sure your FastAPI server is running (uvicorn api:app --reload)")  # Updated command
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")

if __name__ == "__main__":
    main() 