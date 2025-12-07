"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { supabase } from "@/lib/supabase"
import { bookAppointmentOnChain, cancelAppointmentOnChain, revokeAccessOnChain, getOnChainAppointmentId } from "@/lib/web3"
import { useUser } from "@/context/user-context"
import { 
  ShieldCheck, MapPin, Stethoscope, Calendar, Clock, 
  User, Loader2, History, ExternalLink, CheckCircle2,
  ArrowLeft, XCircle, Ban
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
import Image from "next/image"

export default function DataConsentPage() {
  const { userData } = useUser()
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()

  const [hospitals, setHospitals] = useState<any[]>([])
  const [activePermissions, setActivePermissions] = useState<any[]>([])
  const [bookingHistory, setBookingHistory] = useState<any[]>([]) 
  
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [bookingStep, setBookingStep] = useState<"details" | "doctors" | "schedule" | "confirm">("details")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchData = async () => {
    const { data: hospitalData } = await supabase.from('hospitals').select('*')
    if (hospitalData) setHospitals(hospitalData)

    if (userData.didWalletAddress) {
      const { data: appData } = await supabase
        .from('appointments')
        .select('*, hospitals(*), doctors(*)')
        .eq('patient_wallet', userData.didWalletAddress)
        .order('created_at', { ascending: false })
      
      if (appData) {
        setBookingHistory(appData)

        // Filter for hospitals with at least one CONFIRMED appointment
        const activeApps = appData.filter(a => a.status === 'Confirmed')
        const uniqueHospitalIds = Array.from(new Set(activeApps.map(a => a.hospital_id)))
        
        const activePerms = uniqueHospitalIds.map(id => {
           return appData.find(a => a.hospital_id === id)?.hospitals
        }).filter(Boolean)
        
        setActivePermissions(activePerms)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [userData.didWalletAddress])

  const handleHospitalClick = async (hospital: any) => {
    setSelectedHospital(hospital)
    setBookingStep("details")
    setIsDetailsOpen(true)
    
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('hospital_id', hospital.id)
    if (data) setDoctors(data)
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return

    setIsProcessing(true)
    try {
      const activeWallet = wallets.find((w) => w.address === user?.wallet?.address);
      if (!activeWallet) throw new Error("Wallet not found");
      const provider = await activeWallet.getEthereumProvider();

      const txHash = await bookAppointmentOnChain(
        selectedHospital.id,
        selectedDoctor.id,
        selectedDate,
        selectedTime,
        provider
      )

      const { error } = await supabase.from('appointments').insert({
        patient_wallet: userData.didWalletAddress,
        doctor_id: selectedDoctor.id,
        hospital_id: selectedHospital.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        status: "Confirmed",
        tx_hash: txHash
      })

      if (error) throw error

      toast({ title: "Success", description: "Appointment confirmed on blockchain!" })
      setIsDetailsOpen(false)
      fetchData()

    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelAppointment = async (appointment: any) => {
    setIsProcessing(true)
    try {
      const activeWallet = wallets.find((w) => w.address === user?.wallet?.address);
      if (!activeWallet) throw new Error("Wallet not found");
      const provider = await activeWallet.getEthereumProvider();

      // 1. Get the correct ID from Blockchain
      // This helper now handles the 09:00 vs 09:00:00 time mismatch
      const onChainId = await getOnChainAppointmentId(
          appointment.hospital_id,
          appointment.doctor_id,
          appointment.appointment_date,
          appointment.appointment_time,
          provider
      )

      if (onChainId === null) {
          throw new Error("Active appointment not found on blockchain. It may already be cancelled.");
      }

      // 2. Cancel using the ID
      await cancelAppointmentOnChain(onChainId, provider)

      // 3. Update Database
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', appointment.id)

      if (error) throw error

      toast({ title: "Cancelled", description: "Appointment cancelled successfully." })
      fetchData()
    } catch (error: any) {
      console.error(error)
      // Clean up error message for user
      const msg = error.message.includes("User rejected") ? "Transaction rejected" : error.message;
      toast({ title: "Error", description: msg, variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRevokeAccess = async (hospitalId: number) => {
    setIsProcessing(true)
    try {
      const activeWallet = wallets.find((w) => w.address === user?.wallet?.address);
      if (!activeWallet) throw new Error("Wallet not found");
      const provider = await activeWallet.getEthereumProvider();

      await revokeAccessOnChain(hospitalId, provider)

      // Optimistic Update: Remove card immediately from UI
      // This fixes the "flicker" issue
      setActivePermissions(prev => prev.filter(p => p.id !== hospitalId))

      const { error } = await supabase
        .from('appointments')
        .update({ status: 'Revoked' })
        .eq('hospital_id', hospitalId)
        .eq('status', 'Confirmed')
        .eq('patient_wallet', userData.didWalletAddress)

      if (error) throw error

      toast({ title: "Access Revoked", description: "All active permissions for this provider have been removed." })
      
      // We still fetch data to sync, but the optimistic update makes it feel instant
      fetchData()
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: "Failed to revoke access on-chain.", variant: "destructive" })
      // If error, re-fetch to restore the card
      fetchData() 
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <VitalisSidebar activeItem="Data Consent" />
      
      <main className="pl-64 w-full">
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Data Consent & Booking</h1>
              <p className="text-muted-foreground">Manage access and book appointments with verified providers.</p>
            </div>
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-semibold">Active Permissions</h2>
             {activePermissions.length === 0 ? (
               <div className="p-6 border border-dashed rounded-xl text-center text-muted-foreground bg-muted/20">
                 No healthcare providers currently have authorized access.
               </div>
             ) : (
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {activePermissions.map((hospital: any) => (
                   <div 
                    key={hospital?.id} 
                    className="relative overflow-hidden flex flex-col gap-4 p-4 rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 shadow-sm"
                   >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={hospital?.logo_url || "/placeholder-logo.png"} />
                          <AvatarFallback>HP</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{hospital?.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="secondary" className="bg-white/80 text-emerald-700 border-emerald-100">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Authorized
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="w-full bg-red-100 text-red-700 hover:bg-red-200 border-red-200 border shadow-none">
                              <Ban className="w-3 h-3 mr-2" /> Revoke Access
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will cancel all upcoming appointments with <strong>{hospital?.name}</strong> and revoke their permission to view your on-chain records. This action is recorded on the blockchain.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRevokeAccess(hospital.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isProcessing ? "Revoking..." : "Yes, Revoke"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Verified Healthcare Partners</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {hospitals.map((hospital) => (
                <Card 
                  key={hospital.id} 
                  className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                  onClick={() => handleHospitalClick(hospital)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={hospital.logo_url || "/placeholder-logo.png"} className="object-contain" />
                      <AvatarFallback>H</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{hospital.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-xs mt-1">
                         <MapPin className="h-3 w-3" /> {hospital.address.split(',')[0]}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{hospital.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 text-primary bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      View Details & Book
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                History
              </h2>
            </div>
            
            {bookingHistory.length === 0 ? (
              <div className="p-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10 gap-2">
                <Calendar className="h-8 w-8 opacity-20" />
                <p>No appointment history found.</p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="divide-y">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`flex flex-col items-center justify-center h-14 w-14 rounded-xl border ${booking.status === 'Cancelled' || booking.status === 'Revoked' ? 'bg-muted text-muted-foreground border-border' : 'bg-primary/5 text-primary border-primary/10'}`}>
                          <span className="text-xl font-bold leading-none">{new Date(booking.appointment_date).getDate()}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(booking.appointment_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold text-sm ${booking.status === 'Cancelled' || booking.status === 'Revoked' ? 'text-muted-foreground line-through' : ''}`}>{booking.hospitals?.name}</h4>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground">
                              {booking.appointment_time.slice(0, 5)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <User className="h-3 w-3" />
                            Dr. {booking.doctors?.name} <span className="opacity-50">•</span> {booking.doctors?.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0 pl-[4.5rem] md:pl-0">
                        {booking.tx_hash && (
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${booking.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                            title="View Transaction"
                          >
                            <span className="font-mono">{booking.tx_hash.slice(0, 6)}...{booking.tx_hash.slice(-4)}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`
                            shadow-none border-0 
                            ${booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                              booking.status === 'Cancelled' ? 'bg-muted text-muted-foreground' : 
                              booking.status === 'Revoked' ? 'bg-red-100 text-red-700' : 'bg-secondary'}
                          `}>
                            {booking.status}
                          </Badge>

                          {booking.status === 'Confirmed' && (
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                                    disabled={isProcessing}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" /> Cancel
                                  </Button>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     Are you sure you want to cancel your appointment with <strong>Dr. {booking.doctors?.name}</strong> on {booking.appointment_date}? This action is irreversible and recorded on the blockchain.
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                   <AlertDialogAction 
                                      onClick={() => handleCancelAppointment(booking)}
                                      className="bg-destructive hover:bg-destructive/90"
                                   >
                                     {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                                   </AlertDialogAction>
                                 </AlertDialogFooter>
                               </AlertDialogContent>
                             </AlertDialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <div className="flex items-center gap-2">
                   {bookingStep !== "details" && (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => setBookingStep("details")} 
                       className="h-6 w-6 rounded-full"
                     >
                       <ArrowLeft className="h-4 w-4" />
                     </Button>
                   )}
                   <DialogTitle>{selectedHospital?.name}</DialogTitle>
                </div>
                <DialogDescription>{selectedHospital?.address}</DialogDescription>
              </DialogHeader>

              {bookingStep === "details" && selectedHospital && (
                <div className="space-y-6 py-4">
                  <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {selectedHospital.image_url ? (
                      <Image 
                        src={selectedHospital.image_url} 
                        alt={selectedHospital.name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <Image 
                        src="/placeholder.jpg" 
                        alt="Hospital Placeholder" 
                        fill 
                        className="object-cover opacity-80" 
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedHospital.description}</p>
                  <Button onClick={() => setBookingStep("doctors")} className="w-full">Book Appointment</Button>
                </div>
              )}

              {bookingStep === "doctors" && (
                <div className="space-y-4 py-2">
                  <h3 className="font-semibold text-sm">Select a Specialist</h3>
                  <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                    {doctors.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => { setSelectedDoctor(doc); setBookingStep("schedule"); }}
                      >
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                             <User className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="font-medium text-sm">{doc.name}</p>
                             <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                           </div>
                         </div>
                         <Badge variant="secondary">{doc.price}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === "schedule" && selectedDoctor && (
                <div className="space-y-6 py-2">
                   <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Booking with {selectedDoctor.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedDoctor.specialty}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Select onValueChange={setSelectedTime}>
                           <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                           <SelectContent>
                             {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(t => (
                               <SelectItem key={t} value={t}>{t}</SelectItem>
                             ))}
                           </SelectContent>
                        </Select>
                      </div>
                   </div>
                   <Button className="w-full" onClick={() => setBookingStep("confirm")} disabled={!selectedDate || !selectedTime}>Continue</Button>
                </div>
              )}

              {bookingStep === "confirm" && (
                <div className="space-y-6 py-4 text-center">
                   <div className="bg-muted/40 p-4 rounded-xl text-left space-y-3 border">
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Provider</span><span className="font-medium">{selectedHospital.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{selectedDoctor.name}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date & Time</span><span className="font-medium">{selectedDate} at {selectedTime}</span></div>
                   </div>
                   <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 text-left flex gap-2">
                     <Clock className="h-4 w-4 shrink-0" />
                     Confirming will record this consent on the blockchain.
                   </div>
                   <Button className="w-full" onClick={handleBookAppointment} disabled={isProcessing}>
                     {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</> : "Confirm"}
                   </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  )
}