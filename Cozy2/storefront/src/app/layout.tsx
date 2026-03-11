import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { CartProvider } from "@/lib/context/cart-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import { SlideOutCart } from "@/components/cart/slide-out-cart";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { StitchHeader } from "@/components/layout/stitch-header";
import { StitchFooter } from "@/components/layout/stitch-footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cozy2",
  description: "Copenhagen Curiosities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <div className="relative flex h-auto min-h-screen w-full flex-col">
              <StitchHeader />
              {children}
              <StitchFooter />
            </div>
            <SlideOutCart />
            <CookieConsent />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
