import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createToken,
  buildCookieHeader,
  buildLogoutCookieHeader,
} from "@/lib/auth";

// POST — Login
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const token = await createToken();

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": buildCookieHeader(token),
        },
      }
    );
  } catch (error) {
    console.error("[auth] Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE — Logout
export async function DELETE() {
  return new NextResponse(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildLogoutCookieHeader(),
      },
    }
  );
}
