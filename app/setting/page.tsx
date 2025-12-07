"use client"

import { 
  LogOut, 
  KeyRound,
  User,
  Mail,
  MapPin,
  Phone
} from "lucide-react"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { logout } = usePrivy()
  const router = useRouter()
  const { userData } = useUser()

  const handleDisconnect = async () => {
    await logout()
    sessionStorage.removeItem("vitalis_session_active")
    router.push("/")
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <VitalisSidebar activeItem="Settings" />
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your digital identity and view security status.</p>
            </div>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your registered identity details (Read-Only).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input disabled value={`${userData.firstName} ${userData.lastName}`} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input disabled value={userData.email} className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Home Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input disabled value={userData.address} className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input disabled value={userData.emergencyContact} className="pl-9" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 hover:bg-destructive/10 hover:border-destructive/40">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-full border border-destructive/10 shadow-sm">
                   <KeyRound className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">Disconnect Wallet</h3>
                  <p className="text-sm text-muted-foreground">This will lock your local vault and prevent further signing.</p>
                </div>
             </div>

             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                      variant="destructive" 
                      className="gap-2 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-lg hover:bg-red-600"
                  >
                      <LogOut className="h-4 w-4" /> Disconnect
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will disconnect your wallet from Vitalis. You will need to reconnect to access your medical records and dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
          </div>

        </div>
      </main>
    </div>
  )
}