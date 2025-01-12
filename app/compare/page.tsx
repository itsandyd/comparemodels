import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ComparisonWrapper from "@/components/compare/model-comparison";
import { db } from "@/lib/db";

export default async function ComparePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
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
    redirect("/sign-in");
  }

  const hasActiveSubscription = user.subscription?.status === "ACTIVE";
  const hasCredits = user.creditBalance[0]?.balance > 0;

  if (!hasActiveSubscription && !hasCredits) {
    redirect("/pricing");
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Compare AI Models
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Compare different AI models side by side to find the best one for your needs.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ComparisonWrapper />
        </div>
      </div>
    </div>
  );
}

