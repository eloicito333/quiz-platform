import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IntelliTest',
  description: 'Generated exams with AI and correct them with just a click',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={
        cn(inter.className, 'antialiased min-h-screen pt-16')
      }>
        <Providers>
          <header>
           <Navbar/>
          </header>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
