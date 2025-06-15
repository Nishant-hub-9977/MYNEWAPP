import httpx
import logging
from fastapi import HTTPException
from ..utils.config import UPSTOX_API_SECRET

logger = logging.getLogger(__name__)

async def exchange_code_for_token(code: str, client_id: str, redirect_uri: str) -> dict:
    """
    Exchange authorization code for access token from Upstox.
    
    Args:
        code: Authorization code from Upstox OAuth callback
        client_id: Upstox API key
        redirect_uri: Redirect URI used in OAuth flow
        
    Returns:
        dict: Token response from Upstox
        
    Raises:
        HTTPException: If token exchange fails
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_url = "https://api.upstox.com/oauth/token"
            
            payload = {
                "client_id": client_id,
                "client_secret": UPSTOX_API_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri
            }
            
            headers = {
                "Content-Type": "application/json"
            }
            
            logger.info(f"🔄 Exchanging code for token with Upstox")
            
            response = await client.post(token_url, json=payload, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"❌ Upstox token exchange failed: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=502, 
                    detail="Failed to exchange code for token with Upstox"
                )
            
            token_data = response.json()
            logger.info(f"✅ Successfully exchanged code for Upstox token")
            
            return token_data
            
    except httpx.TimeoutException:
        logger.error("⏰ Upstox token exchange request timed out")
        raise HTTPException(status_code=502, detail="Upstox API timeout")
    except httpx.RequestError as e:
        logger.error(f"🌐 Network error during Upstox token exchange: {e}")
        raise HTTPException(status_code=502, detail="Upstox API unavailable")
    except Exception as e:
        logger.error(f"💥 Unexpected error during Upstox token exchange: {e}")
        raise HTTPException(status_code=502, detail="Token exchange failed")