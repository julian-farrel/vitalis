"use client"

import { useState } from "react"
import { 
  Copy, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  FileBadge,
  CheckCircle2,
  History,
  Activity,
  Fingerprint,
  Link as LinkIcon,
  Wifi,
  Server
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock Data: Medical Credentials (No crypto jargon)
const credentials = [
  {
    id: "VC-101",
    name: "National Health ID",
    issuer: "Ministry of Health",
    type: "Identity Proof",
    status: "Active",
    expiry: "2030-01-01"
  },
  {
    id: "VC-102",
    name: "Cigna Insurance Policy",
    issuer: "Cigna Insurance DAO",
    type: "Insurance Coverage",
    status: "Active",
    expiry: "2026-05-20"
  },
  {
    id: "VC-103",
    name: "Organ Donor Consent",
    issuer: "Patient Self-Sovereign",
    type: "Consent",
    status: "Registered",
    expiry: "Permanent"
  }
]

// Mock Data: System Logs (Abstracted terms)
const activityLog = [
  { action: "Granted Read Access", target: "Dr. Sarah Chen", ref: "REF-3A9F", date: "Nov 30, 09:41 AM" },
  { action: "Registry Sync", target: "Vitalis System", ref: "REF-8B2C", date: "Nov 28, 02:15 PM" },
  { action: "Profile Update", target: "Self", ref: "REF-1D4E", date: "Nov 25, 11:00 AM" },
]

export default function DIDWalletPage() {
  const [showSecret, setShowSecret] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <VitalisSidebar activeItem="DID Wallet" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
              <Fingerprint className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Identity Vault</h1>
              <p className="text-muted-foreground">Manage your secure digital identity and verifiable credentials.</p>
            </div>
          </div>

          {/* Top Row: Identity & System Status */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Card 1: The DID (Identity) - Takes up 2 columns */}
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
                      <code className="text-lg font-mono text-foreground font-semibold">0xdaCEc6c9efd60276Da12A365f461c8f2D85626da</code>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy("0x71C...9e21")}>
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Linked to 3 Medical Providers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Account Status (Replaces Network Fuel) */}
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

          {/* Middle Section: Credentials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileBadge className="h-5 w-5 text-indigo-600" /> Verifiable Credentials
              </h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {credentials.map((vc) => (
                <Card key={vc.id} className="border-border hover:border-indigo-300 transition-all cursor-default group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase">
                        {vc.type}
                      </Badge>
                      {vc.status === "Active" && (
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      )}
                    </div>
                    <CardTitle className="text-base mt-2">{vc.name}</CardTitle>
                    <CardDescription className="text-xs">Issuer: {vc.issuer}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                    <span>Exp: {vc.expiry}</span>
                    <Shield className="h-3 w-3 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Section: Security & Logs */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Private Secret Manager */}
            <Card className="border-destructive/20 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" /> Digital Signature
                </CardTitle>
                <CardDescription>Used to securely sign your records.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive" className="py-2 bg-destructive/5 border-destructive/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This is your master recovery secret. Keep it safe.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <div className="relative">
                    <div className={`p-3 rounded bg-muted font-mono text-xs break-all ${showSecret ? 'blur-none text-destructive' : 'blur-sm select-none text-transparent'}`}>
                      8x99...(HIDDEN_SECRET)...b2a1
                    </div>
                    {!showSecret && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => setShowSecret(true)}>
                          <Eye className="h-3 w-3 mr-1" /> Reveal
                        </Button>
                      </div>
                    )}
                  </div>
                  {showSecret && (
                    <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => setShowSecret(false)}>
                      <EyeOff className="h-3 w-3 mr-1" /> Hide Secret
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Log */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="h-4 w-4" /> System History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {activityLog.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                          <LinkIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded inline-block mb-1">
                          {log.ref}
                        </p>
                        <p className="text-xs text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}