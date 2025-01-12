'use client'

import dynamic from 'next/dynamic'

const ModelComparison = dynamic(
  () => import('./model-comparison'),
  { ssr: false }
)

export function ComparisonWrapper() {
  return <ModelComparison />
} 