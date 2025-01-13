import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error(`Webhook signature verification failed:`, error.message);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Session data:", session);

        if (!session?.metadata?.userId) {
          console.error("No userId in session metadata");
          return new NextResponse("User id is required", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        console.log("Subscription data:", subscription);

        await db.subscription.create({
          data: {
            userId: session.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            plan: "STARTER",
            status: "ACTIVE",
          },
        });

        console.log("Subscription created in database");
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice data:", invoice);

        if (!invoice.subscription) {
          console.error("No subscription in invoice");
          return new NextResponse("No subscription found", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );

        await db.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            status: "ACTIVE",
          }
        });

        console.log("Subscription updated in database");
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 