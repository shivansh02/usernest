
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import {checkOnboarding} from "@/server/actions/checkOnboarding";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/auth")) return;
  const isLoggedIn = !!req.auth;
  if (!isLoggedIn)
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
