/** @type {import('next').NextConfig} */
const nextConfig = {
  // !!!(alex): For now, we're disabling the rewrite as in production this rewrite proxy drops auth header
  // when using middleware's rewrite for some reason. In local it'll work, you can just perform a NextResponse.next
  // with the expected header and it'll continue on. For now we're leaning entirely on middleware to proxy the
  // rewrite.
  //
  // rewrites() {
  //   return [
  //     // Proxy Storypark v3 through a rewrite with an additional auth header attached via `middleware.ts`
  //     {
  //       source: "/api/v3/:path*",
  //       destination: `${process.env.STORYPARK_API_V3_BASE_URL}/:path*`
  //     }
  //   ]
  // },
  //


}

module.exports = nextConfig
