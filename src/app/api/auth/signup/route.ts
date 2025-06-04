import { connectToDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectToDb()

    const body = await req.json()

    if (!body.username || !body.email || !body.password) {
        return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const { username, email, password } = body;

    const existingEmail = await User.findOne({ email });
    if(existingEmail){
        return NextResponse.json(
            { error: "User with this email already exists" },
            { status: 409 } 
        )
    }

    const existingUsername = await User.findOne({ username: username });
    if(existingUsername){
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

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
}