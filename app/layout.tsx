import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { AppSidebar } from "@/components/layout/AppSidebar"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Miroir — 日记教练",
  description: "一个反思优先、AI 教练驱动的日记应用。不是更好的笔记工具，而是内置了反思框架的日记教练。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex">
        <ThemeProvider>
          <TooltipProvider delay={300}>
            <AppSidebar />
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-3xl px-6 py-8 md:py-12">
                {children}
              </div>
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
