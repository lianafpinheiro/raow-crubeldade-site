import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IMPASTO OS — Material Generator',
  description: 'Generate impasto texture systems from reference images',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
