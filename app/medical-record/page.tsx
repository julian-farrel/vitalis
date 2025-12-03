"use client"

import { 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Activity, 
  Search,
  AlertCircle
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/context/user-context" // <--- Import Context

interface MedicalRecord {
  id: string
  title: string
  provider: string
  facility: string
  date: string
  type: string
  category: string
  status: string
  hash: string
}

const records: MedicalRecord[] = []

export default function MedicalRecordsPage() {
  const { userData } = useUser() // <--- Access user data
  
  const getRecords = (filterType: string) => {
    if (filterType === "all") return records;
    return records.filter(r => r.type === filterType);
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/20">
      <div className="p-4 bg-muted rounded-full mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No records found</h3>
      <p className="text-muted-foreground max-w-sm mt-1">
        There are no medical records uploaded to your decentralized storage yet.
      </p>
    </div>
  )

  return (
    <div className="flex min-h-screen w-full bg-background">
      <VitalisSidebar activeItem="Medical Record" />

      <main className="pl-64 w-full">
        <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Medical Records</h1>
              <p className="text-muted-foreground">View and manage your on-chain health documents.</p>
            </div>
          </div>

          {/* New Patient Medical Profile Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <Card className="bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.allergies || "None Reported"}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Pill className="h-4 w-4" /> Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.medications || "None Reported"}</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.conditions || "None Reported"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by doctor, diagnosis, or date..."
                className="pl-9 bg-card"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-muted/50 mb-6">
              <TabsTrigger value="all" className="py-2">All Records</TabsTrigger>
              <TabsTrigger value="visit" className="py-2">Visits</TabsTrigger>
              <TabsTrigger value="lab" className="py-2">Labs</TabsTrigger>
              <TabsTrigger value="medication" className="py-2">Meds</TabsTrigger>
              <TabsTrigger value="procedure" className="py-2">Surgeries</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {getRecords('all').length > 0 ? (
                 getRecords('all').map((record) => (
                   <div key={record.id}>{record.title}</div>
                 ))
              ) : <EmptyState />}
            </TabsContent>

            {/* Other tabs remain empty for now, sharing the EmptyState logic */}
            <TabsContent value="visit" className="mt-0"><EmptyState /></TabsContent>
            <TabsContent value="lab" className="mt-0"><EmptyState /></TabsContent>
            <TabsContent value="medication" className="mt-0"><EmptyState /></TabsContent>
            <TabsContent value="procedure" className="mt-0"><EmptyState /></TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  )
}