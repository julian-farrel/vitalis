"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import SessionManager from "@/components/session-manager"
import { UserProvider } from "@/context/user-context" // <--- 1. Import this

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/vitalis-logo.png",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        loginMethods: ['wallet', 'email', 'google'],
      }}
    >
      <SessionManager>
        {/* 2. Wrap {children} with UserProvider here */}
        <UserProvider>
          {children}
        </UserProvider>
      </SessionManager>
    </PrivyProvider>
  )
}