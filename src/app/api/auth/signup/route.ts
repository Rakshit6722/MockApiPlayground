import { connectToDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import { nanoid } from 'nanoid';


export async function POST(req: NextRequest) {
    await connectToDb()

    const body = await req.json()

    if (!body.username || !body.email || !body.password) {
        return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
        return NextResponse.json(
            { error: "JWT secret is not defined in environment variables" },
            { status: 500 }
        );
    }


    const { username, email, password } = body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return NextResponse.json(
            { error: "User with this email already exists" },
            { status: 409 }
        )
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
        return NextResponse.json(
            { error: "User with this username already exists" },
            { status: 409 }
        )
    }

    const hashedPassword = await bcrypt.hash(password, 10);



    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

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

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json({ user: userWithoutPassword, token }, { status: 201 });
}