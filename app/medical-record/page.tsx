import { FileText } from "lucide-react"
// 1. Import the Sidebar Component
import { VitalisSidebar } from "@/components/vitalis-sidebar"

export const metadata = {
  title: 'Medical Records',
}

export default function MedicalRecordsPage() {
  return (
    // 2. Main Wrapper: Sets background color and minimum height
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* 3. The Sidebar: We pass "activeItem" so the button stays blue */}
      <VitalisSidebar activeItem="Medical Record" />

      {/* 4. The Content Area: "pl-64" pushes content right so it's not hidden by the sidebar */}
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-6 p-8">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
              <p className="text-muted-foreground">View and manage your verified health documents.</p>
            </div>
          </div>

          {/* Page Content */}
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground shadow-sm">
            <p>Your medical records from the blockchain will appear here.</p>
          </div>

        </div>
      </main>
    </div>
  )
}