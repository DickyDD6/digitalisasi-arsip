import { NextRequest, NextResponse } from "next/server";

export const proxy = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	const publicRoutes = ["/login"];
	const isPublicRoute = publicRoutes.some((route) =>
		pathname.startsWith(route),
	);

	const protectedRoutes = ["/dashboard"];
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (pathname === "/")
		return NextResponse.redirect(new URL("/login", request.url));

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (isProtectedRoute) {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						cookie: request.headers.get("cookie") ?? "",
					},
					credentials: "include",
					cache: "no-cache",
				},
			);

			if (res.status !== 200) {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		} catch (error) {
			process.env.NODE_ENV !== "production" && console.error(error);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
};

export const config = {
	matcher: ["/", "/dashboard/:path*"],
};
