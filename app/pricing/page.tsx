import { PricingSection } from "@/components/sections/pricing-section"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-4">
              Flexible Plans for Every Need
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start with our free tier and scale as you grow. All plans include access to our powerful AI model comparison tools.
            </p>
          </div>
        </div>
        <PricingSection />
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  <h3 className="font-semibold">What are credits?</h3>
                  <p className="text-gray-500">Credits are our platform&apos;s currency. 1 credit equals 1 request to any AI model. Different models may consume different amounts of credits based on their capabilities.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Do unused credits expire?</h3>
                  <p className="text-gray-500">Credits roll over based on your plan&apos;s limits. Starter plans can roll over up to 2x monthly credits, Pro plans up to 3x, and Enterprise plans have unlimited rollover.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Can I upgrade or downgrade my plan?</h3>
                  <p className="text-gray-500">Yes, you can change your plan at any time. Your remaining credits will be transferred to your new plan, subject to the new plan&apos;s rollover limits.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">What happens if I run out of credits?</h3>
                  <p className="text-gray-500">You can purchase additional credits at any time without changing your plan. We also offer auto-recharge options to ensure uninterrupted service.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 