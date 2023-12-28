import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/Toaster'

import '@/styles/globals.css'
import 'react-loading-skeleton/dist/skeleton.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Quill | Chatta con i tuoi PDF',
  description: 'Quill ti permette di conversare con i tuoi file pdf',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='it'>
      <body className={cn(inter.className, 'min-h-screen antialiased grainy')}>
        <Providers>
          <Navbar />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  )
}
