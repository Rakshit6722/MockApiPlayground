import { connectToDb } from "@/lib/mongoose";
import { Mock } from "@/models/Mock";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: { mockId: string } }
) {
    try {
        await connectToDb()
        const { mockId } = await context.params;
        const body = await req.json()

        const mock = Mock.findById(mockId);
        if (!mock) {
            return NextResponse.json(
                { error: "Mock not found" },
                { status: 404 }
            )
        }

        const updatedMock = await Mock.findByIdAndUpdate(
            mockId,
            { ...body },
            { new: true }
        );

        if (!updatedMock) {
            return NextResponse.json(
                { error: "Failed to update mock" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: "Mock updated successfully", mock: updatedMock },
            { status: 200 }
        )




    } catch (err: any) {
        console.error("Error in PATCH /api/mock/[mockId]:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}


export async function DELETE(
    req: NextRequest,
    context: { params: { mockId: string } }
) {
    try {
        await connectToDb()

        const { mockId } = await context.params;

        const mock = await Mock.findByIdAndDelete(mockId);

        if (!mock) {
            return NextResponse.json(
                { error: "Mock not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Mock deleted successfully" },
            { status: 200 }
        )

    } catch (err: any) {
        console.error("Error in DELETE /api/mock/[mockId]:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}


export async function GET(
    req: NextRequest,
    context: { params: { mockId: string } }
) {
    try {
        await connectToDb()

        const userId = req.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { mockId } = await context.params;

        const mock = await Mock.find({
            _id: mockId,
            userId: userId
        });

        if (!mock) {
            return NextResponse.json(
                { error: "Mock not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            mock,
            { status: 200 }
        )

    } catch (err: any) {
        console.error("Error in GET /api/mock/[mockId]:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}