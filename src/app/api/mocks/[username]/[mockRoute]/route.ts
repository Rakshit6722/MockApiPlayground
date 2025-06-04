import { connectToDb } from "@/lib/mongoose";
import { Mock } from "@/models/Mock";
import { User } from "@/models/User";
import { mixColor } from "framer-motion";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

export async function GET(
    req: NextRequest,
    context: { params: { username: string; mockRoute: string } }
) {
    try {
        await connectToDb()

        const { username, mockRoute } = await context.params;
        const searchParams = req.nextUrl.searchParams

        const user = await User.findOne({ username })
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const mock = await Mock.findOne({
            userId: user._id,
            route: mockRoute,
        })
        if (!mock) {
            return NextResponse.json(
                { error: "Mock not found" },
                { status: 404 }
            );
        }

        if (mock.error) {
            return NextResponse.json(
                { error: 'simulated error' },
                { status: mock.status || 500 }
            )
        }

        if (mock.delay && mock.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, mock.delay));
        }

        let response = mock.response

        if (mock.isArray && mock.filterEnabled) {
            const value = searchParams.get(mock.keyField);
            if (value) {
                response = response.find((item: any) => String(item[mock.keyField]) === value);
                return NextResponse.json(response, { status: mock.status || 200 });
            }
        }

        if (mock.isArray && mock.paginationEnabled) {
            const limit = parseInt(searchParams.get('limit') || `${mock.defaultLimit}`, 10);
            const offset = parseInt(searchParams.get('offset') || '0');
            response = response.slice(offset, offset + limit);
        }

        return NextResponse.json(
            response,
            { status: mock.status || 200 }
        )


    } catch (error: any) {
        console.error("Error in GET /api/mocks/[username]/[mockRoute]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}