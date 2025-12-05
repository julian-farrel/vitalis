"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { 
  Database, 
  Inbox, 
  Calendar, 
  FileText, 
  CheckCircle2,
  Plus,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Home")
  const { ready, authenticated } = usePrivy()
  const router = useRouter()
  const { userData } = useUser()

  const [recentRecords, setRecentRecords] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalBlocks, setTotalBlocks] = useState(0)
  const [futureVisitsCount, setFutureVisitsCount] = useState(0)

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData.didWalletAddress) return;

      const { data: allRecords } = await supabase
        .from('records')
        .select('*')
        .eq('user_wallet', userData.didWalletAddress)
        .order('created_at', { ascending: false })

      if (allRecords) {
        setTotalRecords(allRecords.length)
        setRecentRecords(allRecords.slice(0, 5))
      }

      const { data: allApps } = await supabase
        .from('appointments')
        .select('*, doctors(name, specialty), hospitals(name)')
        .eq('patient_wallet', userData.didWalletAddress)
        .order('appointment_date', { ascending: true })

      if (allApps) {
        const today = new Date().toISOString().split('T')[0]
        const futureApps = allApps.filter(app => app.appointment_date >= today)
        
        setFutureVisitsCount(futureApps.length)
        setUpcomingAppointments(futureApps.slice(0, 3)) 

        setTotalBlocks((allRecords?.length || 0) + allApps.length)
      }
    }

    fetchDashboardData()
  }, [userData.didWalletAddress])

  if (!ready || !authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      
      <VitalisSidebar activeItem={activeNav} />

      <main className="pl-64 relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Overview</h2>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                Welcome back, {userData.firstName}
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Network Status: Online
            </div>
          </div>

          {/* --- METRIC CARDS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1: Blocks Secured */}
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <Database className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                    On-Chain
                  </Badge>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-indigo-950">{totalBlocks}</p>
                    <span className="text-sm font-medium text-indigo-600/80">Txns</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total Blocks Secured
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Medical Records */}
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-white hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="h-3 w-3" /> Updated
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-blue-950">{totalRecords}</p>
                    <span className="text-sm font-medium text-blue-600/80">Docs</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Medical Records Stored
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Upcoming Appointments */}
            <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                    Upcoming
                  </Badge>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-emerald-950">{futureVisitsCount}</p>
                    <span className="text-sm font-medium text-emerald-600/80">Visits</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Confirmed Appointments
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Records List */}
            <Card className="lg:col-span-2 border-border/60 bg-card/40 backdrop-blur-md shadow-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">Recent Records</CardTitle>
                  <CardDescription>Latest updates to your medical history</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push('/medical-record')} className="text-primary hover:text-primary hover:bg-primary/10 gap-1">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                {recentRecords.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted-foreground/10 rounded-xl bg-muted/5">
                    <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                      <Inbox className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-foreground">No records found</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-1">
                      Upload your first medical record to secure it on the blockchain.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{record.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{record.type} • {record.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:flex text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                            {record.file_hash.slice(0, 6)}...
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments List */}
            <Card className="border-border/60 bg-card/40 backdrop-blur-md shadow-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">Schedule</CardTitle>
                  <CardDescription>Your next visits</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push('/data-consent')} className="h-8 w-8 text-muted-foreground">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                {upcomingAppointments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted-foreground/10 rounded-xl bg-muted/5">
                    <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-semibold text-foreground">No appointments</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] mt-1">
                      You have no upcoming visits scheduled.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((app) => (
                      <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg border bg-background/50">
                         <div className="flex flex-col items-center justify-center h-12 w-12 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                            <span>{new Date(app.appointment_date).getDate()}</span>
                            <span className="uppercase">{new Date(app.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                         </div>
                         <div>
                            <p className="font-semibold text-sm">{app.doctors?.name}</p>
                            <p className="text-xs text-muted-foreground">{app.hospitals?.name}</p>
                            <p className="text-xs text-muted-foreground font-medium text-primary mt-0.5">{app.appointment_time.slice(0, 5)}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}