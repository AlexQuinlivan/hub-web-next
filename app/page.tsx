"use client";

import {ChildrenList} from "@/app/modules/children/components/ChildrenList";
import {AuthedHttpClient} from "@/app/utilities/http/HttpClient";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import {signIn, useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {container} from "tsyringe";

type User = {
  id: string,
  display_name: string
}
type UserResponse = {
  user: User
}
export default function Home() {
  const [userState, setUserState] = useState<UserResponse | null>(null)
  const session = useSession()
  const httpClient = container.resolve(AuthedHttpClient)

  useEffect(() => {
    async function fetchMe() {
      try {
        const { data } = await httpClient.get<UserResponse>("/api/v3/users/me")

        setUserState(data)
      } catch (e) {
        if (e instanceof Response) {
          if (e.status == 401) {
            // Logout the user and redirect to the login page
          } else {
            // hmmm
          }
        } else {
          /// uuuuuhhhhh
        }
      }
    }

    if (session.status == "authenticated") {
      (async () => {
        await fetchMe()
      })();
    }
    const intervalId = setInterval(async () => {
      if (session.status == "authenticated") {
        await fetchMe()
      }
    }, 5000) // in milliseconds
    return () => clearInterval(intervalId)
  }, [session, httpClient])

  return (
    <main>

      <div style={{width: '100%'}}>
        <Box
          component="span"
          sx={{
            display: 'block',
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
          }}
        >
          Hello frum alegs
        </Box>
      </div>

      <div style={{width: '100%'}}>
        <Box
          component="div"
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            maxLines: "1",
            maxWidth: "500px",
            fontFamily: "monospace",
            whiteSpace: "pre-line"
          }}
        >
          API v3 user:<br/>
          {JSON.stringify(userState, null, 2).split("\n").slice(0, 15).join("\n")}
        </Box>
        <Box
          component="div"
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            maxLines: "1",
            maxWidth: "500px",
            fontFamily: "monospace",
            whiteSpace: "pre-line"
          }}
        >
          SP-HUB-WEB Session state:<br/>
          {session.status}<br/>
          Look ma! No tokens on the client!
        </Box>
      </div>

      <LoadingButton sx={{margin: "10px"}} loading={session.status == "loading"} color="success" variant="contained"
                     size="large" onClick={() => signIn(process.env.NEXT_PUBLIC_STORYPARK_OIDC_PROVIDER_ID)}>
        Sign in
      </LoadingButton>


      <Box
        component="div"
        sx={{
          p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          maxLines: "1",
          maxWidth: "500px",
          fontFamily: "monospace",
          whiteSpace: "pre-line"
        }}
      >
        <ChildrenList/>
      </Box>


    </main>
  )
}
