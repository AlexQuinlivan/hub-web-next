/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      // Proxy Storypark v3 through a rewrite with an additional auth header attached via `middleware.ts`
      {
        source: "/api/v3/:path*",
        destination: `${process.env.STORYPARK_API_V3_BASE_URL}/:path*`
      }
    ]
  },
  env: {
    NEXT_PUBLIC_REFRESH_SESSION_INTERVAL_SEC: (5 * 60) // 5 minute session interval check
  }
}

module.exports = nextConfig
