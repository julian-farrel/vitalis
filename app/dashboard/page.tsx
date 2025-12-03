"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { 
  Users, 
  Bell, 
  ShieldCheck, 
  Database,
  Inbox,
  Calendar, // <--- Added
  Shield    // <--- Added
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/context/user-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar" // Added Avatar imports just in case, as they were used in the previous version

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Home")
  const { ready, authenticated } = usePrivy()
  const router = useRouter()
  const { userData } = useUser()

  // Real data state (initially empty)
  const recentRecords: any[] = [] 
  const upcomingAppointments: any[] = []

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  if (!ready || !authenticated) {
    return null
  }

  return (
    <main className="min-h-dvh bg-background">
      <VitalisSidebar activeItem={activeNav} />

      <section className="pl-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back, {userData.firstName}</h1>
            <p className="text-muted-foreground mt-1">Your health data is secure and owned by you on the blockchain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                      Active
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">0 Providers</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Currently accessing your data
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      0 New
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground truncate">No Requests</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pending read access
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-xl font-bold text-emerald-600">100%</span>
                  </div>
                  <p className="font-semibold text-foreground">Data Control</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Patient-owned status
                  </p>
                </div>
                <div className="mt-4">
                  <Progress value={100} className="h-2 bg-emerald-100 [&>div]:bg-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                      Synced
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">0 Blocks</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secured medical history
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg text-foreground">Recent Medical Records</CardTitle>
                  <CardDescription>Your latest verified health documents</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {recentRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <Inbox className="h-10 w-10 mb-2 opacity-50" />
                    <p>No medical records found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Map recentRecords here when data exists */}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                    <Calendar className="h-10 w-10 mb-2 opacity-50" />
                    <p>No upcoming appointments.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Map upcomingAppointments here when data exists */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Your Data, Your Control</h3>
                    <p className="text-sm text-muted-foreground">
                      All medical records are encrypted and stored on-chain. Only you decide who can access your health
                      data.
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-right mb-1">
                    <span className="text-sm font-medium text-foreground">Data Ownership</span>
                  </div>
                  <Progress value={100} className="w-32 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">100% patient-owned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}