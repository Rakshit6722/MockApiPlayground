import { connectToDb } from "@/lib/mongoose";
import { Mock } from "@/models/Mock";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { MockUserData } from "@/models/MockUserData";

export async function GET(
    req: NextRequest,
    context: {
        params: { username: string; mockRoute: string },
    },
    res: NextResponse
) {
    try {

        const origin = req.headers.get("origin") || "*";

        await connectToDb();

        const { username, mockRoute } = context.params;
        const searchParams = req.nextUrl.searchParams;

        // Get query parameters
        const simulateError = searchParams.get('error') === 'true';
        const customDelay = searchParams.get('delay');
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { success: false, data: null, message: "User not found" },
                { status: 404 }
            );
        }

        const mock = await Mock.findOne({
            userId: user._id,
            route: mockRoute,
        });
        if (!mock) {
            return NextResponse.json(
                { success: false, data: null, message: "Mock not found" },
                { status: 404 }
            );
        }

        // Handle simulated error
        if (simulateError) {
            return NextResponse.json(
                { success: false, data: null, message: 'Simulated error response' },
                { status: 500 }
            );
        }

        // Apply custom delay if provided
        if (customDelay) {
            const delayMs = parseInt(customDelay, 10);
            if (!isNaN(delayMs) && delayMs > 0) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        let response = mock.response;
        let finalResponse: any = null;


        // Handle filtering by keyField if response is array
        if (mock.isArray && Array.isArray(response) && mock.keyField) {
            const filterValue = searchParams.get(mock.keyField) || searchParams.get('id');
            if (filterValue) {
                response = response.filter((item: any) =>
                    String(item[mock.keyField]) === filterValue
                );

                // Return single object if only one result
                if (response.length === 1) {
                    finalResponse = NextResponse.json(
                        { success: true, data: response[0], message: "Fetched successfully" },
                        { status: mock.status || 200 }
                    );
                }
            }
        }

        // Handle pagination if response is array
        if (mock.isArray && Array.isArray(response) && (page || limit)) {
            const pageNum = parseInt(page || '1', 10);
            const limitNum = parseInt(limit || '10', 10);
            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = startIndex + limitNum;

            // Add pagination metadata if _meta=true
            if (searchParams.get('_meta') === 'true') {
                const paginatedResponse = {
                    success: true,
                    data: response.slice(startIndex, endIndex),
                    meta: {
                        total: response.length,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(response.length / limitNum)
                    },
                    message: "Fetched successfully"
                };
                finalResponse = NextResponse.json(paginatedResponse, { status: mock.status || 200 });
            }

            response = response.slice(startIndex, endIndex);
        }

        finalResponse = NextResponse.json(
            { success: true, data: response, message: "Fetched successfully" },
            { status: mock.status || 200 }
        );

        finalResponse.headers.set("Access-Control-Allow-Origin", origin);
        finalResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        finalResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

        return finalResponse;
    } catch (error: any) {
        console.error("Error in GET /api/mocks/[username]/[mockRoute]:", error);
        return NextResponse.json(
            { success: false, data: null, message: "Internal server error" },
            { status: 500 }
        );
    }

}

export async function DELETE(req: NextRequest,
    context: {
        params: { username: string, mockRoute: string }
    }
) {
    try {

        try {
            await connectToDb()
        } catch (err: any) {
            console.error("error in connecting to db")
            return NextResponse.json(
                { message: "errro in connecting to db" },
                { status: 500 }
            )
        }

        const searchParams = req.nextUrl.searchParams;
        const id = searchParams.get("id")

        const { username, mockRoute } = context.params

        const user = await User.findOne({ username })
        if (!user) {
            return NextResponse.json(
                { message: "user not found" },
                { status: 404 }
            )
        }

        const mock = await Mock.findOne({
            userId: user._id,
            route: mockRoute,
        })

        const foundMock = mock?.response?.some((item: any) => item.id === Number(id))
        if (!foundMock) {
            return NextResponse.json(
                { message: "No item with this id exist" },
                { status: 404 }
            )
        }

        const newMock = mock?.response?.filter((item: any) => item.id !== Number(id))
        // console.log("new mock",newMock)

        mock.response = newMock
        await mock.save();

        return NextResponse.json(
            { statue: true, message: "Deleted  successfully" },
            { status: 200 }
        )

    } catch (err: any) {
        console.error("Error in DELETE /api/mocks/[username]/[mockRoute]:", err);
        return NextResponse.json(
            { success: false, data: null, message: "Interval server error" },
            { status: 500 }
        )
    }
}