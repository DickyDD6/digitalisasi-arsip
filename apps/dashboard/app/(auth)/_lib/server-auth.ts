import { cookies } from "next/headers";

export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const response = await fetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse<User> = await response.json();

    return data?.data || null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Server auth error:", error);
    }
    return null;
  }
}
