import { apiConnector } from "@/app/_services/interceptor/apiConnector";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = 'http://localhost:11434/api'

export async function POST(
    req: NextRequest
) {
    try {
        const body = await req.json()

        const { prompt } = body

        const response = await axios.post(`${BASE_URL}/generate`, {
            model: "wizardlm2:7b",
            prompt: prompt,
            stream: false,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(
            { response: response.data.response },
            { status: 200 }
        )
    } catch (err: any) {
        console.error("Error in POST /api/generate-response:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}