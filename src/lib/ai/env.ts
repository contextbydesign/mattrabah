export type AiEnv = {
  openaiApiKey: string;
};

export function getAiEnv(): AiEnv {
  const openaiApiKey = import.meta.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Add it to your environment before calling AI endpoints.",
    );
  }

  return { openaiApiKey };
}
