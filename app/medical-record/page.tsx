"use client"

import { 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Activity, 
  Search
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Define the shape of your data
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

// Emtpy array for now
const records: MedicalRecord[] = []

export default function MedicalRecordsPage() {
  
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
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Medical Records</h1>
                <p className="text-muted-foreground">View and manage your on-chain health documents.</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Tabs Navigation */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-muted/50 mb-6">
              <TabsTrigger value="all" className="py-2">All Records</TabsTrigger>
              <TabsTrigger value="visit" className="py-2">Visits</TabsTrigger>
              <TabsTrigger value="lab" className="py-2">Labs</TabsTrigger>
              <TabsTrigger value="medication" className="py-2">Meds</TabsTrigger>
              <TabsTrigger value="procedure" className="py-2">Surgeries</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0 space-y-4">
              {getRecords('all').length > 0 ? (
                 getRecords('all').map((record) => (
                   <div key={record.id}>{record.title}</div>
                 ))
              ) : <EmptyState />}
            </TabsContent>

            <TabsContent value="visit" className="mt-0">
              {getRecords('visit').length > 0 ? (
                 getRecords('visit').map((record) => <div key={record.id}>{record.title}</div>)
              ) : <EmptyState />}
            </TabsContent>

            <TabsContent value="lab" className="mt-0">
              {getRecords('lab').length > 0 ? (
                 getRecords('lab').map((record) => <div key={record.id}>{record.title}</div>)
              ) : <EmptyState />}
            </TabsContent>

            <TabsContent value="medication" className="mt-0">
              {getRecords('medication').length > 0 ? (
                 getRecords('medication').map((record) => <div key={record.id}>{record.title}</div>)
              ) : <EmptyState />}
            </TabsContent>

            <TabsContent value="procedure" className="mt-0">
              {getRecords('procedure').length > 0 ? (
                 getRecords('procedure').map((record) => <div key={record.id}>{record.title}</div>)
              ) : <EmptyState />}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  )
}