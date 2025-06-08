import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import { BlackListToken } from "./models/Token";
import axios from "axios";

// Explicitly set edge runtime
export const runtime = 'experimental-edge';

const JWT_SECRET = process.env.JWT_SECRET || '';
const secret = new TextEncoder().encode(JWT_SECRET);


export async function middleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {

    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    const validateToken = await axios.post(`${process.env.PUBLIC_APP_URL}/api/auth/validateToken`, {
      jti: payload.jti
    });

    console.log('Validate Token Response:', validateToken.status);

    if (validateToken.status !== 200) {
      return NextResponse.json({ error: 'Token is invalid or blacklisted' }, { status: 401 });
    }

    const userId = payload.userId;

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', String(userId));

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/mock/:path*',
  ]
}