import { NextRequest, NextResponse } from "next/server";
import authConfig from "./server/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {});
