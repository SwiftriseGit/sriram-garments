import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SriRam Garments — Quality Garments for Every You",
  description:
    "Shop premium quality shirts, t-shirts, jeans, ethnic wear and more at SriRam Garments. Comfortable, stylish and affordable clothing for men, women, and kids.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <div className="min-h-screen bg-white text-zinc-950 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
