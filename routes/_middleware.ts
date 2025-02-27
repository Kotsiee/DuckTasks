import { FreshContext } from "$fresh/server.ts";
import { fetchUserByID } from "../lib/api/userApi.ts";

export async function handler(req: Request, ctx: FreshContext) {
  const cookies = req.headers.get("cookie") || "";
  const userID = cookies.match(/user=([^;]+)/)?.[1] || null;

  if (userID)
    ctx.state.user = await fetchUserByID(userID)

  if (req.method == "OPTIONS") {
    const resp = new Response(null, {
      status: 204,
    });
    const origin = req.headers.get("Origin") || "*";
    const headers = resp.headers;
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "DELETE");
    return resp;
  }

  const origin = req.headers.get("Origin") || "*";
  const resp = await ctx.next();
  const headers = resp.headers;

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
  );
  headers.set(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS, GET, PUT, DELETE",
  );

  return resp;
}