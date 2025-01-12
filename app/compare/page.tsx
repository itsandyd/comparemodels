import { ComparisonWrapper } from '@/components/compare/comparison-wrapper'

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-4">
            Compare AI Models Side by Side
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make informed decisions by comparing the capabilities, performance, and features of leading AI models in real-time.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <ComparisonWrapper />
        </div>
      </main>
    </div>
  )
}

