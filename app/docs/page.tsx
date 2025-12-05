import { 
  BookOpen, 
  FileText, 
  Download, 
  Search
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata = {
  title: 'Documentation',
}

export default function DocsPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      <VitalisSidebar activeItem="Docs" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
                <p className="text-muted-foreground">Technical guides, smart contract references, and resources.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary/5 border border-primary/20 p-8">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
               <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                     <FileText className="h-3 w-3" />
                     Latest Release v1.0
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Vitalis Protocol Whitepaper</h2>
                  <p className="text-muted-foreground">
                    A deep dive into our decentralized architecture, Zero-Knowledge Proof implementation, and tokenomics model. Read how we secure patient data on-chain.
                  </p>
               </div>
               
               <Link 
                 href="/vitalis-whitepaper.pdf" 
                 target="_blank" 
                 className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform hover:scale-105"
               >
                 <Download className="h-5 w-5" />
                 View Whitepaper
               </Link>
            </div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
             <h3 className="mb-6 font-semibold text-lg">Frequently Asked Questions</h3>
             <div className="space-y-6">
                
                <div>
                   <h5 className="font-medium text-sm">Is my actual medical data stored on the blockchain?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      No. Only the <strong>cryptographic hash</strong> (a unique digital fingerprint) of your data is stored on-chain for verification. The actual files are stored in decentralized encrypted storage (IPFS/Filecoin) that only you hold the keys to access.
                   </p>
                </div>
                <div className="h-px bg-border" />
                
                <div>
                   <h5 className="font-medium text-sm">What happens in an emergency if I am unconscious?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      Vitalis includes a &quot;Break-Glass&quot; protocol. Verified Emergency Responders can request temporary access. This triggers a smart contract event that logs their identity and the time of access immutably, ensuring full accountability for the intrusion.
                   </p>
                </div>
                <div className="h-px bg-border" />

                <div>
                   <h5 className="font-medium text-sm">Do I have to pay gas fees to view my own records?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      No. Viewing records is a &quot;read-only&quot; operation and is free. However, granting access to a new doctor or uploading a new record requires a small gas fee to write the transaction to the Ethereum network.
                   </p>
                </div>
                <div className="h-px bg-border" />

                <div>
                   <h5 className="font-medium text-sm">What happens if I lose my wallet key?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      Vitalis supports <strong>Social Recovery</strong>. During setup, you can designate trusted guardians (family, lawyer, or a hardware device). If you lose access, a majority of these guardians can sign a transaction to restore your identity to a new wallet.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}