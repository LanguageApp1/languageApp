from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Literal
import utils
import io

# Initialize the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Example root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Chatbot API!"}

@app.post("/chat")
async def chat_endpoint(prompt: str, model: str = "gpt-3.5-turbo"):
    try:
        response = utils.generate_chat_response(prompt, model)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/text-to-speech")
async def text_to_speech_endpoint(
    text: str,
    provider: Literal["elevenlabs", "openai"] = "openai",
    voice: str = "alloy"
):
    try:
        audio_content = utils.text_to_speech(text, provider, voice)
        return StreamingResponse(
            io.BytesIO(audio_content),
            media_type="audio/mpeg"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/speech-to-text")
async def speech_to_text_endpoint(
    audio: UploadFile = File(...),
    model: Literal["whisper", "whisper-1"] = "whisper-1",
    language: Optional[str] = None
):
    try:
        audio_content = await audio.read()
        text = utils.speech_to_text(audio_content, model, language)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
