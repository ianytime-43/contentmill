import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://contentmill.app";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app", "/api"] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
