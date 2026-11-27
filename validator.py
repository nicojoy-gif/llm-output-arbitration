from pydantic import BaseModel, ValidationError

class ModelResponse(BaseModel):
    answer:str
    citation: str | None = None

def validate_response(response):
    try:
        if response is None:
            return None
        validated_response = ModelResponse.model_validate_json(response)
        return validated_response
    except ValidationError:
        return None
    
      