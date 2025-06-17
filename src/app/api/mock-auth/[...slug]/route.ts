import { connectToDb } from "@/lib/mongoose";
import { MockAuth } from "@/models/MockAuth";
import { MockUserData } from "@/models/MockUserData";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import { applyCors, corsHeaders } from "@/lib/applyCors";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest, context: { params: { slug: string[] } }) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            const errorRes = NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            );
            return applyCors(errorRes);
        }
        const { slug } = context.params;
        const [endpoint, action, username] = slug;
        if (!endpoint || !action || !username) {
            const errorRes = NextResponse.json(
                { success: false, message: "Endpoint, action and username are required" },
                { status: 400 }
            );
            return applyCors(errorRes);
        }

        const user = await User.findOne({ username });
        if(!user){
            const errorRes = NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
            return applyCors(errorRes);
        }
        const mockAuth = await MockAuth.findOne({
            endpoint,
            userId: user._id,
        })

        if (!mockAuth) {
            const errorRes = NextResponse.json(
                { success: false, message: "Mock Auth not found for this endpoint" },
                { status: 404 }
            );
            return applyCors(errorRes);
        }

        if (action === 'signup') {
            const body = await req.json();
            let errors: string[] = [];
            for (let field of mockAuth.fields) {
                const value = body[field.name];

                if (field.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${field.name} is required`);
                }

                if (value !== undefined && value !== null && value !== '') {
                    if (field.type === 'string' && typeof value !== 'string') {
                        errors.push(`${field.name} must be a string`);
                    } else if (field.type === 'number' && typeof value !== 'number') {
                        errors.push(`${field.name} must be a number`);
                    } else if (field.type === 'boolean' && typeof value !== 'boolean') {
                        errors.push(`${field.name} must be a boolean`);
                    }
                }
            }
            if (errors.length > 0) {
                const errorRes = NextResponse.json(
                    { success: false, message: "Validation errors", errors },
                    { status: 400 }
                );
                return applyCors(errorRes);
            }

            const existingUser = await MockUserData.findOne({
                mockAuthId: mockAuth._id,
                email: body.email,
            })

            if (existingUser) {
                const errorRes = NextResponse.json(
                    { success: false, message: "User already exists with this email" },
                    { status: 409 }
                );
                return applyCors(errorRes);
            }

            console.log("Creating new user with body:", body);

            const newUser = await MockUserData.create({
                mockAuthId: mockAuth._id,
                email: body.email,
                data: body,
            })

            console.log("New user created:", newUser);

            const successRes = NextResponse.json(
                { success: true, data: newUser, message: "User created successfully" },
                { status: 201 }
            );
            return applyCors(successRes);
        } else if (action === 'login') {
            const body = await req.json();

            const { email, password } = body;

            if (!email || !password) {
                const errorRes = NextResponse.json(
                    { success: false, message: "Email and password are required" },
                    { status: 400 }
                );
                return applyCors(errorRes);
            }

            const user = await MockUserData.findOne({
                "data.email": email,
                "data.password": password,
            });
            console.log("User found:", user);

            if (!user) {
                const errorRes = NextResponse.json(
                    { success: false, message: "Invalid email or password" },
                    { status: 401 }
                );
                return applyCors(errorRes);
            }

            const jsonPayload = {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'user',
            }

            const jsonOptions: any = {
                expiresIn: '1h',
            }

            const token = jwt.sign(jsonPayload, JWT_SECRET, jsonOptions);

            const successRes = NextResponse.json(
                { success: true, data: { user: { _id: user._id, ...user.data }, token }, message: "Login successful" },
                { status: 200 }
            );
            return applyCors(successRes);
        } else if (action === 'logout') {
            const successRes = NextResponse.json(
                { success: true, message: "Logout successful" },
                { status: 200 }
            );
            return applyCors(successRes);
        }

    } catch (err: any) {
        console.error("Error in POST request mock-auth/[...slug]:", err);
        const errorRes = NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
        return applyCors(errorRes);
    }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(),
    });
}