/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: "http://localhost:3000/",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/login/*", "/signup/*"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/login", "/signup"],
      },
    ],
  },
};

export default sitemapConfig;
