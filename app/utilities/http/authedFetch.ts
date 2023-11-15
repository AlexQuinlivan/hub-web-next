export async function authedFetch(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init)
  if (response.status == 401) {
    const sessionResponse = await fetch("/api/auth/session?force_refresh=true")
    if (sessionResponse.status >= 400 && sessionResponse.status <= 499) {
      // todo(alex): do signout
      throw "AuthError"
    }

    // replay initial request
    return await authedFetch(input, init)
  }

  return response
}