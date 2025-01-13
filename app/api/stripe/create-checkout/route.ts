import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { db } from "@/lib/db";

const returnUrl = absoluteUrl("/");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { plan } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    // If no Stripe customer exists, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { userId }
      });

      // Update user with Stripe customer ID
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id }
      });

      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan === "STARTER" ? process.env.STRIPE_STARTER_PRICE_ID : "",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CREATE_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 