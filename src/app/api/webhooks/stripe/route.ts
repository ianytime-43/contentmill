import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { queries, User } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (email) {
      const user = queries.getUserByEmail(email) as User | undefined;
      if (user) {
        // Determine plan from subscription
        const subscription =
          await getStripe().subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const plan =
          priceId === process.env.STRIPE_UNLIMITED_PRICE_ID
            ? "unlimited"
            : "pro";

        queries.updateUserPlan(plan, customerId, subscriptionId, user.id);
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const user = queries.getUserByStripeCustomer(customerId) as
      | User
      | undefined;
    if (user) {
      queries.updateUserPlan("free", null, null, user.id);
    }
  }

  return NextResponse.json({ received: true });
}
