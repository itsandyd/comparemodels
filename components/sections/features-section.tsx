import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Test AI Models Instantly",
    description: "Compare outputs from models like GPT-4, LLaMA, and more, all in one place."
  },
  {
    title: "In-Depth Model Insights",
    description: "Explore pricing, token limits, and best use cases for each model."
  },
  {
    title: "Save Time and Costs",
    description: "Choose the best model for your needs without switching between platforms."
  },
  {
    title: "User-Friendly Interface",
    description: "Designed for developers, researchers, and businesses of all levels."
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 py-24 md:py-32 space-y-16">
      <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl">
        Why Use comparemodels.ai?
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <Card key={i} className="border-2">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-sm">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
} 