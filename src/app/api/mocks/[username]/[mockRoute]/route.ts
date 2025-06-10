import { connectToDb } from "@/lib/mongoose";
import { Mock } from "@/models/Mock";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    context: { params: { username: string; mockRoute: string } }
) {
    try {
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
                { error: "User not found" },
                { status: 404 }
            );
        }

        const mock = await Mock.findOne({
            userId: user._id,
            route: mockRoute,
        });
        if (!mock) {
            return NextResponse.json(
                { error: "Mock not found" },
                { status: 404 }
            );
        }

        // Handle simulated error
        if (simulateError) {
            return NextResponse.json(
                { error: 'Simulated error response' },
                { status: mock.status || 500 }
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

        // Handle filtering by keyField if response is array
        if (mock.isArray && Array.isArray(response) && mock.keyField) {
            const filterValue = searchParams.get(mock.keyField) || searchParams.get('id');
            if (filterValue) {
                response = response.filter((item: any) => 
                    String(item[mock.keyField]) === filterValue
                );
                
                // Return single object if only one result
                if (response.length === 1) {
                    return NextResponse.json(response[0], { status: mock.status || 200 });
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
                    data: response.slice(startIndex, endIndex),
                    meta: {
                        total: response.length,
                        page: pageNum,
                        limit: limitNum,
                        totalPages: Math.ceil(response.length / limitNum)
                    }
                };
                return NextResponse.json(paginatedResponse, { status: mock.status || 200 });
            }
            
            response = response.slice(startIndex, endIndex);
        }

        return NextResponse.json(
            response,
            { status: mock.status || 200 }
        );
    } catch (error: any) {
        console.error("Error in GET /api/mocks/[username]/[mockRoute]:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}