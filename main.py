import asyncio
from src.services.llm_service import LLMService
from src.services.cache import llm_cache
from src.services.prompt_manager import prompt_manager
from src.core.logging import logger

async def main():
    # Initialize service
    llm = LLMService(model_name="gpt-4o")
    
    # Prepare data
    user_data = {"user_name": "Alice", "topic": "Scalable AI Architecture"}
    
    # 1. Get prompt from manager
    prompt = prompt_manager.get_prompt("example_prompt.jinja2", user_data)
    
    # 2. Check cache
    cached_response = llm_cache.get(llm.model_name, prompt)
    
    if cached_response:
        print("--- CACHED RESPONSE ---")
        print(cached_response)
        return

    # 3. Call LLM (with retry and logging)
    response = await llm.get_response(prompt)
    
    # 4. Save to cache
    llm_cache.set(llm.model_name, prompt, response)
    
    print("--- NEW RESPONSE ---")
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
