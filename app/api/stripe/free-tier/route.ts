import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user already has credits
    const existingCredits = await db.creditBalance.findFirst({
      where: { userId },
    });

    if (existingCredits) {
      return new NextResponse("Free tier already activated", { status: 400 });
    }

    // Create credit balance for free tier
    await db.creditBalance.create({
      data: {
        userId,
        balance: 1000, // Free tier credits
      },
    });

    return new NextResponse("Free tier activated", { status: 200 });
  } catch (error) {
    console.error("[FREE_TIER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 