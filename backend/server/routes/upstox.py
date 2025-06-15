from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import logging
from ..services.upstox import exchange_code_for_token

logger = logging.getLogger(__name__)

router = APIRouter()

class CallbackRequest(BaseModel):
    code: str
    client_id: str
    redirect_uri: str

@router.post("/callback")
async def upstox_callback(request: CallbackRequest):
    """
    Handle Upstox OAuth callback and exchange code for access token.
    
    Args:
        request: Contains authorization code, client_id, and redirect_uri
        
    Returns:
        dict: Access token and related data from Upstox
    """
    logger.info("🔐 Upstox OAuth callback received")
    
    try:
        # Exchange code for access token
        token_data = await exchange_code_for_token(
            code=request.code,
            client_id=request.client_id,
            redirect_uri=request.redirect_uri
        )
        
        response = {
            "success": True,
            "token_data": token_data,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info("✅ Upstox OAuth callback processed successfully")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions from the service
        raise
    except Exception as e:
        logger.error(f"❌ Error in Upstox callback endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")