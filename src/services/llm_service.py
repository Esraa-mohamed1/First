from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from tenacity import retry, stop_after_attempt, wait_exponential
from loguru import logger
from litellm import completion

class BaseLLMService(ABC):
    @abstractmethod
    async def get_response(self, prompt: str, **kwargs) -> str:
        pass

class LLMService(BaseLLMService):
    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        before_sleep=lambda retry_state: logger.warning(f"Retrying LLM call: {retry_state.attempt_number}"),
    )
    async def get_response(self, prompt: str, system_prompt: Optional[str] = None, **kwargs) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        logger.info(f"Calling LLM {self.model_name}")
        
        try:
            response = completion(
                model=self.model_name,
                messages=messages,
                **kwargs
            )
            
            content = response.choices[0].message.content
            
            # Log token usage
            usage = response.usage
            logger.info(f"Token usage - Prompt: {usage.prompt_tokens}, Completion: {usage.completion_tokens}, Total: {usage.total_tokens}")
            
            return content
        except Exception as e:
            logger.error(f"Error in LLM call: {str(e)}")
            raise
