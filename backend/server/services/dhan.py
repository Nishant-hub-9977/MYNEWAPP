import httpx
import logging
from fastapi import HTTPException
from ..utils.config import DHAN_SANDBOX_TOKEN, DHAN_API_URL

logger = logging.getLogger(__name__)

async def get_sensex_price() -> float:
    """
    Fetch Sensex price from DhanHQ sandbox API.
    
    Returns:
        float: The last traded price of Sensex
        
    Raises:
        HTTPException: If API call fails or returns non-200 status
    """
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            headers = {
                "Authorization": f"Bearer {DHAN_SANDBOX_TOKEN}",
                "Content-Type": "application/json"
            }
            
            url = f"{DHAN_API_URL}/market-feed/indices?index=NSE:SENSEX"
            logger.info(f"📡 Fetching Sensex data from: {url}")
            
            response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"❌ DhanHQ API returned status {response.status_code}: {response.text}")
                raise HTTPException(status_code=502, detail="DhanHQ API unavailable")
            
            data = response.json()
            logger.info(f"✅ DhanHQ API response: {data}")
            
            # Extract lastTradedPrice from the response
            # The actual structure may vary, so we'll handle different possible formats
            if isinstance(data, dict):
                # Try different possible keys for the price
                price = (
                    data.get("lastTradedPrice") or 
                    data.get("ltp") or 
                    data.get("price") or
                    data.get("last_price")
                )
                
                if price is not None:
                    return float(price)
                
                # If it's a nested structure, try to find the price
                if "data" in data and isinstance(data["data"], dict):
                    nested_data = data["data"]
                    price = (
                        nested_data.get("lastTradedPrice") or 
                        nested_data.get("ltp") or 
                        nested_data.get("price") or
                        nested_data.get("last_price")
                    )
                    if price is not None:
                        return float(price)
            
            elif isinstance(data, list) and len(data) > 0:
                # If response is a list, take the first item
                first_item = data[0]
                if isinstance(first_item, dict):
                    price = (
                        first_item.get("lastTradedPrice") or 
                        first_item.get("ltp") or 
                        first_item.get("price") or
                        first_item.get("last_price")
                    )
                    if price is not None:
                        return float(price)
            
            logger.error(f"❌ Could not extract price from response: {data}")
            raise HTTPException(status_code=502, detail="DhanHQ API unavailable")
            
    except httpx.TimeoutException:
        logger.error("⏰ DhanHQ API request timed out")
        raise HTTPException(status_code=502, detail="DhanHQ API unavailable")
    except httpx.RequestError as e:
        logger.error(f"🌐 Network error calling DhanHQ API: {e}")
        raise HTTPException(status_code=502, detail="DhanHQ API unavailable")
    except Exception as e:
        logger.error(f"💥 Unexpected error calling DhanHQ API: {e}")
        raise HTTPException(status_code=502, detail="DhanHQ API unavailable")