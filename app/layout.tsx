import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/providers/Providers'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lankaproducts.com'),
  title: {
    default: 'Lanka Products - Authentic Sri Lankan Products Delivered Worldwide',
    template: '%s | Lanka Products',
  },
  description:
    'Discover authentic Sri Lankan products — Ceylon spices, artisan handicrafts, vintage heritage items, and curated gift boxes. Delivered to USA, Canada, Australia, UK, and Netherlands.',
  keywords: [
    'Sri Lankan products',
    'Ceylon spices',
    'authentic cinnamon',
    'Sri Lankan handicrafts',
    'Ceylon tea',
    'Sri Lanka gifts',
    'buy Sri Lankan products online',
  ],
  authors: [{ name: 'Lanka Products' }],
  creator: 'Lanka Products',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lankaproducts.com',
    siteName: 'Lanka Products',
    title: 'Lanka Products - Authentic Sri Lankan Products',
    description:
      'Discover authentic Sri Lankan products delivered worldwide. Ceylon spices, handicrafts, and gift boxes.',
    images: [
      {
        url: 'https://lankaproducts.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lanka Products - From the Gardens of Ceylon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lanka Products - Authentic Sri Lankan Products',
    description: 'Discover authentic Sri Lankan products delivered worldwide.',
    images: ['https://lankaproducts.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
