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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Amblify",
                "alternateName": "Abhinav - Best Digital Marketer in Kerala",
                "url": "https://workwithabhinav.com",
                "logo": "https://workwithabhinav.com/logo.png",
                "image": "https://workwithabhinav.com/og-image.jpg",
                "description": "Best Digital Marketer and Web Designing Consultant in Kerala specializing in 3D websites and SEO.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Kollam",
                  "addressRegion": "Kerala",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "8.8932",
                  "longitude": "76.6141"
                },
                "priceRange": "$$",
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  "opens": "09:00",
                  "closes": "20:00"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Digital Marketing and Web Design",
                "provider": {
                  "@type": "LocalBusiness",
                  "name": "Amblify"
                },
                "areaServed": {
                  "@type": "State",
                  "name": "Kerala"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Digital Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Search Engine Optimization (SEO)"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "3D Web Design & Development"
                      }
                    }
                  ]
                }
              }
            ])
          }}
        />
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
