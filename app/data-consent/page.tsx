"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { supabase } from "@/lib/supabase"
import { bookAppointmentOnChain } from "@/lib/web3"
import { useUser } from "@/context/user-context"
import { 
  ShieldCheck, MapPin, Stethoscope, Calendar, Clock, 
  Building2, User, Loader2
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
import Image from "next/image"

export default function DataConsentPage() {
  const { userData } = useUser()
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()

  const [hospitals, setHospitals] = useState<any[]>([])
  const [activePermissions, setActivePermissions] = useState<any[]>([])
  
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [bookingStep, setBookingStep] = useState<"details" | "doctors" | "schedule" | "confirm">("details")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: hospitalData } = await supabase.from('hospitals').select('*')
      if (hospitalData) setHospitals(hospitalData)

      if (userData.didWalletAddress) {
        const { data: appData } = await supabase
          .from('appointments')
          .select('*, hospitals(*)')
          .eq('patient_wallet', userData.didWalletAddress)
        
        if (appData) {
          const uniqueHospitals = Array.from(new Set(appData.map(a => a.hospital_id)))
            .map(id => appData.find(a => a.hospital_id === id)?.hospitals)
          setActivePermissions(uniqueHospitals)
        }
      }
    }
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
      
      if (!activePermissions.find(p => p.id === selectedHospital.id)) {
        setActivePermissions(prev => [...prev, selectedHospital])
      }
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message, variant: "destructive" })
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
                 No healthcare providers currently have access to your data. Book an appointment to grant access.
               </div>
             ) : (
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {activePermissions.map((hospital: any) => (
                   <div key={hospital?.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={hospital?.logo_url || "/placeholder-logo.png"} />
                        <AvatarFallback>HP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{hospital?.name}</p>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Authorized</Badge>
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
                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      View Details & Book
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <div className="flex items-center gap-2">
                   {bookingStep !== "details" && (
                     <Button variant="ghost" size="sm" onClick={() => setBookingStep("details")} className="h-6 px-2">Back</Button>
                   )}
                   <DialogTitle>{selectedHospital?.name}</DialogTitle>
                </div>
                <DialogDescription>{selectedHospital?.address}</DialogDescription>
              </DialogHeader>

              {bookingStep === "details" && selectedHospital && (
                <div className="space-y-6 py-4">
                  {/* Updated Image Section */}
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
                     {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</> : "Confirm & Pay"}
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