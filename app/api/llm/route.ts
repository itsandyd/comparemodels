import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fal } from "@fal-ai/client";

// Configure FAL client
fal.config({
  credentials: process.env.FAL_KEY
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check for active subscription or credits
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        creditBalance: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const hasActiveSubscription = user.subscription?.status === "ACTIVE";
    const hasCredits = user.creditBalance?.[0]?.balance > 0;

    if (!hasActiveSubscription && !hasCredits) {
      return new NextResponse("No active subscription or credits", { status: 403 });
    }

    // Deduct credits if no active subscription
    if (!hasActiveSubscription && hasCredits) {
      await db.creditBalance.update({
        where: { id: user.creditBalance[0].id },
        data: {
          balance: {
            decrement: 1 // Deduct 1 credit per request
          }
        }
      });
    }

    const { model, prompt } = await req.json();

    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model,
        prompt,
      },
      logs: true,
    });

    // Log usage
    await db.usage.create({
      data: {
        userId,
        model,
        creditsUsed: 1,
        prompt,
        response: result.data.output,
      },
    });

    return NextResponse.json({ output: result.data.output });
  } catch (error) {
    console.error("[LLM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 