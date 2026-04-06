import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { queries, User, PLAN_LIMITS } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = queries.getUserById(Number(userId)) as User | undefined;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if usage needs reset (new billing month)
  const resetDate = new Date(user.usage_reset_date);
  if (new Date() >= resetDate) {
    queries.resetUsage(user.id);
    return NextResponse.json({
      plan: user.plan,
      used: 0,
      limit: PLAN_LIMITS[user.plan],
      canGenerate: true,
    });
  }

  const limit = PLAN_LIMITS[user.plan];
  return NextResponse.json({
    plan: user.plan,
    used: user.usage_count,
    limit,
    canGenerate: user.usage_count < limit,
  });
}
