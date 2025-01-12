import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Discover, Compare, and Test<br />AI Models Seamlessly
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Instantly compare outputs, features, and pricing of the world&apos;s most advanced AI language models side-by-side. Make smarter decisions for your projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="min-w-[200px]">
            <Link href="/compare">Start Comparing Models</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="min-w-[200px]">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 