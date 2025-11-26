import { ShieldCheck, Users, Clock, AlertTriangle, XCircle, CheckCircle } from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata = {
  title: 'Data Consent',
}

export default function DataConsentPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* Sidebar with activeItem set to "Data Consent" */}
      <VitalisSidebar activeItem="Data Consent" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Consent</h1>
                <p className="text-muted-foreground">Manage permissions and control who views your records.</p>
              </div>
            </div>
            {/* Quick Action Button */}
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              + Grant New Access
            </button>
          </div>

          {/* Active Permissions Section */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Active Permissions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              
              {/* Permission Card 1 */}
              <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between">
                   <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src="/doctor-1.jpg" />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Dr. Sarah Chen</h3>
                        <p className="text-xs text-muted-foreground">General Practitioner • City Hospital</p>
                      </div>
                   </div>
                   <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                      Active
                   </span>
                </div>
                
                <div className="mt-6 space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Access Level
                      </span>
                      <span className="font-medium">Full Record (Read-Only)</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Expires In
                      </span>
                      <span className="font-medium text-orange-600">5 Days</span>
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                   <button className="flex-1 rounded-lg border border-border bg-transparent py-2 text-sm font-medium hover:bg-muted">
                     Modify
                   </button>
                   <button className="flex-1 rounded-lg border border-destructive/20 bg-destructive/5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                     Revoke Access
                   </button>
                </div>
              </div>

              {/* Permission Card 2 */}
              <div className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between">
                   <div className="flex gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Metro Health Lab</h3>
                        <p className="text-xs text-muted-foreground">Diagnostic Center</p>
                      </div>
                   </div>
                   <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                      Active
                   </span>
                </div>
                
                <div className="mt-6 space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Access Level
                      </span>
                      <span className="font-medium">Upload Results Only</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Expires In
                      </span>
                      <span className="font-medium">Permanent</span>
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                   <button className="flex-1 rounded-lg border border-border bg-transparent py-2 text-sm font-medium hover:bg-muted">
                     Modify
                   </button>
                   <button className="flex-1 rounded-lg border border-destructive/20 bg-destructive/5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                     Revoke Access
                   </button>
                </div>
              </div>

            </div>
          </div>

          {/* Consent History Table */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-6">
              <h3 className="font-semibold text-lg">Consent History</h3>
              <p className="text-sm text-muted-foreground">A blockchain-verified log of all access permissions.</p>
            </div>
            <div className="p-0">
               <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                      <th className="p-4 font-medium">Entity</th>
                      <th className="p-4 font-medium">Action</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium text-right">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/50">
                      <td className="p-4 font-medium">Dr. Sarah Chen</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" /> Granted
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">Nov 20, 2025</td>
                      <td className="p-4 text-right font-mono text-xs text-muted-foreground">0x4d2...8a91</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="p-4 font-medium">Insurance Co.</td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-destructive">
                          <XCircle className="h-4 w-4" /> Revoked
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">Oct 15, 2025</td>
                      <td className="p-4 text-right font-mono text-xs text-muted-foreground">0x9f1...2b3c</td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}