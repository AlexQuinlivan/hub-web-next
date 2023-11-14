"use client";
import {signIn, useSession} from "next-auth/react";
import Image from 'next/image'
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from './page.module.css'

async function authedFetch(
  input: NodeJS.fetch.RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init)
  if (response.status == 401) {
    const sessionResponse = await fetch("/api/auth/session?force_refresh=true")
    if (sessionResponse.status >= 400 || sessionResponse.status <= 499) {
      // todo(alex): do signout
      throw "AuthError"
    }

    // replay initial request
    return await authedFetch(input, init)
  }

  return response
}

export default function Home() {
  const [userState, setUserState] = useState({user: null})
  const session = useSession()

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await authedFetch("/api/v3/users/me", {
          headers: {
            "Accept": "application/json",
          },
        })

        if (response.ok) {
          setUserState({user: (await response.json()).user})
        } else {
          setUserState({user: null})
          console.log(`Response not ok ${response.status}`)
        }
      } catch (e) {
        // Logout the user and redirect to the login page
      }
    }

    (async () => {
      await fetchMe()
    })();
    const intervalId = setInterval(async () => {
      if (session.status == "authenticated") {
        await fetchMe()
      }
    }, 5000) // in milliseconds
    return () => clearInterval(intervalId)
  }, [session])

  return (
    <main className={styles.main}>

      Hello frum alegs

      <div className={styles.description}>
        <p style={{
          width: "500px",
          whiteSpace: "pre-line"
        }}>
          API v3 user:<br/>
          {JSON.stringify(userState, null, 2).split("\n").slice(0, 15).join("\n")}
        </p>

        <p style={{
          width: "500px",
          whiteSpace: "pre-line"
        }}>SP-HUB-WEB Session state:<br/>
          {session.status}<br/>
          Look ma! No tokens on the client!
        </p>
      </div>

        <button style={{
          padding: "6px 10px 6px 10px"
        }} onClick={() => signIn(process.env.NEXT_PUBLIC_STORYPARK_OIDC_PROVIDER_ID)}>
          sign in

        </button>
    </main>
  )
}
