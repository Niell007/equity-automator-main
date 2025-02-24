import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    },
  );
});
