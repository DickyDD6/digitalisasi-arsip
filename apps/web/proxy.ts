import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://dummyjson.com"];
const corsOptions = {
	"Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const proxy = (request: NextRequest) => {
	const origin = request.headers.get("origin") ?? "";
	const isAllowedOrigin = allowedOrigins.includes(origin);
	const response = NextResponse.next();
	const { pathname } = request.nextUrl;

	if (pathname === "/")
		return NextResponse.redirect(new URL("/login", request.url));

	if (request.method === "OPTIONS")
		NextResponse.json(
			{},
			{
				headers: {
					...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
					...corsOptions,
				},
			},
		);

	if (isAllowedOrigin)
		response.headers.set("Access-Control-Allow-Origin", origin);

	Object.entries(corsOptions).forEach(([key, value]) =>
		response.headers.set(key, value),
	);

	return response;
};

export const config = {
	matcher: ["/:path*"],
};
