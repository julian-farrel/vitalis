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
  Activity,
  Globe,
  Fingerprint
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase" 

// --- Components ---

// 1. Logo Marquee Component (Refined)
const LogoMarquee = ({ title, items }: { title: string, items: string[] }) => {
  return (
    <div className="py-12 w-full overflow-hidden border-y border-border/50 bg-secondary/20 backdrop-blur-sm">
      <div className="container px-4 md:px-6 mx-auto mb-8 text-center">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {title}
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden group mask-gradient">
        {/* First set of logos */}
        <div className="flex animate-marquee whitespace-nowrap gap-20 px-10 items-center">
          {items.map((item, i) => (
            <span key={i} className="text-xl font-bold text-foreground/40 flex items-center gap-3 hover:text-primary transition-colors cursor-default">
              <div className="h-2 w-2 bg-primary/40 rounded-full" />
              {item}
            </span>
          ))}
        </div>

        {/* Second set of logos (Duplicate for seamless loop) */}
        <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap gap-20 px-10 items-center">
          {items.map((item, i) => (
            <span key={`dup-${i}`} className="text-xl font-bold text-foreground/40 flex items-center gap-3 hover:text-primary transition-colors cursor-default">
              <div className="h-2 w-2 bg-primary/40 rounded-full" /> 
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

  // --- Functional Logic (Unchanged) ---
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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* 1. Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
             <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/20">
                <Image 
                  src="/vitalis-logo.png" 
                  alt="Vitalis Logo" 
                  fill
                  className="object-cover"
                />
             </div>
             <span className="font-bold text-lg tracking-tight">Vitalis</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Documentation link removed from here */}
            <Button 
              onClick={login} 
              disabled={!ready || authenticated}
              size="sm"
              className="gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              <Wallet className="h-4 w-4" />
              {authenticated ? "Go to Dashboard" : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-32 overflow-hidden">
        
        {/* 2. Hero Section */}
        <section className="relative px-6 pb-24 md:pb-32 lg:pb-40">
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />
          
          <div className="container mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md">
              <ShieldCheck className="mr-2 h-4 w-4" /> 
              Fully Encrypted
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 mb-8 max-w-5xl leading-[1.1]">
              Your Medical Identity, <br className="hidden md:block" />
              <span className="text-primary">Decentralized.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed text-balance">
              Secure, portable, and patient-owned health records. 
              Vitalis leverages Zero-Knowledge Proofs to give you complete control over your medical history on the blockchain.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
               <Button 
                 size="lg" 
                 onClick={login} 
                 className="h-14 px-8 w-full sm:w-auto text-base gap-2 rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
               >
                  Get Started Now <ArrowRight className="h-4 w-4" />
               </Button>
               
               <Button 
                 variant="outline" 
                 size="lg" 
                 className="h-14 px-8 w-full sm:w-auto text-base gap-2 rounded-full border-primary/20 bg-background/50 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300" 
                 asChild
               >
                {/* Updated to link to Google Drive */}
                <Link 
                  href="https://drive.google.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4" />
                  Read Whitepaper
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* 3. Feature Highlights (Bento Style) */}
        <section className="container mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
             {/* Card 1 */}
             <div className="group relative overflow-hidden p-8 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Lock className="h-32 w-32 -rotate-12" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">Private by Design</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Your data is encrypted using military-grade algorithms. Only you hold the decryption keys, ensuring no unauthorized access ever occurs.
                </p>
             </div>
             
             {/* Card 2 */}
             <div className="group relative overflow-hidden p-8 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShieldCheck className="h-32 w-32 -rotate-12" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">Instantly Verifiable</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Records are issued as Verifiable Credentials (VCs). Hospitals can instantly verify the authenticity of your history without contacting previous providers.
                </p>
             </div>
             
             {/* Card 3 */}
             <div className="group relative overflow-hidden p-8 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="h-32 w-32 -rotate-12" />
                </div>
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">Global Interoperability</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Break down data silos. Whether you are in Tokyo or New York, share your complete medical history instantly with any specialist.
                </p>
             </div>
          </div>
        </section>

        {/* 4. Why Choose Vitalis Section */}
        <section className="bg-secondary/30 border-y border-border/50 py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content */}
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8">
                  <Zap className="h-4 w-4" /> Why Choose Vitalis
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                  The Future of <br/> Patient Care is Here
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  Current healthcare systems are fragmented and siloed. Vitalis unifies your data into a single, patient-controlled identity that travels with you everywhere.
                </p>
                
                <div className="space-y-6">
                  {[
                    "Zero-Knowledge Proofs for maximum privacy",
                    "Instant cross-border medical record access",
                    "Patient-owned monetization of anonymized data",
                    "Seamless integration with existing hospital systems"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Visual Graphic - Digital Card */}
              <div className="order-1 lg:order-2 relative perspective-1000 group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[3rem] blur-[80px] -z-10 group-hover:blur-[100px] transition-all duration-700" />
                
                <div className="relative bg-gradient-to-br from-background to-secondary border border-white/20 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl rotate-y-12 hover:rotate-y-0 hover:scale-[1.02] transition-all duration-700 ease-out transform-gpu">
                   {/* Card Header */}
                   <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                          <Activity className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Vitalis ID</div>
                          <div className="text-xs text-muted-foreground font-mono">DID:ETH:0x71...9A2</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        VERIFIED
                      </div>
                   </div>

                   {/* Card Body - Abstract Data Lines */}
                   <div className="space-y-4 mb-12">
                      <div className="h-2 w-3/4 bg-gradient-to-r from-muted to-transparent rounded-full" />
                      <div className="h-2 w-1/2 bg-gradient-to-r from-muted to-transparent rounded-full" />
                      <div className="h-2 w-full bg-gradient-to-r from-muted to-transparent rounded-full" />
                   </div>

                   {/* Card Footer - Stats */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-2xl border border-white/10 text-center hover:bg-background/80 transition-colors">
                        <div className="text-2xl font-bold text-primary">100%</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Uptime</div>
                      </div>
                      <div className="p-4 bg-background/50 rounded-2xl border border-white/10 text-center hover:bg-background/80 transition-colors">
                        <div className="text-2xl font-bold text-indigo-500">Global</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Access</div>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Marquees */}
        <LogoMarquee 
          title="Trusted by Healthcare Leaders" 
          items={["MediCare+", "HealthCorp", "Global Pharma", "UniClinic", "BioLabs", "Future Med", "Zenith Care", "Apex Health"]}
        />

        <div className="h-px w-full bg-border/50" />

        <LogoMarquee 
          title="Backed by Top Investors" 
          items={["BlockVentures", "CryptoCapital", "FutureFund", "Health Chain VC", "Web3 Partners", "Digital Horizon", "TechGrowth", "Innovate Fund"]}
        />

      </main>
      
      {/* 6. Footer */}
      <footer className="py-16 px-6 border-t border-border bg-card">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                 <Image src="/vitalis-logo.png" alt="Logo" width={20} height={20} className="opacity-90" />
               </div>
               <span className="font-bold text-xl tracking-tight">Vitalis Medical</span>
            </div>
            
            <nav className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors hover:underline underline-offset-4">Contact Support</Link>
            </nav>
          </div>
          
          <div className="mt-12 text-center md:text-left text-sm text-muted-foreground/60">
            <p>&copy; {new Date().getFullYear()} Vitalis Medical. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}