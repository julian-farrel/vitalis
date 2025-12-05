import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Providers from "@/components/providers"

export const metadata: Metadata = {
  title: "Vitalis",
  description: "Blockchain-Based Medical Record Dashboard",
  generator: "v0.app",
  icons: {
    icon: "/vitalis.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrap children with Providers */}
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}