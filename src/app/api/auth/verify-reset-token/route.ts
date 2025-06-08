import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, email } = body;

        if (!token || !email) {
            return NextResponse.json(
                { error: "Token and email are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email: email,
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const hashedtoken = crypto.createHash('sha256').update(token).digest('hex');
        if (user.resetToken !== hashedtoken || !user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Reset token is valid" },
            { status: 200 }
        );



    } catch (err: any) {
        console.error("Error in POST /api/auth/verify-reset-token:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}