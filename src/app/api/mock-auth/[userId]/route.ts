import { connectToDb } from "@/lib/mongoose";
import { MockUserData } from "@/models/MockUserData";
import { NextRequest, NextResponse } from "next/server";
import { applyCors, corsHeaders } from "@/lib/applyCors";

export async function GET(
    req: NextRequest,
    context: {
        params: { userId: string },
    }) {
    try {
        try {
            await connectToDb()
        } catch (err: any) {
            console.error("Error in GET request:", err);
            const errorRes = NextResponse.json(
                { success: false, message: "error in database connection" },
                { status: 500 }
            );
            return applyCors(errorRes);
        }
        const { userId } = context.params;
        if (!userId) {
            const errorRes = NextResponse.json(
                { success: false, message: "User ID not provided" },
                { status: 400 }
            );
            return applyCors(errorRes);
        }

        const mockUserData = await MockUserData.findOne({
            _id: userId
        });
        if (!mockUserData) {
            const errorRes = NextResponse.json(
                { success: false, message: "Mock user data not found" },
                { status: 404 }
            );
            return applyCors(errorRes);
        }
        const successRes = NextResponse.json(
            { success: true, user: {_id: mockUserData._id, ...mockUserData.data}, message: "Mock user data retrieved successfully" },
            { status: 200 }
        );
        return applyCors(successRes);
    } catch (err: any) {
        console.error("Error in GET request:", err);
        const errorRes = NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
        return applyCors(errorRes);
    }

}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(),
    });
}