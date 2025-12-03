"use client"

import { 
  Shield, 
  LogOut, 
  Laptop,
  CheckCircle2,
  Copy,
  MapPin,
  Phone,
  Wallet,
  QrCode,
  ExternalLink,
  KeyRound,
  Lock,
  Database,
  Globe,
  Server,
  FileCheck,
  ShieldCheck,
  Activity
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { logout } = usePrivy()
  const router = useRouter()

  const handleDisconnect = async () => {
    await logout()
    sessionStorage.removeItem("vitalis_session_active")
    router.push("/")
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <VitalisSidebar activeItem="Settings" />
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your digital identity and view security status.</p>
            </div>
          </div>

          {/* ... Rest of your UI components ... */}
          {/* Re-use the card structures from your previous code for UI consistency */}
          
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 hover:bg-destructive/10 hover:border-destructive/40">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full border border-destructive/10 shadow-sm">
                   <KeyRound className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">Disconnect Wallet</h3>
                  <p className="text-sm text-muted-foreground">This will lock your local vault and prevent further signing.</p>
                </div>
             </div>
             <Button 
                variant="destructive" 
                className="gap-2 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-lg hover:bg-red-600"
                onClick={handleDisconnect}
             >
                <LogOut className="h-4 w-4" /> Disconnect
             </Button>
          </div>

        </div>
      </main>
    </div>
  )
}