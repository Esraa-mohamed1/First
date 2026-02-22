from jinja2 import Environment, FileSystemLoader, select_autoescape
from typing import Dict, Any
import os

class PromptManager:
    def __init__(self, template_dir: str = "src/prompts"):
        self.env = Environment(
            loader=FileSystemLoader(template_dir),
            autoescape=select_autoescape()
        )

    def get_prompt(self, template_name: str, variables: Dict[str, Any]) -> str:
        template = self.env.get_current_template(template_name)
        return template.render(**variables)

    def list_templates(self):
        return self.env.list_templates()

prompt_manager = PromptManager()
