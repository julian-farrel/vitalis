"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Wallet } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const { login, ready, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      // Set the session flag so user stays logged in on refresh
      sessionStorage.setItem("vitalis_session_active", "true")
      
      // Check if user has finished onboarding
      const isOnboarded = localStorage.getItem("vitalis_onboarding_complete")
      
      if (isOnboarded === "true") {
        router.push("/dashboard")
      } else {
        router.push("/onboarding")
      }
    }
  }, [ready, authenticated, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl shadow-xl">
             <Image 
               src="/vitalis.jpeg" 
               alt="Vitalis Logo"
               fill
               className="object-cover"
             />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to Vitalis
          </h1>
          <p className="text-muted-foreground text-lg">
            Your decentralized medical identity. <br/>
            Secure, patient-owned, and verifiable.
          </p>
        </div>

        <Card className="border-border bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6 pb-6 flex flex-col gap-4">
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary mb-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">HIPAA Compliant & Encrypted</span>
            </div>

            <Button 
              size="lg" 
              className="w-full h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
              onClick={login}
              disabled={!ready || authenticated}
            >
              {!ready ? (
                "Initializing..."
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet to Sign In
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-2">
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}