import {getToken} from "next-auth/jwt";
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // This request needs to be forwarded to the Storypark, along with a bearer access token
  if (pathname.startsWith("/api/v3")) {
    const session = await getToken({req: request})
    if (session == null) {
      return NextResponse.json({
        error: "AuthErrorNoToken",
      }, {
        status: 401,
        statusText: "Unauthorized"
      })
    }

    const headers = new Headers(request.headers)
    headers.set("Authorization", `Bearer ${session.access_token}`)
    headers.set("X-Application-Id", "sp-hub-web")
    request.nextUrl.href = `${process.env.STORYPARK_API_V3_BASE_URL}${pathname.replace("/api/v3", "")}`

    return NextResponse.rewrite(
      request.nextUrl,
      {
        request: {
          headers: headers
        }
      })
  }

  // Just continue without mutation
  return NextResponse.next()
}

export const config = {
  matcher: '/api/v3/:path*',
}
