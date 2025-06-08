import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, token } = body;

        if (!email || !password || !token) {
            return NextResponse.json(
                { error: "Email, password, and token are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            email: email
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const currentTime = new Date();

        if (user.resetToken !== hashedToken || user.resetTokenExpiration < currentTime) {
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();

        return NextResponse.json(
            { message: "Password reset successfully" },
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