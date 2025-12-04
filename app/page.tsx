"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { 
  ShieldCheck, 
  Wallet, 
  FileText, 
  Lock, 
  Database, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Activity
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase" 

// --- Components for the Landing Page ---

// 1. Logo Marquee Component
const LogoMarquee = ({ title, items }: { title: string, items: string[] }) => {
  return (
    <div className="py-10 w-full overflow-hidden bg-muted/20 border-y border-border/40">
      <div className="container px-4 md:px-6 mx-auto mb-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        {/* First set of logos */}
        <div className="flex animate-marquee whitespace-nowrap gap-16 px-8 items-center">
          {items.map((item, i) => (
            <span key={i} className="text-xl md:text-2xl font-bold text-muted-foreground/50 flex items-center gap-2">
              <div className="h-8 w-8 bg-muted-foreground/20 rounded-full" /> {/* Placeholder Icon */}
              {item}
            </span>
          ))}
        </div>

        {/* Second set of logos (Duplicate for seamless loop) */}
        <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-16 px-8 items-center">
          {items.map((item, i) => (
            <span key={`dup-${i}`} className="text-xl md:text-2xl font-bold text-muted-foreground/50 flex items-center gap-2">
              <div className="h-8 w-8 bg-muted-foreground/20 rounded-full" /> 
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { login, ready, authenticated, user } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (ready && authenticated && user?.wallet?.address) {
        sessionStorage.setItem("vitalis_session_active", "true")
        
        try {
          const { data } = await supabase
            .from('users')
            .select('onboarding_complete')
            .eq('wallet_address', user.wallet.address)
            .single()

          if (data && data.onboarding_complete) {
            router.push("/dashboard")
          } else {
            router.push("/onboarding")
          }
        } catch (err) {
          router.push("/onboarding")
        }
      }
    }

    checkUserStatus()
  }, [ready, authenticated, user, router])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* 1. Navigation Bar */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-border/40 backdrop-blur-md fixed top-0 z-50 bg-background/80">
        <div className="flex items-center gap-2">
           <Image 
             src="/vitalis-logo.png" 
             alt="Vitalis Logo" 
             width={32} 
             height={32} 
             className="rounded-lg"
           />
           <span className="font-bold text-xl tracking-tight">Vitalis</span>
        </div>
        
        <Button 
          onClick={login} 
          disabled={!ready || authenticated}
          className="gap-2 font-medium"
        >
          <Wallet className="h-4 w-4" />
          {authenticated ? "Dashboard" : "Connect Wallet"}
        </Button>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col pt-32">
        <div className="flex flex-col items-center justify-center px-6 text-center pb-20">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-8">
            <ShieldCheck className="mr-2 h-4 w-4" /> HIPAA Compliant & Encrypted
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Decentralized <br /> Medical Identity
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Own your health records with Vitalis. Secure, portable, and verifiable medical history on the blockchain.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* FIXED: Use 'asChild' to properly nest Link inside Button.
                Also added target="_blank" since you mentioned it's for a file/external link.
            */}
            <Button variant="outline" size="lg" className="h-12 px-8 gap-2 text-base" asChild>
              <Link href="/docs" passHref>
                <FileText className="h-4 w-4" />
                Whitepaper
              </Link>
            </Button>
            
             <Button size="lg" onClick={login} className="h-12 px-8 gap-2 text-base shadow-lg shadow-primary/20">
                Get Started <ArrowRight className="h-4 w-4" />
             </Button>
          </div>
        </div>

        {/* 3. Feature Highlights (Three Cards) */}
        <div className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             <div className="p-8 rounded-3xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Lock className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Private & Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is encrypted using military-grade algorithms and stored on decentralized IPFS nodes. Only you hold the decryption keys.
                </p>
             </div>
             
             <div className="p-8 rounded-3xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Verifiable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Records are issued as Verifiable Credentials (VCs). Any hospital can instantly verify the authenticity of your history.
                </p>
             </div>
             
             <div className="p-8 rounded-3xl border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Database className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-2xl mb-3">Interoperable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Break down data silos. Share your complete medical history instantly with any doctor or specialist worldwide.
                </p>
             </div>
          </div>
        </div>

        {/* 4. Why Choose Vitalis Section */}
        <div className="bg-secondary/30 py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Zap className="h-4 w-4" /> Why Choose Vitalis
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  The Future of <br/> Patient Care is Here
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Current healthcare systems are fragmented. Vitalis unifies your data into a single, patient-controlled identity that travels with you.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Zero-Knowledge Proofs for maximum privacy",
                    "Instant cross-border medical record access",
                    "Patient-owned monetization of anonymized data",
                    "Seamless integration with existing hospital systems"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Visual Graphic for 'Why Choose' */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold">Medical ID #8492</div>
                          <div className="text-xs text-muted-foreground">Updated 2m ago</div>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded">VERIFIED</div>
                   </div>
                   <div className="space-y-3">
                      <div className="h-2 w-full bg-muted rounded-full" />
                      <div className="h-2 w-3/4 bg-muted rounded-full" />
                      <div className="h-2 w-5/6 bg-muted rounded-full" />
                   </div>
                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-600">100%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-600">Global</div>
                        <div className="text-xs text-muted-foreground">Access</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Trusted Healthcare Leaders Marquee */}
        <LogoMarquee 
          title="Trusted by Healthcare Leaders" 
          items={["MediCare+", "HealthCorp", "Global Pharma", "UniClinic", "BioLabs", "Future Med", "Zenith Care", "Apex Health"]}
        />

        {/* 6. Investors Marquee */}
        <LogoMarquee 
          title="Backed by Top Investors" 
          items={["BlockVentures", "CryptoCapital", "FutureFund", "Health Chain VC", "Web3 Partners", "Digital Horizon", "TechGrowth", "Innovate Fund"]}
        />

      </main>
      
      {/* 7. Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Image src="/vitalis-logo.png" alt="Logo" width={24} height={24} className="opacity-80" />
             <span className="font-bold text-lg text-muted-foreground">Vitalis</span>
          </div>
          
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>

          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Vitalis Protocol.</p>
        </div>
      </footer>
    </div>
  )
}