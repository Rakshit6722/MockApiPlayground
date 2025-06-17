import { connectToDb } from "@/lib/mongoose";
import { MockAuth } from "@/models/MockAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            );
        }
        const body = await req.json();

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }

        const { endpoint, fields } = body;
        if (!endpoint || !fields) {
            return NextResponse.json(
                { success: false, message: "Endpoint and fields are required" },
                { status: 400 }
            );
        }

        const existingMockAuth = await MockAuth.findOne({
            userId,
            endpoint
        })

        if (existingMockAuth) {
            return NextResponse.json(
                { success: false, message: "Mock Auth already exists for this endpoint" },
                { status: 409 }
            );
        }

        const mockAuth = await MockAuth.create({
            userId,
            endpoint,
            fields
        })

        return NextResponse.json(
            { success: true, data: mockAuth, message: "Mock Auth created successfully" },
            { status: 201 }
        );

    } catch (err: any) {
        console.error("Error creating mock auth:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            );
        }
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }
        const mockAuths = await MockAuth.find({ userId });
        if (mockAuths.length === 0) {
            return NextResponse.json(
                { success: false, data: null, message: "No mock auths found for this user" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, data: mockAuths, message: "Mock Auths retrieved successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error in GET mock auth route:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            );
        }
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }

        const mockDelete = await MockAuth.deleteMany({ userId });

        if (mockDelete.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "No mock auths found for this user" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Mock Auths deleted successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error deleting mock auth:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}