import { BookOpen, FileText, Download, Code, Shield, ChevronRight, GraduationCap } from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import Link from "next/link"

export const metadata = {
  title: 'Documentation',
}

export default function DocsPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* Sidebar with activeItem set to "Docs" */}
      <VitalisSidebar activeItem="Docs" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
              <p className="text-muted-foreground">Technical guides, smart contract references, and the Vitalis Whitepaper.</p>
            </div>
          </div>

          {/* Featured: Whitepaper Download */}
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
               
               {/* <CHANGE> The Hyperlinked Whitepaper Button */}
               <Link 
                 href="/vitalis-whitepaper.pdf" // Ensure you put a PDF with this name in your public folder
                 target="_blank" // Opens in new tab
                 className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform hover:scale-105"
               >
                 <Download className="h-5 w-5" />
                 Download Whitepaper
               </Link>
            </div>
            
            {/* Decorative Background Element */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          </div>

          {/* Documentation Grid */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Browse Topics</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               
               {/* Card 1: Getting Started */}
               <Link href="#" className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                     <GraduationCap className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Getting Started</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Learn how to set up your DID wallet and verify your first medical record.
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     Read Guide <ChevronRight className="ml-1 h-3 w-3" />
                  </div>
               </Link>

               {/* Card 2: Developer API */}
               <Link href="#" className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                     <Code className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Developer API</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Integrate Vitalis into your hospital management system (HMS).
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     View Docs <ChevronRight className="ml-1 h-3 w-3" />
                  </div>
               </Link>

               {/* Card 3: Security & Privacy */}
               <Link href="#" className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                     <Shield className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">Privacy Architecture</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                     Understanding ZK-SNARKs and how we ensure HIPAA compliance on-chain.
                  </p>
                  <div className="mt-auto pt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     Learn More <ChevronRight className="ml-1 h-3 w-3" />
                  </div>
               </Link>

            </div>
          </div>

          {/* FAQ Section */}
          <div className="rounded-xl border bg-card p-8 shadow-sm">
             <h3 className="mb-6 font-semibold text-lg">Frequently Asked Questions</h3>
             <div className="space-y-6">
                <div>
                   <h5 className="font-medium text-sm">Is my data stored on the blockchain?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      No. Only the cryptographic proof (hash) of your data is stored on-chain. The actual medical files are stored in decentralized encrypted storage (IPFS/Filecoin) that only you control.
                   </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                   <h5 className="font-medium text-sm">What happens if I lose my wallet key?</h5>
                   <p className="mt-1 text-sm text-muted-foreground">
                      Vitalis supports Social Recovery. You can designate trusted guardians (family or lawyer) to help recover your identity if you lose access.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}