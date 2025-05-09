import { NextRequest, NextResponse } from "next/server";

import { EnumTokens } from "./services/auth/authTokensService";

export function middleware(request: NextRequest) {
	const apiRoute = [`${process.env.NEXT_PUBLIC_API_URL}`];

	const { nextUrl, cookies } = request;

	const accessToken = cookies.get(EnumTokens.ACCESS_TOKEN)?.value;
	const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value;

	const authPages = ["/login", "/reset-password"];
	const isAuthPage = authPages.some(path => nextUrl.pathname.includes(path));

	// if (isAuthPage && refreshToken) {
	// 	return NextResponse.redirect(new URL("/", nextUrl));
	// }

	if (isAuthPage) {
		return NextResponse.next();
	}

	if (!refreshToken) {
		return NextResponse.redirect(new URL("/auth/login", nextUrl));
	}

	const isApiRoute = apiRoute.some(path => nextUrl.pathname.startsWith(path));

	const isLoggedIn = !!accessToken;

	console.log("Route: ", nextUrl.pathname);
	console.log("IS LOGGEDIN: ", isLoggedIn);

	if (isApiRoute) {
		return NextResponse.next();
	}

	if (isLoggedIn && nextUrl.pathname === "/auth/login") {
		return NextResponse.redirect(new URL("/", nextUrl));
	}

	if (!isLoggedIn) {
		if (nextUrl.pathname === "/auth/login") {
			return NextResponse.next();
		}
		//  else {
		// 	// TODO: callback не работают
		// 	let callbackUrl = nextUrl.pathname;

		// 	if (nextUrl.search) {
		// 		callbackUrl += nextUrl.search;
		// 	}

		// 	const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		// 	return NextResponse.redirect(
		// 		new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
		// 	);
		// }
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"]
	// matcher: ["/:path*", "/auth/:path"],
};
