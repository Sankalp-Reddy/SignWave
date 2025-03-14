import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "SignWave - Create Beautiful Signatures",
  description: "Transform your name into a beautiful, personalized signature with our easy-to-use designer",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat&family=Cinzel&family=Cormorant+Garamond&family=Cormorant+Upright&family=Dancing+Script&family=Great+Vibes&family=Indie+Flower&family=Kaushan+Script&family=Lobster&family=Montserrat&family=Pacifico&family=Parisienne&family=Patrick+Hand&family=Permanent+Marker&family=Petit+Formal+Script&family=Pinyon+Script&family=Playfair+Display&family=Playfair+Display+SC&family=Poppins&family=Raleway&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Tangerine&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'