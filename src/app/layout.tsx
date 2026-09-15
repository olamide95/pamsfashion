import type { Metadata } from "next";
import { AuthProvider } from "@/hooks/useAuth";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pamsfashionacademy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pam's Fashion Academy — Unleash Your Fashion Potential",
    template: "%s | Pam's Fashion Academy",
  },
  description:
    "Pam's Fashion Academy nurtures creativity and skill in fashion design, sewing, branding and business — through hands-on classes and an online school.",
  openGraph: {
    title: "Pam's Fashion Academy",
    description:
      "Transform your passion for fashion into a career. Explore courses, join the online school, and apply today.",
    url: siteUrl,
    siteName: "Pam's Fashion Academy",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pam's Fashion Academy",
    description: "Unleash your fashion potential — courses, online school, mentorship.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-ivory text-charcoal">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
