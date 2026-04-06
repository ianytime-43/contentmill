import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_IDS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    if (!plan || !["pro", "unlimited"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: PRICE_IDS[plan as keyof typeof PRICE_IDS],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/app?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/app?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
