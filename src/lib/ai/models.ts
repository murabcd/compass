export const modelRealtimeMini = "realtime-model-mini";
export const modelRealtime = "realtime-model";

const modelMappings: Record<string, string> = {
  [modelRealtimeMini]: "gpt-4o-mini-realtime-preview",
  [modelRealtime]: "gpt-4o-realtime-preview",
};

export function getModelId(id: string): string {
  const modelId = modelMappings[id];
  if (!modelId) {
    throw new Error(`Model id "${id}" not found in mappings.`);
  }
  return modelId;
}

interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

export const modelInfoList: Array<ModelInfo> = [
  {
    id: modelRealtimeMini,
    name: "gpt-4o-mini-realtime",
    description: "Fast model for real-time voice conversations with balanced performance",
  },
  {
    id: modelRealtime,
    name: "gpt-4o-realtime",
    description:
      "Advanced model for real-time voice conversations with superior reasoning",
  },
];
