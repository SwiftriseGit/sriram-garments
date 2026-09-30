import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteLoader from "@/components/SiteLoader";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
