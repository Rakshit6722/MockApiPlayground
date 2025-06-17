import { NextResponse } from "next/server";

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id',
  };
}

export function applyCors(response: Response | NextResponse) {
  const headers = new Headers(response.headers);
  
  Object.entries(corsHeaders()).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}