import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { AuthProvider } from "@/lib/auth";
import { CurrencyProvider } from "@/lib/currency";
import { QueryProvider } from "@/lib/query-provider";
import SentryInit from "@/components/SentryInit";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Lexxus — Premium Digital Products Marketplace",
  description:
    "Buy premium 3D models, scenes, textures and digital assets from world-class brands.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <CurrencyProvider>
              <CartProvider>
                <WishlistProvider>
                  <SentryInit />
                  <Header />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <Toaster position="bottom-right" toastOptions={{ style: { fontSize: 13 } }} />
                </WishlistProvider>
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
