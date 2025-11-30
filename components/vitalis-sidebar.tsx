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
        {/* Updated Card Container with light blue style */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
          
          {/* Header: Name, Email, and Shield Icon */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground">Wesley Taruna</h3>
              <p className="text-sm text-muted-foreground">wesleytaruna@gmail.com</p>
            </div>
            {/* <Shield className="h-5 w-5 text-blue-600 mt-1" /> */}
          </div>

          {/* Body: Blood Type and DOB */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Blood Type:</span>
              <span className="font-medium text-foreground">O+</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">DOB:</span>
              <span className="font-medium text-foreground">2005-10-13</span>
            </div>
          </div>

          {/* Footer: Separator and ID */}
          <Separator className="my-4 bg-blue-200" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">ID:</span>
            <span className="text-blue-600 font-mono truncate" title="0x1a2b3c4d5e...">
              0xda61...626da
            </span>
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
                <Link
                  href={item.url}
                  className={cn(
                    // Base classes
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    // <CHANGE> Made transition slightly longer and smoother (300ms ease-out)
                    "transition-all duration-300 ease-out",
                    // The slide effect
                    "hover:translate-x-1",
                    isActive
                      // Active State: Solid primary background with a subtle shadow boost
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      // <CHANGE> Inactive Hover State: The "Glow" Effect
                      // 1. hover:text-primary -> lights up the text color
                      // 2. hover:bg-primary/10 -> adds a very faint primary colored background light
                      // 3. hover:ring-2 hover:ring-primary/20 -> adds a soft, transparent glowing border ring
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