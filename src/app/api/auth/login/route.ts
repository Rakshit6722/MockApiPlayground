import { connectToDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';  
import { nanoid } from 'nanoid';


export async function POST(req: NextRequest) {
    await connectToDb()

    const body = await req.json()
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 }
        )
    }

    const user = await User.findOne({
        email: email
    })

    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        )
    }

    if (!process.env.JWT_SECRET) {
        return NextResponse.json(
            { error: "JWT secret is not defined in environment variables" },
            { status: 500 }
        );
    }

    // Create JWT token using jose instead of jsonwebtoken

    const jti = nanoid();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ 
        userId: user._id.toString(), 
        email: user.email 
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setJti(jti)
        .setExpirationTime('7d')
        .sign(secret);

    return NextResponse.json(
        { message: "Login successful", userId: user._id, token: token, email: user.email, username: user.username },
        { status: 200 }
    )
}