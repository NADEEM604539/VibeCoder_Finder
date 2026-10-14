from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth_controller import router as auth_router
import uvicorn

app = FastAPI(title="VIBE CODERS FINDER")

# NOTE: "*" cannot be combined with allow_credentials=True (browsers reject it),
# so list the real frontend origins explicitly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Every feature router hangs off /api, so auth lives at /api/auth/...
api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
