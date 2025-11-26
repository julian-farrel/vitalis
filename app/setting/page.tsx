"use client"

import { Settings, User, Bell, Shield, Moon, Sun, LogOut, Smartphone, Mail, ChevronRight } from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* Sidebar with activeItem set to "Settings" */}
      <VitalisSidebar activeItem="Settings" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and security.</p>
            </div>
          </div>

          {/* Section 1: Profile Card */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Profile Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-3">
                   <Avatar className="h-24 w-24 border-4 border-muted">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">JD</AvatarFallback>
                   </Avatar>
                   <button className="text-xs font-medium text-primary hover:underline">Change Photo</button>
                </div>
                
                {/* Form Inputs */}
                <div className="flex-1 grid gap-5">
                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                         <label className="text-sm font-medium">First Name</label>
                         <input type="text" defaultValue="John" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-medium">Last Name</label>
                         <input type="text" defaultValue="Doe" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input type="email" defaultValue="john.doe@example.com" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Connected DID (Read Only)</label>
                      <div className="w-full rounded-lg border bg-muted/50 px-3 py-2.5 text-sm text-muted-foreground font-mono">
                        did:ethr:0x1a2b3c4d5e6f7g8h9i0j
                      </div>
                   </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/30 px-6 py-3 flex justify-end border-t">
               <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm">
                  Save Changes
               </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             
             {/* Section 2: Preferences */}
             <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" /> Preferences
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                   
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <label className="text-sm font-medium">Email Alerts</label>
                         <p className="text-xs text-muted-foreground">Get notified when records are updated.</p>
                      </div>
                      <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                   </div>
                   
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <label className="text-sm font-medium">Dark Mode</label>
                         <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border bg-muted p-1">
                         <button className="rounded bg-background p-1.5 shadow-sm">
                            <Moon className="h-4 w-4 text-foreground" />
                         </button>
                         <button className="p-1.5 text-muted-foreground hover:text-foreground">
                            <Sun className="h-4 w-4" />
                         </button>
                      </div>
                   </div>

                </div>
             </div>

             {/* Section 3: Security */}
             <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> Security
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                   <button className="group flex w-full items-center justify-between rounded-lg border bg-background p-3 text-sm font-medium hover:border-primary/50 hover:bg-muted/50 transition-all">
                      <span className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                           <Smartphone className="h-4 w-4" />
                        </div>
                        2-Factor Auth
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary">
                        Enabled <ChevronRight className="h-3 w-3" />
                      </span>
                   </button>
                   <button className="group flex w-full items-center justify-between rounded-lg border bg-background p-3 text-sm font-medium hover:border-primary/50 hover:bg-muted/50 transition-all">
                      <span className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                           <Mail className="h-4 w-4" />
                        </div>
                        Recovery Email
                      </span>
                      <span className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary">
                        Edit <ChevronRight className="h-3 w-3" />
                      </span>
                   </button>
                </div>
             </div>

          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="font-semibold text-destructive">Disconnect Wallet</h3>
                   <p className="text-sm text-destructive/80 mt-1">This will end your current session and lock your local vault.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-destructive/90 transition-colors">
                   <LogOut className="h-4 w-4" /> Disconnect
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}