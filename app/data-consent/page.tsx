"use client"

import { useState } from "react"
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  XCircle, 
  CheckCircle, 
  FileKey,
  Calendar,
  History,
  BellRing,
  Check,
  X,
  AlertCircle
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock Data: Existing Active Permissions
const initialPermissions = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "General Practitioner",
    facility: "City Hospital",
    scope: "Full Medical History",
    scopeType: "full",
    avatar: "SC"
  }
]

// Mock Data: Incoming Requests (The user must Accept or Deny these)
const initialRequests = [
  {
    id: 101,
    name: "Dr. Emily White",
    role: "Cardiologist",
    facility: "Heart Center Institute",
    scope: "Full Medical History",
    reason: "Scheduled surgery consultation requiring full history review.",
    avatar: "EW"
  },
  {
    id: 102,
    name: "Pacific Insurance",
    role: "Insurance Provider",
    facility: "Pacific DAO",
    scope: "Lab Results Only",
    reason: "Claim verification for recent bloodwork.",
    avatar: "PI"
  }
]

// Mock Data: History Log
const initialHistory = [
  { id: 1, entity: "Dr. Sarah Chen", action: "Approved", date: "Nov 20, 2025", hash: "0x4d2...8a91" },
  { id: 2, entity: "Insurance Co.", action: "Revoked", date: "Oct 15, 2025", hash: "0x9f1...2b3c" },
]

export default function DataConsentPage() {
  const [permissions, setPermissions] = useState(initialPermissions)
  const [requests, setRequests] = useState(initialRequests)
  const [history, setHistory] = useState(initialHistory)

  // Logic: Approve a Pending Request
  const handleApprove = (request: any) => {
    // 1. Remove from Pending
    setRequests(prev => prev.filter(r => r.id !== request.id))

    // 2. Add to Active Permissions
    const newPermission = {
      id: request.id,
      name: request.name,
      role: request.role,
      facility: request.facility,
      scope: request.scope,
      scopeType: request.scope.includes("Full") ? "full" : "limited",
      avatar: request.avatar
    }
    setPermissions(prev => [newPermission, ...prev])

    // 3. Log to Blockchain History
    addToHistory(request.name, "Approved")
  }

  // Logic: Deny a Pending Request
  const handleDeny = (request: any) => {
    // 1. Remove from Pending
    setRequests(prev => prev.filter(r => r.id !== request.id))

    // 2. Log to Blockchain History as Denied
    addToHistory(request.name, "Denied")
  }

  // Logic: Revoke an Active Permission
  const handleRevoke = (id: number, name: string) => {
    setPermissions(prev => prev.filter(p => p.id !== id))
    addToHistory(name, "Revoked")
  }

  // Helper to append history
  const addToHistory = (entity: string, action: string) => {
    const newLog = {
      id: Date.now(),
      entity: entity,
      action: action,
      date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      hash: "0x" + Math.random().toString(16).substr(2, 8) + "..."
    }
    setHistory(prev => [newLog, ...prev])
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <VitalisSidebar activeItem="Data Consent" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Consent</h1>
                <p className="text-muted-foreground">Approve or deny access requests from healthcare providers.</p>
              </div>
            </div>
            {/* Notification Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
              <BellRing className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{requests.length} Pending Requests</span>
            </div>
          </div>

          {/* SECTION 1: Pending Requests (The Action Center) */}
          {requests.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" /> Pending Approvals
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {requests.map((req) => (
                  <Card key={req.id} className="border-orange-200 bg-orange-50/30 dark:bg-orange-950/10">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 border bg-background">
                            <AvatarFallback className="text-orange-600">{req.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base font-semibold">{req.name}</CardTitle>
                            <CardDescription>{req.role} • {req.facility}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-orange-200 text-orange-700 bg-white">
                          Requested
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-3">
                      <div className="p-3 bg-background rounded-md border border-border/50 text-sm">
                        <span className="font-medium text-muted-foreground">Reason: </span>
                        {req.reason}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <FileKey className="h-4 w-4" /> Requested Scope: 
                         <span className="font-medium text-foreground">{req.scope}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-3 pt-0">
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                        onClick={() => handleDeny(req)}
                      >
                        <X className="mr-2 h-4 w-4" /> Deny
                      </Button>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleApprove(req)}
                      >
                        <Check className="mr-2 h-4 w-4" /> Approve Access
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: Active Permissions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Active Permissions
            </h2>
            
            {permissions.length === 0 ? (
               <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground bg-muted/20">
                 No active permissions. Approving a request will list it here.
               </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {permissions.map((perm) => (
                  <Card key={perm.id} className="flex flex-col justify-between shadow-sm border-border">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border bg-muted">
                          <AvatarFallback className="text-primary">{perm.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{perm.name}</CardTitle>
                          <CardDescription>{perm.role} • {perm.facility}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                        Active
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <FileKey className="h-4 w-4" /> Scope
                        </span>
                        <Badge variant="outline" className={perm.scopeType === 'full' ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-orange-200 bg-orange-50 text-orange-700"}>
                          {perm.scope}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        {/* <span className="text-muted-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Expires
                        </span>
                        <span className="font-medium text-foreground">{perm.expires}</span> */}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button 
                        variant="destructive" 
                        className="w-full" /* Kept only w-full for width */
                        onClick={() => handleRevoke(perm.id, perm.name)}
                      >
                        Revoke Consent
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: History Log */}
          <Card className="border-border mt-4">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Audit Log</CardTitle>
                  <CardDescription>Immutable record of all your approval and denial actions.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="relative w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                      <th className="p-4 font-medium">Entity</th>
                      <th className="p-4 font-medium">Action</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium text-right">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {history.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{log.entity}</td>
                        <td className="p-4">
                          {log.action === "Approved" && (
                            <span className="flex items-center gap-2 text-emerald-600 font-medium">
                              <CheckCircle className="h-4 w-4" /> Approved
                            </span>
                          )}
                          {log.action === "Revoked" && (
                            <span className="flex items-center gap-2 text-orange-600 font-medium">
                              <XCircle className="h-4 w-4" /> Revoked
                            </span>
                          )}
                          {log.action === "Denied" && (
                            <span className="flex items-center gap-2 text-destructive font-medium">
                              <XCircle className="h-4 w-4" /> Denied
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {log.date}
                        </td>
                        <td className="p-4 text-right">
                           <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground">
                             {log.hash}
                           </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}