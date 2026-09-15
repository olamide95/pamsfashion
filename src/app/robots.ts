import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pamsfashionacademy.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/student/", "/admin/", "/login", "/register", "/forgot-password"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
