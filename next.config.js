/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    // Legacy hardcoded collection URLs → new dynamic /c/:slug route.
    // Collection slugs are admin-managed in the Categories table, so
    // these specific redirects only cover the four seeded defaults.
    // New collections are already reachable via /c/:slug.
    return [
      { source: "/models", destination: "/c/models", permanent: true },
      { source: "/scenes", destination: "/c/scenes", permanent: true },
      { source: "/sets", destination: "/c/sets", permanent: true },
      { source: "/textures", destination: "/c/textures", permanent: true },
    ];
  },
};
module.exports = nextConfig;
