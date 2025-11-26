import { Wallet, Copy, ArrowUpRight, ArrowDownLeft, CreditCard, Shield } from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"

export const metadata = {
  title: 'DID Wallet',
}

export default function DIDWalletPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* Sidebar with activeItem set to "DID Wallet" */}
      <VitalisSidebar activeItem="DID Wallet" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">DID Wallet</h1>
              <p className="text-muted-foreground">Manage your decentralized identity and assets.</p>
            </div>
          </div>

          {/* Top Section: Wallet Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Card 1: Balance & Address */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Total Balance</h3>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold tracking-tight">2.45 ETH</span>
                <span className="ml-2 text-sm text-muted-foreground">($5,820.50 USD)</span>
              </div>
              
              <div className="mt-6 rounded-lg bg-muted/50 p-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">YOUR DID (Decentralized ID)</p>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-foreground">did:ethr:0x1a2b...3c4d</code>
                  <button className="rounded p-1.5 hover:bg-muted transition-colors">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Quick Actions */}
            <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage your keys and permissions.</p>
              </div>
              
              <div className="flex gap-4 mt-6">
                 <button className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50 hover:border-primary/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                        <ArrowDownLeft className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Receive</span>
                 </button>

                 <button className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50 hover:border-primary/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Send</span>
                 </button>

                 <button className="flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/50 hover:border-primary/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Buy</span>
                 </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b p-6">
              <h3 className="font-semibold text-lg">Recent Blockchain Activity</h3>
            </div>
            <div className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-muted-foreground">
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr className="hover:bg-muted/50">
                      <td className="p-4 font-medium flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                           <Shield className="h-4 w-4" />
                        </div>
                        Verifiable Credential Issue
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          Confirmed
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">Nov 24, 2025</td>
                      <td className="p-4 text-right font-medium">Gas Only</td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="p-4 font-medium flex items-center gap-3">
                        <div className="rounded-full bg-orange-500/10 p-2 text-orange-600">
                           <CreditCard className="h-4 w-4" />
                        </div>
                        Medical Access Grant
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                          Confirmed
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">Nov 22, 2025</td>
                      <td className="p-4 text-right font-medium">Gas Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}