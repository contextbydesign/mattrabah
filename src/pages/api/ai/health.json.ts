import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      ok: true,
      service: "ai",
      hasOpenAIKey: Boolean(import.meta.env.OPENAI_API_KEY),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
