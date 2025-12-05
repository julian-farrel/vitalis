"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import SessionManager from "@/components/session-manager"
import { UserProvider } from "@/context/user-context"

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
        loginMethods: ['wallet'],
      }}
    >
      <SessionManager>
        <UserProvider>
          {children}
        </UserProvider>
      </SessionManager>
    </PrivyProvider>
  )
}