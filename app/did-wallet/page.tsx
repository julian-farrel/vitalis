"use client"

import {
  Copy,
  CheckCircle2,
  Activity,
  Fingerprint,
  Wifi,
  Server
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/user-context"

export default function DIDWalletPage() {
  const { userData } = useUser()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Address copied to clipboard!")
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <VitalisSidebar activeItem="DID Wallet" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
              <Fingerprint className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Identity Vault</h1>
              <p className="text-muted-foreground">Manage your secure digital identity.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            <Card className="md:col-span-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-indigo-950">Decentralized Identifier (DID)</CardTitle>
                    <CardDescription>Your unique global ID for medical records.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                    Verified ID
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-lg bg-white border border-indigo-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Public ID Number</p>
                      <code className="text-lg font-mono text-foreground font-semibold">
                        {userData.didWalletAddress || "Generating..."}
                      </code>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.didWalletAddress)}>
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Linked to Smart Contract Registry</span>
                  </div>
                </div>
              </CardContent>
            </Card>

             <Card className="flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-emerald-600" /> System Status
                </CardTitle>
                <CardDescription>Connectivity & Access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Status</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Wifi className="h-3 w-3 text-emerald-500" />
                      Online
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sync State</span>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Server className="h-3 w-3 text-blue-500" />
                      Up to date
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}