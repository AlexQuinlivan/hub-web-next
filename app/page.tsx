"use client";
import {useSession} from "next-auth/react";
import Image from 'next/image'
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from './page.module.css'

export default function Home() {
  const [userState, setUserState] = useState({user: null})
  const session = useSession()

    useEffect(() => {
      async function fetchMe() {
        try {
          const response = await fetch("/api/v3/users/me", {
            headers: {
              "Accept": "application/json",
              // @ts-ignore
              "Authorization": `Bearer ${session.data!.access_token as string}`
            },
          })

          if (response.ok) {
            setUserState({ user: (await response.json()).user })
          } else {
            setUserState({ user: null })
            console.log(`Response not ok ${response.status}`)
          }
        } catch (e) {
          // Logout the user and redirect to the login page
        }
      }

      const intervalId = setInterval(async () => {
        if (session.status == "authenticated") {
          await fetchMe()
        }
      }, 1000 * 5) // in milliseconds
      return () => clearInterval(intervalId)
    }, [session])

  return (
    <main className={styles.main}>

      <div className={styles.description}>
        <p style={{
          width: "500px",
          whiteSpace: "pre-line"
        }}>{JSON.stringify(userState, null, 2).split("\n").slice(0, 15).join("\n")}</p>

        <p style={{
          width: "500px",
          whiteSpace: "pre-line"
        }}>{JSON.stringify(session.data, null, 2)}</p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <Link href={{
        pathname: "/api/auth/signin"
      }}>
        <button>
          sign in

        </button>
      </Link>

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
