import { connectToDb } from "@/lib/mongoose";
import { MockAuth } from "@/models/MockAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: {
        params: { mockId: string },
    }
) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            )
        }
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }
        const { mockId } = context.params;
        if (!mockId) {
            return NextResponse.json(
                { success: false, message: "Mock ID not provided" },
                { status: 400 }
            );
        }
        const mockAuth = await MockAuth.findOne({
            userId,
            _id: mockId
        });
        if (!mockAuth) {
            return NextResponse.json(
                { success: false, message: "Mock Auth not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, data: mockAuth, message: "Mock Auth retrieved successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error in GET request:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest, context: { params: { mockId: string } }) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            )
        }
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }

        const { mockId } = context.params;
        if (!mockId) {
            return NextResponse.json(
                { success: false, message: "Mock ID not provided" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { fields, endpoint } = body;
        if (!fields || !Array.isArray(fields)) {
            return NextResponse.json(
                { success: false, message: "Fields are required and must be an array" },
                { status: 400 }
            );
        }

        const updatedMockAuth = await MockAuth.findOneAndUpdate(
            { userId, _id: mockId },
            { fields, endpoint },
            { new: true }
        );

        if (!updatedMockAuth) {
            return NextResponse.json(
                { success: false, message: "Mock Auth not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: updatedMockAuth, message: "Mock Auth updated successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error in PUT request:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest, context: { params: { mockId: string } }) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { success: false, message: "Database connection error" },
                { status: 500 }
            )
        }
        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
        }
        const { mockId } = context.params;
        if (!mockId) {
            return NextResponse.json(
                { success: false, message: "Mock ID not provided" },
                { status: 400 }
            );
        }
        const deletedMockAuth = await MockAuth.findOneAndDelete({
            userId,
            _id: mockId
        });
        if (!deletedMockAuth) {
            return NextResponse.json(
                { success: false, message: "Mock Auth not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { success: true, message: "Mock Auth deleted successfully" },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("Error in DELETE request:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}