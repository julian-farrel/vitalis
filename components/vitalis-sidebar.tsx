"use client"

import { Home, FileText, Wallet, ShieldCheck, UserPlus, BookOpen, Settings, Activity } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link" // <--- Important Import

// <CHANGE> Added URLs to the navigation items
const navItems = [
  { icon: Home, label: "Home", url: "/" },
  { icon: FileText, label: "Medical Record", url: "/medical-record" }, // Links to your new page
  { icon: Wallet, label: "DID Wallet", url: "/did-wallet" },
  { icon: ShieldCheck, label: "Data Consent", url: "/data-consent" },
  { icon: UserPlus, label: "Grant Access", url: "/grant-access" },
  { icon: BookOpen, label: "Docs", url: "/docs" },
  { icon: Settings, label: "Settings", url: "/setting" },
]

interface VitalisSidebarProps {
  activeItem?: string
}

export function VitalisSidebar({ activeItem = "Home" }: VitalisSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
         <Image 
          src="/vitalis logo.png"   
          alt="Vitalis Logo" 
          width={70}                
          height={70} 
          className="rounded-lg"    
         />
         <span className="text-xl font-semibold tracking-tight text-sidebar-foreground">Vitalis</span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Patient Overview */}
      <div className="px-4 py-5">
        <div className="rounded-xl bg-sidebar-accent p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="/placeholder-user.jpg" alt="Patient" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-sidebar-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">DID: did:ethr:0x1a2b...3c4d</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-background p-2.5">
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="text-sm font-semibold text-primary">A+</p>
            </div>
            <div className="rounded-lg bg-background p-2.5">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="text-sm font-semibold text-sidebar-foreground">32 yrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            return (
              <li key={item.label}>
                {/* <CHANGE> Switched from button to Link */}
                <Link
                  href={item.url}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
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

      {/* Footer */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Blockchain Connected</span>
        </div>
      </div>
    </aside>
  )
}