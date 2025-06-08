import { BlackListToken } from "@/models/Token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { jti } = body

        if (!jti) {
            return NextResponse.json(
                { error: "JTI is required" },
                { status: 400 }
            );
        }

        const blackListToken = await BlackListToken.findOne({ jti });

        if (blackListToken) {
            return NextResponse.json(
                { error: "auth token is invalid or blacklisted" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Token is valid" },
            { status: 200 }
        );

    } catch (err: any) {
        console.error("Error in POST /api/auth/reset-password:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}