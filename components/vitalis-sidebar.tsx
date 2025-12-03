"use client"

import { Home, FileText, Wallet, ShieldCheck, BookOpen, Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePrivy } from "@privy-io/react-auth"
import { useUser } from "@/context/user-context" // <--- Import Context

const navItems = [
  { icon: Home, label: "Home", url: "/" },
  { icon: FileText, label: "Medical Record", url: "/medical-record" },
  { icon: Wallet, label: "DID Wallet", url: "/did-wallet" },
  { icon: ShieldCheck, label: "Data Consent", url: "/data-consent" },
  { icon: BookOpen, label: "Docs", url: "/docs" },
  { icon: Settings, label: "Settings", url: "/setting" },
]

interface VitalisSidebarProps {
  activeItem?: string
  onNavigate?: (item: string) => void
}

export function VitalisSidebar({ activeItem = "Home" }: VitalisSidebarProps) {
  const { user } = usePrivy()
  const { userData } = useUser() // <--- Get live data from context!

  const walletAddress = user?.wallet?.address
  const formattedAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-5)}`
    : "Connecting..."

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5">
         <Image 
          src="/vitalis-logo.png"   
          alt="Vitalis Logo" 
          width={70}                
          height={70} 
          className="rounded-lg"    
         />
         <span className="text-xl font-semibold tracking-tight text-sidebar-foreground">Vitalis</span>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="px-4 py-5">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          
          <div className="flex items-start justify-between">
            <div className="overflow-hidden"> {/* Added overflow hidden container */}
              <h3 className="font-semibold text-lg text-foreground truncate block" title={`${userData.firstName} ${userData.lastName}`}>
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-xs text-muted-foreground truncate block" title={userData.email}>
                {userData.email}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Blood Type:</span>
              <span className="font-medium text-foreground">{userData.bloodType}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">DOB:</span>
              <span className="font-medium text-foreground">{userData.dob}</span>
            </div>
          </div>

          <Separator className="my-4 bg-blue-200" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Address:</span>
            <span 
              className="text-blue-600 font-mono truncate cursor-help" 
              title={walletAddress || "No wallet connected"}
            >
              {formattedAddress}
            </span>
          </div>

        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            return (
              <li key={item.label}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "transition-all duration-300 ease-out",
                    "hover:translate-x-1",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:ring-1 hover:ring-primary/30"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <div className={`h-2 w-2 rounded-full ${walletAddress ? 'bg-primary animate-pulse' : 'bg-red-400'}`} />
          <span className="text-xs font-medium text-primary">
            {walletAddress ? 'Blockchain Connected' : 'Wallet Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  )
}