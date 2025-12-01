"use client"

import { 
  User, 
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

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      
      {/* Sidebar Navigation */}
      <VitalisSidebar activeItem="Settings" />
      
      {/* Main Content Area */}
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your digital identity and view security status.</p>
            </div>
          </div>

          {/* SECTION 1: Identity Profile */}
          <Card className="overflow-hidden border-border shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                       <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl">John Doe</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">Patient Account</p>
                      <Badge variant="secondary" className="h-5 px-2 text-[10px] bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                        Verified On-Chain
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Edit Profile</Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                     Phone <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <div className="relative">
                     <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input className="pl-9" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Location</Label>
                  <div className="relative">
                     <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input className="pl-9" defaultValue="Jakarta, Indonesia" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Linked DID Section */}
              <div>
                <Label className="mb-3 block text-sm font-medium text-foreground">Linked Digital Identity</Label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <Wallet className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="grid gap-0.5 truncate">
                      <p className="text-sm font-medium text-foreground">Ethereum Mainnet</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        did:ethr:0xda61...626da
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Copy DID">
                       <Copy className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Show QR">
                       <QrCode className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="View on Explorer">
                       <ExternalLink className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: Security Information (Read-Only) */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" /> Security Status
              </CardTitle>
              <CardDescription>Real-time overview of your account security protocols.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Active Session */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-full border shadow-sm">
                      <Laptop className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on macOS • Jakarta, ID</p>
                    </div>
                 </div>
                 <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">Active Now</Badge>
              </div>

              <Separator />

              {/* Security Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Encryption Standard</p>
                      <p className="text-xs text-muted-foreground">AES-256 (End-to-End)</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Protection</p>
                      <p className="text-xs text-muted-foreground">Hardware Enclave Active</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Key Management</p>
                      <p className="text-xs text-muted-foreground">Self-Custodial (Local)</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/20 transition-colors">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Recovery Guardians</p>
                      <p className="text-xs text-muted-foreground">2 of 3 Guardians Online</p>
                    </div>
                 </div>
              </div>

            </CardContent>
          </Card>

          {/* SECTION 3: Data & Privacy Information (Read-Only) */}
          <Card className="border-border shadow-sm">
             <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-primary" /> Data & Privacy
                </CardTitle>
                <CardDescription>Transparency report on how your medical data is stored.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   
                   {/* Data Residency */}
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Region</span>
                      </div>
                      <p className="text-sm font-medium">Jakarta, ID</p>
                      <p className="text-xs text-muted-foreground">Local Node</p>
                   </div>

                   {/* Storage Network */}
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Server className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Network</span>
                      </div>
                      <p className="text-sm font-medium">IPFS Cluster</p>
                      <p className="text-xs text-muted-foreground">Decentralized</p>
                   </div>

                   {/* Compliance */}
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Compliance</span>
                      </div>
                      <p className="text-sm font-medium">HIPAA Ready</p>
                      <p className="text-xs text-muted-foreground">Strict Privacy</p>
                   </div>

                   {/* Storage Usage */}
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Database className="h-4 w-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Storage</span>
                      </div>
                      <p className="text-sm font-medium">124.5 MB</p>
                      <p className="text-xs text-muted-foreground">Encrypted Data</p>
                   </div>

                </div>
             </CardContent>
          </Card>

          {/* SECTION 4: Danger Zone - UPDATED WITH HOVER EFFECTS */}
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
              >
                <LogOut className="h-4 w-4" /> Disconnect
             </Button>
          </div>

        </div>
      </main>
    </div>
  )
}