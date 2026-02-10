import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";
import {
  Header,
  Footer,
  SaleBar,
  CartSidebar,
  SearchModal,
} from "@/components/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chikan Stop - Buy Lucknow's famous and trending chikankari",
  description: "Shop the latest trends in fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SaleBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
          <SearchModal />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
