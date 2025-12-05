"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"

export default function SessionManager({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, logout } = usePrivy()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (ready) {
      const isSessionActive = sessionStorage.getItem("vitalis_session_active")

      if (authenticated && !isSessionActive) {
        logout().then(() => {
          setIsChecking(false)
        })
      } else {
        setIsChecking(false)
      }
    }
  }, [ready, authenticated, logout])

  if (isChecking) {
    return null
  }

  return <>{children}</>
}