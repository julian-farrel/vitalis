"use client"

import { 
  User, 
  Shield, 
  LogOut, 
  Smartphone, 
  Laptop,
  AlertTriangle,
  Download,
  Users,
  CheckCircle2,
  Copy
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <VitalisSidebar activeItem="Settings" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">Manage your identity, security, and data preferences.</p>
          </div>

          {/* 1. Profile & Identity Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Identity Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                   <Avatar className="h-24 w-24 border-2 border-border">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">JD</AvatarFallback>
                   </Avatar>
                   <Button variant="outline" size="sm" className="w-full text-xs">Change</Button>
                </div>

                {/* Inputs */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Email Address</Label>
                    <Input defaultValue="john.doe@example.com" />
                  </div>
                </div>
              </div>

              {/* Linked DID Block */}
              <div className="rounded-lg border bg-muted/30 p-4">
                 <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs uppercase text-muted-foreground font-semibold">Your Decentralized ID (DID)</Label>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified On-Chain
                    </Badge>
                 </div>
                 <div className="flex items-center gap-2">
                   <code className="flex-1 text-sm font-mono bg-background p-2.5 rounded border text-foreground">
                     did:ethr:0xda61...626da
                   </code>
                   <Button variant="ghost" size="icon">
                     <Copy className="h-4 w-4" />
                   </Button>
                 </div>
              </div>

            </CardContent>
          </Card>

          {/* 2. Security & Recovery Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Security & Recovery
              </CardTitle>
              <CardDescription>Protect your account and set up recovery methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Active Session */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-600">
                      <Laptop className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on macOS • Jakarta, ID</p>
                    </div>
                 </div>
                 <Badge variant="secondary" className="bg-blue-50 text-blue-700">Active</Badge>
              </div>

              <Separator />

              {/* Social Recovery / Guardians */}
              <div>
                 <div className="flex items-center justify-between mb-2">
                    <div>
                       <h3 className="text-sm font-medium flex items-center gap-2">
                         <Users className="h-4 w-4 text-primary" /> Trusted Guardians
                       </h3>
                       <p className="text-xs text-muted-foreground">
                         People who can help recover your account if you lose your key.
                       </p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                 </div>
                 {/* Visual Progress Bar for Guardians */}
                 <div className="space-y-1.5">
                    <div className="flex gap-1 h-2">
                       <div className="flex-1 rounded-l-full bg-emerald-500" />
                       <div className="flex-1 bg-emerald-500" />
                       <div className="flex-1 rounded-r-full bg-muted" />
                    </div>
                    <p className="text-xs text-right text-muted-foreground">2 of 3 Guardians set</p>
                 </div>
              </div>

              <Separator />

              {/* 2FA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-500/10 rounded-full text-purple-600">
                     <Smartphone className="h-4 w-4" />
                   </div>
                   <div className="space-y-0.5">
                     <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                     <p className="text-xs text-muted-foreground">Extra security layer.</p>
                   </div>
                </div>
                <Switch />
              </div>

            </CardContent>
          </Card>

          {/* 3. Emergency & Privacy Card */}
          <Card>
             <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" /> Emergency & Data
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                
                {/* Emergency Protocol */}
                <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-4">
                   <div className="flex items-start justify-between">
                      <div className="space-y-1">
                         <h3 className="font-semibold text-orange-900 text-sm">"Break-Glass" Protocol</h3>
                         <p className="text-xs text-orange-800/80">
                           Allow verified paramedics to view vital data (Blood Type, Allergies) in an emergency. Access is logged permanently.
                         </p>
                      </div>
                      <Switch className="data-[state=checked]:bg-orange-500" />
                   </div>
                </div>

                {/* Data Export */}
                <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Export Medical Records</Label>
                      <p className="text-xs text-muted-foreground">Download a decrypted copy of your history.</p>
                   </div>
                   <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" /> Download JSON
                   </Button>
                </div>
             </CardContent>
          </Card>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex items-center justify-between">
             <div>
                <h3 className="font-semibold text-destructive text-sm">Disconnect Wallet</h3>
                <p className="text-xs text-muted-foreground mt-1">This will lock your local vault.</p>
             </div>
             <Button variant="destructive" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" /> Disconnect
             </Button>
          </div>

        </div>
      </main>
    </div>
  )
}