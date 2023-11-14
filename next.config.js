/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/api/v3/:path*",
        destination: "https://clone.storypark.com/api/v3/:path*"
      }
    ]
  },
  env: {
    // REFRESH_SESSION_INTERVAL_SEC: (5 * 60) // 5 minute session interval check
  }
}

module.exports = nextConfig
