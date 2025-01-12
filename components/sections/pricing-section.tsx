"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out the platform",
    credits: "1,000 credits (one-time)",
    features: [
      "Access to basic models",
      "Standard response times",
      "Basic features",
      "Community support",
      "1,000 one-time credits"
    ],
    popular: false
  },
  {
    name: "Starter",
    price: "$15",
    description: "Great for hobbyists and small projects",
    credits: "10,000 credits/month",
    costPerRequest: "$0.0015 per request",
    features: [
      "All models included",
      "Fast response times",
      "Full feature access",
      "Email support",
      "Credits rollover up to 2x monthly limit",
      "Priority processing"
    ],
    popular: true
  }
]

// const additionalCredits = [
//   {
//     amount: "5,000",
//     price: "$12",
//     costPerRequest: "$0.0024"
//   },
//   {
//     amount: "10,000",
//     price: "$20",
//     costPerRequest: "$0.002"
//   },
//   {
//     amount: "50,000",
//     price: "$90",
//     costPerRequest: "$0.0018"
//   }
// ]

export function PricingSection() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const onSubscribe = async (planName: string) => {
    try {
      setLoading(planName);

      if (planName === "Free") {
        await axios.post("/api/stripe/free-tier");
        toast.success("Free tier activated!");
        router.push("/compare");
        return;
      }

      const { data } = await axios.post("/api/stripe/create-checkout", {
        plan: planName.toUpperCase(),
      });

      window.location.href = data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || "Something went wrong, please try again.");
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Choose the plan that&apos;s right for you. All plans include access to our API and dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative flex flex-col p-6 w-full h-full ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="space-y-4 flex-grow">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="space-y-2">
                  <p className="text-4xl font-bold">{plan.price}<span className="text-lg font-normal text-gray-500">{plan.price !== "$0" ? "/month" : ""}</span></p>
                  <p className="text-gray-500">{plan.description}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>{plan.credits}</p>
                  {plan.costPerRequest && <p>{plan.costPerRequest}</p>}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 w-full">
                <Button 
                  onClick={() => onSubscribe(plan.name)}
                  disabled={loading === plan.name}
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading === plan.name ? "Loading..." : "Get Started"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* <div className="mt-24 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Need Additional Credits?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalCredits.map((pack) => (
              <Card key={pack.amount} className="p-6 flex flex-col h-full">
                <div className="space-y-4 flex-grow">
                  <h4 className="text-xl font-bold">{pack.amount} Credits</h4>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">{pack.price}</p>
                    <p className="text-sm text-gray-500">{pack.costPerRequest} per request</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Purchase Credits
                </Button>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
} 