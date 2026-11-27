import ollama
from validator import ModelResponse


def call_model(model_name, prompt, temperature):
    try:
        response = ollama.chat(
            model=model_name,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            format=ModelResponse.model_json_schema(),
            options={
                "temperature": temperature
            }
        )

        return response.message.content

    except Exception as error:
        print(f"Model {model_name} failed: {error}")
        return None