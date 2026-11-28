export interface ModelDefinition {
  id: string;
  name: string;
  family: string;
  parameterSize: string;
  provider: string;
}

export const MODELS: readonly ModelDefinition[] = [
  {
    id: "llama3.2:1b",
    name: "Llama 3.2",
    family: "Meta Llama",
    parameterSize: "1.2B",
    provider: "Ollama",
  },
  {
    id: "qwen2.5-coder:1.5b",
    name: "Qwen 2.5 Coder",
    family: "Alibaba Qwen",
    parameterSize: "1.5B",
    provider: "Ollama",
  },
];

export function getModelDefinition(modelId: string): ModelDefinition {
  return (
    MODELS.find((model) => model.id === modelId) ?? {
      id: modelId,
      name: modelId,
      family: "Unknown",
      parameterSize: "—",
      provider: "Ollama",
    }
  );
}
