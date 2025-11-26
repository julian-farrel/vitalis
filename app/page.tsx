"use client"

import { useState } from "react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Activity, Heart, Thermometer, Droplets, Calendar, Clock, FileText, Shield, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const healthMetrics = [
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
  {
    label: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Temperature",
    value: "98.6",
    unit: "°F",
    icon: Thermometer,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "Blood Glucose",
    value: "95",
    unit: "mg/dL",
    icon: Droplets,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
]

const recentRecords = [
  {
    type: "Lab Results",
    date: "Nov 20, 2025",
    provider: "City Medical Lab",
    status: "Verified",
  },
  {
    type: "Prescription",
    date: "Nov 15, 2025",
    provider: "Dr. Sarah Chen",
    status: "Active",
  },
  {
    type: "Visit Summary",
    date: "Nov 10, 2025",
    provider: "Metro Health Clinic",
    status: "Verified",
  },
]

const upcomingAppointments = [
  {
    doctor: "Dr. Sarah Chen",
    specialty: "General Practitioner",
    date: "Nov 28, 2025",
    time: "10:00 AM",
    initials: "SC",
  },
  {
    doctor: "Dr. Michael Park",
    specialty: "Cardiologist",
    date: "Dec 5, 2025",
    time: "2:30 PM",
    initials: "MP",
  },
]

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Home")

  return (
    <main className="min-h-dvh bg-background">
      <VitalisSidebar activeItem={activeNav} onNavigate={setActiveNav} />

      {/* Main Content */}
      <section className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back, John</h1>
            <p className="text-muted-foreground mt-1">Your health data is secure and owned by you on the blockchain.</p>
          </div>

          {/* Health Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {healthMetrics.map((metric) => (
              <Card key={metric.label} className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border-0">
                      Normal
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {metric.label} <span className="text-xs">({metric.unit})</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Medical Records */}
            <Card className="lg:col-span-2 border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg text-foreground">Recent Medical Records</CardTitle>
                  <CardDescription>Your latest verified health documents</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recentRecords.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{record.type}</p>
                          <p className="text-xs text-muted-foreground">{record.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          <Shield className="h-3 w-3 mr-1" />
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled visits</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {upcomingAppointments.map((apt, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-secondary/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {apt.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-foreground">{apt.doctor}</p>
                          <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {apt.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {apt.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Ownership Banner */}
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
