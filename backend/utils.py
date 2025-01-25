import openai
from typing import Optional, Literal
# You'll need to install these packages:
# pip install openai python-dotenv requests elevenlabs
from google.cloud import texttospeech
from google.cloud import speech
import os
from dotenv import load_dotenv
import requests
import tempfile
from pathlib import Path

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")  # Alternative TTS provider

def generate_chat_response(prompt: str, model: str = "gpt-3.5-turbo") -> str:
    """
    Generate a response using OpenAI's chat completion
    """
    try:
        # Updated to use the new OpenAI API format
        client = openai.OpenAI()
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error generating chat response: {str(e)}")

def text_to_speech(
    text: str,
    provider: Literal["elevenlabs", "openai"] = "openai",
    voice: str = "alloy"  # OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
) -> bytes:
    """
    Convert text to speech using either OpenAI or ElevenLabs
    """
    try:
        if provider == "openai":
            response = openai.audio.speech.create(
                model="tts-1",
                voice=voice,
                input=text
            )
            return response.content
            
        elif provider == "elevenlabs":
            # ElevenLabs implementation (higher quality, more voice options)
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}"
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": ELEVENLABS_API_KEY
            }
            data = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            }
            response = requests.post(url, json=data, headers=headers)
            return response.content
            
    except Exception as e:
        raise Exception(f"Error converting text to speech: {str(e)}")

def speech_to_text(
    audio_content: bytes,
    model: Literal["whisper", "whisper-1"] = "whisper-1",
    language: str = None
) -> str:
    """
    Convert speech to text using OpenAI's Whisper model
    """
    try:
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(audio_content)
            temp_audio_path = temp_audio.name

        with open(temp_audio_path, "rb") as audio_file:
            # Use OpenAI's Whisper model
            response = openai.audio.transcriptions.create(
                model=model,
                file=audio_file,
                language=language
            )
            
        # Clean up the temporary file
        os.unlink(temp_audio_path)
        
        return response.text
        
    except Exception as e:
        # Clean up the temporary file in case of error
        if 'temp_audio_path' in locals():
            os.unlink(temp_audio_path)
        raise Exception(f"Error converting speech to text: {str(e)}")

def text_to_speech_google(text: str, language_code: str = "en-US") -> bytes:
    """
    Convert text to speech using Google Cloud Text-to-Speech
    """
    try:
        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
        
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        return response.audio_content
    except Exception as e:
        raise Exception(f"Error converting text to speech: {str(e)}") 