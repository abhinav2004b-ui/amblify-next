import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://workwithabhinav.com'),
  title: "Best Digital Marketer in Kerala | Web Designing Consultant",
  description: "Transform your business with Abhinav, the best digital marketer in Kerala. Specializing in SEO, high-performance 3D websites, and ROI-driven marketing strategies.",
  openGraph: {
    title: "Best Digital Marketer in Kerala | Web Designing Consultant",
    description: "Transform your business with Abhinav, the best digital marketer in Kerala. Specializing in SEO, high-performance 3D websites, and ROI-driven marketing strategies.",
    url: "https://workwithabhinav.com",
    siteName: "Amblify",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Amblify Digital Marketing & Web Design",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Digital Marketer in Kerala | Web Designing Consultant",
    description: "Transform your business with Abhinav, the best digital marketer in Kerala. Specializing in SEO, high-performance 3D websites, and ROI-driven marketing strategies.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
