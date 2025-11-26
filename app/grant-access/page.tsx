"use client"

import { useState } from "react"
import { UserPlus, Search, Shield, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function GrantAccessPage() {
  const [step, setStep] = useState(1)

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* Sidebar with activeItem set to "Grant Access" */}
      <VitalisSidebar activeItem="Grant Access" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Grant Access</h1>
              <p className="text-muted-foreground">Authorize a new doctor or institution to view your records.</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Main Form Area (Left Side) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Find User */}
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
                    Find Healthcare Provider
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <label className="text-sm font-medium">Enter DID, Wallet Address, or Email</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="e.g. did:ethr:0x123... or dr.smith@hospital.com"
                        className="w-full rounded-lg border bg-background pl-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50" 
                      />
                    </div>
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      Search
                    </button>
                  </div>

                  {/* Simulated Search Result */}
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage src="/doctor-2.jpg" />
                           <AvatarFallback className="bg-blue-100 text-blue-700">MP</AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-medium">Dr. Michael Park</p>
                           <p className="text-xs text-muted-foreground">Cardiologist • Verified Identity ✅</p>
                        </div>
                     </div>
                     <button className="text-sm font-medium text-primary hover:underline">Selected</button>
                  </div>
                </div>
              </div>

              {/* Step 2: Configure Permissions */}
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-6">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
                    Select Permissions
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  
                  {/* Duration Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Access Duration</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="rounded-lg border bg-background p-3 text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-all">
                        24 Hours
                      </button>
                      <button className="rounded-lg border-2 border-primary bg-primary/5 p-3 text-sm font-medium text-primary transition-all">
                        7 Days
                      </button>
                      <button className="rounded-lg border bg-background p-3 text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-all">
                        Permanent
                      </button>
                    </div>
                  </div>

                  {/* Data Types */}
                  <div>
                     <label className="text-sm font-medium mb-3 block">Data to Share</label>
                     <div className="space-y-3">
                        <label className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                           <div className="flex-1">
                              <span className="font-medium text-sm">General Profile</span>
                              <p className="text-xs text-muted-foreground">Name, Age, Blood Type, Allergies</p>
                           </div>
                        </label>
                        <label className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                           <div className="flex-1">
                              <span className="font-medium text-sm">Recent Lab Results</span>
                              <p className="text-xs text-muted-foreground">Blood work, Urine analysis (Last 30 days)</p>
                           </div>
                        </label>
                        <label className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer">
                           <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                           <div className="flex-1">
                              <span className="font-medium text-sm">Full Medical History</span>
                              <p className="text-xs text-muted-foreground text-orange-600">Includes sensitive historical records</p>
                           </div>
                        </label>
                     </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <button className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                 Sign Transaction & Grant Access
              </button>
              <p className="text-center text-xs text-muted-foreground">
                 This action will be recorded on the blockchain (Gas fees apply).
              </p>

            </div>

            {/* Info Sidebar (Right Side) */}
            <div className="space-y-6">
               {/* Security Note */}
               <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-6 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-start gap-3">
                     <Shield className="h-5 w-5 text-primary mt-0.5" />
                     <div>
                        <h3 className="font-semibold text-primary">Zero-Knowledge Privacy</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                           Vitalis uses Zero-Knowledge Proofs. The doctor will verify your medical data without actually storing it on their own servers. You remain the owner.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Summary */}
               <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">Summary</h3>
                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Recipient</span>
                        <span className="font-medium">Dr. Michael Park</span>
                     </div>
                     <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">7 Days</span>
                     </div>
                     <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Access Type</span>
                        <span className="font-medium">Read Only</span>
                     </div>
                     <div className="flex justify-between pt-2">
                        <span className="text-muted-foreground">Est. Gas Fee</span>
                        <span className="font-medium">0.0004 ETH</span>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}