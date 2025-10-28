import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Survey App',
  description: 'Simple survey application for testing Coolify deployment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

