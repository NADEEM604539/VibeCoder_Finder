import os
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Query, HTTPException

load_dotenv()

GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = os.environ["GOOGLE_CLIENT_SECRET"]
GOOGLE_REDIRECT_URI = os.environ["GOOGLE_REDIRECT_URI"]


router = APIRouter(prefix="/auth", tags=["auth", "google auth"])

@router.get("/google/callback")
async def google_callback(
    code: str = Query(...),
    state: str | None = Query(default=None),
):
    # Validate OAuth state against the value saved
    # when login started. Do not trust arbitrary state.

    async with httpx.AsyncClient(timeout=15.0) as client:
        # Exchange authorization code for tokens
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded"
            },
        )

        if token_response.is_error:
            raise HTTPException(
                status_code=400,
                detail="Google token exchange failed",
            )

        tokens = token_response.json()
        access_token = tokens["access_token"]

        # Fetch authenticated user's profile
        user_response = await client.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            headers={
                "Authorization": f"Bearer {access_token}"
            },
        )

        if user_response.is_error:
            raise HTTPException(
                status_code=400,
                detail="Could not fetch Google user data",
            )

        user = user_response.json()

    return {
        "google_user_id": user.get("sub"),
        "name": user.get("name"),
        "email": user.get("email"),
        "email_verified": user.get("email_verified"),
        "picture": user.get("picture"),
    }