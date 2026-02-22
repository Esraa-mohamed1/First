import json
import hashlib
from typing import Optional
from loguru import logger
from src.core.config import settings
import redis

class LLMCache:
    def __init__(self):
        self._local_cache = {}
        self._redis_client = None
        if settings.redis_host:
            try:
                self._redis_client = redis.Redis(
                    host=settings.redis_host,
                    port=settings.redis_port,
                    decode_responses=True
                )
            except Exception as e:
                logger.warning(f"Could not connect to Redis: {e}. Falling back to in-memory cache.")

    def _get_hash(self, model: str, prompt: str, **kwargs) -> str:
        payload = f"{model}:{prompt}:{json.dumps(kwargs, sort_keys=True)}"
        return hashlib.md5(payload.encode()).hexdigest()

    def get(self, model: str, prompt: str, **kwargs) -> Optional[str]:
        if not settings.use_cache:
            return None
            
        key = self._get_hash(model, prompt, **kwargs)
        
        # Try local cache first
        if key in self._local_cache:
            logger.debug("Cache hit (Local)")
            return self._local_cache[key]
            
        # Try Redis
        if self._redis_client:
            try:
                val = self._redis_client.get(key)
                if val:
                    logger.debug("Cache hit (Redis)")
                    self._local_cache[key] = val # Populate local
                    return val
            except Exception as e:
                logger.error(f"Redis get error: {e}")
                
        return None

    def set(self, model: str, prompt: str, content: str, **kwargs):
        if not settings.use_cache:
            return
            
        key = self._get_hash(model, prompt, **kwargs)
        self._local_cache[key] = content
        
        if self._redis_client:
            try:
                self._redis_client.setex(key, 3600 * 24, content) # 24h TTL
            except Exception as e:
                logger.error(f"Redis set error: {e}")

llm_cache = LLMCache()
