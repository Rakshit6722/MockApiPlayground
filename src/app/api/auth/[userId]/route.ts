import { connectToDb } from "@/lib/mongoose";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: {
    userId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  await connectToDb();
  const { userId } = params;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}