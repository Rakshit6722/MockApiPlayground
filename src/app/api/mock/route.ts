import { connectToDb } from "@/lib/mongoose";
import { Mock } from "@/models/Mock";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDb()

        const body = await req.json()

        const userId = req.headers.get('x-user-id') || req.headers.get('user-id');
        console.log("User ID from request:", userId);

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            )
        }

        const routePresent = await Mock.findOne({
            route: body.route,
            userId: userId
        })

        if (routePresent) {
            return NextResponse.json(
                { error: "Mock with this route already exists" },
                { status: 400 }
            )
        }

        const newMock = await Mock.create({
            ...body,
            userId: userId
        })

        return NextResponse.json({
            message: "Mock created successfully",
            mock: newMock
        },
            { status: 201 }
        )

    } catch (error: any) {
        console.error("Error in POST /api/mocks:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(
    req: NextRequest
) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error connecting to database:", err);
            return NextResponse.json(
                { error: "Database connection error" },
                { status: 500 }
            )
        }
        const userId = req.headers.get('x-user-id') || req.headers.get('user-id');

        const mocks = await Mock.find({ userId: userId });

        if (!mocks || mocks.length === 0) {
            return NextResponse.json(
                { error: "No mocks found for this user" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            mocks,
            { status: 200 }
        )

    } catch (err: any) {
        console.error("Error in GET /api/mock:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}