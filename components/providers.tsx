"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import SessionManager from "@/components/session-manager"
import { UserProvider } from "@/context/user-context" // <--- Import UserProvider

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
        {/* Wrap children with UserProvider so components can access user data */}
        <UserProvider>
          {children}
        </UserProvider>
      </SessionManager>
    </PrivyProvider>
  )
}