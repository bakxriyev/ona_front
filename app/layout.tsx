import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "../components/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
})

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
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
