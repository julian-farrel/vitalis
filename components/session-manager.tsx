"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"

export default function SessionManager({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, logout } = usePrivy()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Only run this logic when Privy is fully loaded
    if (ready) {
      const isSessionActive = sessionStorage.getItem("vitalis_session_active")

      // If user is authenticated but there is no session flag (fresh tab/window),
      // force them to log out so they must sign in again.
      if (authenticated && !isSessionActive) {
        logout().then(() => {
          setIsChecking(false)
        })
      } else {
        setIsChecking(false)
      }
    }
  }, [ready, authenticated, logout])

  // Prevent the app from rendering (and potentially redirecting) until we've checked the session
  if (isChecking) {
    return null // or return <div className="min-h-screen bg-background" /> for a blank loading state
  }

  return <>{children}</>
}