import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "../components/providers"
import "./globals.css"


export const metadata: Metadata = {
  title: "Ona-bola Hospital",
  description: "O`zbekistondagi eng yirik ko'p tarmoqli klinika",
  icons: {
    icon: "/logo.jpg",
  },
  generator: "IT ZONE",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
