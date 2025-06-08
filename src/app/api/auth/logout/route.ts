import { BlackListToken } from "@/models/Token";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)

        const { payload } = await jwtVerify(token, secret);

        console.log('Payload:', payload);

        const jti = payload.jti;
        const exp = payload.exp;

        if (!jti || !exp) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        await BlackListToken.create({
            jti,
            expiresAt: new Date(exp * 1000)
        })


        return NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

    } catch (err: any) {
        console.error('Error during logout:', err);
        return new Response(JSON.stringify({ error: 'Logout failed' }), { status: 500 });
    }
}