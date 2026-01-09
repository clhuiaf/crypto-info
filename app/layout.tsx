import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'CryptoCompare HK - Compare Crypto Exchanges',
  description: 'Compare crypto exchanges for new and retail traders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-slate-50">
          {children}
        </main>
      </body>
    </html>
  )
}


