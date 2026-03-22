import { ReactNode } from 'react'

// This is a catch-all route for SPA-style client-side routing
// It allows static export while supporting dynamic routes
export async function generateStaticParams() {
  return [
    { slug: [] }, // Root fallback
  ]
}

export default function CatchAllPage({ params }: { params: { slug: string[] } }): ReactNode {
  // Return the main layout/app shell which handles client-side routing
  // The actual page content will be rendered client-side based on the URL
  return null
}
