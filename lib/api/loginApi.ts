import { supabase } from "../supabase/client.ts";
import { fetchUserByID } from "./userApi.ts";

export async function signInWithEmail(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    
    if (!email || !password) {
        return new Response("Invalid input", { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.get('email')!.toString(),
        password: formData.get('password')!.toString(),
    })

    if (error || !data.session) {
        console.error("Sign-in error:", error?.message);
        return new Response("Unauthorized: " + error?.message, { status: 401 });
    }
      
    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    const headers = new Headers();
    headers.set(
        "Set-Cookie",
        `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600, refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`
    );
    headers.set("status", "200")

    const user = await fetchUserByID(data.user.id)

    return new Response(JSON.stringify(user), { headers });
}

export async function signUpNewUser(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirm-password")?.toString();
    
    if (!email || !password || !confirmPassword)  return new Response("Invalid input", { status: 400 });

    const { data, error } = await supabase.auth.signUp({
        email: formData.get('email')!.toString(),
        password: formData.get('password')!.toString(),
    })

    if (error || !data.session) {
        console.error("Sign-in error:", error?.message);
        return new Response("Unauthorized: " + error?.message, { status: 401 });
    }

    const user = await fetchUserByID(data.user!.id)

    return new Response(JSON.stringify(user));
}

export async function getUser(req: Request) {
    const accessToken = getCookie(req, "access_token");
    if (!accessToken) return;
    const { data: user, error } = await supabase.auth.getUser(accessToken);
    if (error) return;
    return user;
}

export function getCookie(req: Request, name: string): string | null {
    const cookies = req.headers.get("cookie");
    if (!cookies) return null;
  
    const value = cookies
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];
  
    return value ? decodeURIComponent(value) : null;
}