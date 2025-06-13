from fastapi import APIRouter
from datetime import datetime
import logging
from ..services.dhan import get_sensex_price

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/sensex-price")
async def fetch_sensex_price():
    """
    Fetch current Sensex price from DhanHQ API.
    
    Returns:
        dict: JSON response with sensex price and timestamp
    """
    logger.info("📈 Sensex price endpoint called")
    
    try:
        # Fetch price from DhanHQ service
        sensex_price = await get_sensex_price()
        
        response = {
            "sensex": sensex_price,
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"✅ Returning Sensex price: ₹{sensex_price}")
        return response
        
    except Exception as e:
        logger.error(f"❌ Error in sensex-price endpoint: {e}")
        # Re-raise the exception to let FastAPI handle it
        raise