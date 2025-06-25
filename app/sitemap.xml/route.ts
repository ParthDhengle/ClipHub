// app/sitemap.xml/route.ts

export async function GET() {
  const baseUrl = "https://cliphub.in";

  const staticPages = [
    "",
    "/join",
    "/upload",
    "/audio",
    "/video",
    "/photo",
    "/dashboard",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map((page) => {
        return `
        <url>
          <loc>${baseUrl}${page}</loc>
        </url>`;
      })
      .join("")}
  </urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
