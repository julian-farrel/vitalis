"use client"

import { 
  FileText, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Calendar,
  ShieldCheck
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// 1. Define the shape of your data to fix TypeScript errors
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

const records: MedicalRecord[] = [
  {
    id: "REC-001",
    title: "Annual Physical Examination",
    provider: "Dr. Sarah Chen",
    facility: "Metro Health Clinic",
    date: "Nov 20, 2025",
    type: "visit",
    category: "Visits & Notes",
    status: "Completed",
    hash: "0x8f...2a1",
  },
  {
    id: "LAB-002",
    title: "Complete Blood Count (CBC)",
    provider: "City Medical Lab",
    facility: "City Labs",
    date: "Nov 20, 2025",
    type: "lab",
    category: "Labs & Diagnostics",
    status: "Normal",
    hash: "0x3c...9b2",
  },
  {
    id: "IMG-003",
    title: "MRI - Left Knee",
    provider: "Radiology Center",
    facility: "General Hospital",
    date: "Oct 15, 2025",
    type: "lab",
    category: "Labs & Diagnostics",
    status: "Reviewed",
    hash: "0x7d...4e3",
  },
  {
    id: "MED-004",
    title: "Amoxicillin 500mg",
    provider: "Dr. Michael Park",
    facility: "Pharmacy Dept",
    date: "Oct 10, 2025",
    type: "medication",
    category: "Medications",
    status: "Active",
    hash: "0x1a...8f4",
  },
  {
    id: "PROC-005",
    title: "ACL Reconstruction Surgery",
    provider: "Dr. James Wilson",
    facility: "Orthopedic Surgery Center",
    date: "Oct 03, 2025",
    type: "procedure",
    category: "Procedures & Surgeries",
    status: "Successful",
    hash: "0x9e...1c5",
  },
]

export default function MedicalRecordsPage() {
  
  // 2. Add type annotation to the parameter
  const getRecords = (filterType: string) => {
    if (filterType === "all") return records;
    return records.filter(r => r.type === filterType);
  }

  // 3. Add type annotation to the props
  const RecordItem = ({ record }: { record: MedicalRecord }) => {
    const getIcon = () => {
      switch(record.type) {
        case 'visit': return <Stethoscope className="h-5 w-5 text-blue-500" />;
        case 'lab': return <FlaskConical className="h-5 w-5 text-purple-500" />;
        case 'medication': return <Pill className="h-5 w-5 text-emerald-500" />;
        case 'procedure': return <Activity className="h-5 w-5 text-rose-500" />;
        default: return <FileText className="h-5 w-5 text-gray-500" />;
      }
    }

    return (
      <Card className="mb-3 hover:bg-secondary/40 transition-colors border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg bg-background border border-border`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{record.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{record.provider}</span>
                <span>•</span>
                <span>{record.facility}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded text-xs text-primary font-medium">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-3 w-3" />
                {record.date}
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {record.status}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

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
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
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

            {/* Tab Contents */}
            <TabsContent value="all" className="mt-0 space-y-4">
              <div className="mb-2 text-sm font-medium text-muted-foreground">Timeline View</div>
              {getRecords('all').map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </TabsContent>

            <TabsContent value="visit" className="mt-0">
               <div className="mb-2 text-sm font-medium text-muted-foreground">Consultations & Notes</div>
              {getRecords('visit').map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </TabsContent>

            <TabsContent value="lab" className="mt-0">
               <div className="mb-2 text-sm font-medium text-muted-foreground">Diagnostics & Imaging</div>
              {getRecords('lab').map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </TabsContent>

            <TabsContent value="medication" className="mt-0">
               <div className="mb-2 text-sm font-medium text-muted-foreground">Prescriptions & History</div>
              {getRecords('medication').map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </TabsContent>

            <TabsContent value="procedure" className="mt-0">
               <div className="mb-2 text-sm font-medium text-muted-foreground">Operations & Procedures</div>
              {getRecords('procedure').map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  )
}