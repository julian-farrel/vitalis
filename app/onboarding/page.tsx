"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// UPDATE: Import useWallets
import { usePrivy, useWallets } from "@privy-io/react-auth" 
import { useUser } from "@/context/user-context"
// ... keep existing imports ...
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress" 
import { 
  User, 
  HeartPulse, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Activity,
  ArrowLeft
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/lib/supabase"
import { generateHealthWallet, registerDIDOnChain, VITALIS_CONTRACT_ADDRESS, VITALIS_ABI } from "@/lib/web3"
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import Image from "next/image"

export default function OnboardingPage() {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets() // UPDATE: Get wallets
  const { updateUserData } = useUser()
  const router = useRouter()
  // ... rest of state setup ...
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState("Complete Setup")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdDID, setCreatedDID] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    dob: "",
    address: "",
    email: "",
    emergencyContact: "",
    bloodType: "",
    allergies: "",
    medications: "",
    conditions: ""
  })

  // ... keep useEffect and input handlers ...
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!user?.wallet?.address) return;
    
    // UPDATE: Find the active wallet and get provider
    const activeWallet = wallets.find((w) => w.address === user.wallet?.address);
    if (!activeWallet) {
        alert("Wallet not found. Please refresh.");
        return;
    }
    const provider = await activeWallet.getEthereumProvider();

    setIsLoading(true)
    setStatusText("Verifying Identity...")

    try {
      let didAddress = ""

      // 1. Check if user is ALREADY registered on-chain
      const publicClient = createPublicClient({ 
        chain: sepolia, 
        transport: http() 
      })

      try {
        const existingDID = await publicClient.readContract({
          address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
          abi: VITALIS_ABI,
          functionName: 'getMyDID',
          account: user.wallet.address as `0x${string}`
        }) as string
        
        if (existingDID && existingDID !== "0x0000000000000000000000000000000000000000") {
          console.log("User already registered on-chain. DID:", existingDID)
          didAddress = existingDID
          setStatusText("Syncing Profile...")
        }
      } catch (err) {
        console.log("User not registered on-chain yet.")
      }

      // 2. If NO existing DID found, Register a new one on Blockchain
      if (!didAddress) {
        setStatusText("Generating Identity...")
        const healthWallet = generateHealthWallet()
        didAddress = healthWallet.address
        console.log("New DID generated:", didAddress)
        
        setStatusText("Waiting for Signature...")
        // UPDATE: Pass provider here
        const txHash = await registerDIDOnChain(didAddress, provider)
        console.log("Transaction confirmed:", txHash)
      }

      // ... Rest of the logic remains the same ...
      setStatusText("Saving Profile...")

      updateUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        bloodType: formData.bloodType,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        allergies: formData.allergies || "None",
        medications: formData.medications || "None",
        conditions: formData.conditions || "None",
        didWalletAddress: didAddress 
      })

      const { error } = await supabase
        .from('users')
        .upsert({
          wallet_address: user.wallet.address,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          dob: formData.dob,
          address: formData.address,
          emergency_contact: formData.emergencyContact,
          blood_type: formData.bloodType,
          allergies: formData.allergies,
          medications: formData.medications,
          conditions: formData.conditions,
          did_wallet_address: didAddress, 
          onboarding_complete: true
        })

      if (error) throw error
      
      setCreatedDID(didAddress)
      setShowSuccessDialog(true)

    } catch (error: any) {
      console.error("Onboarding Error:", error)
      if (error.message && (error.message.includes("Internal JSON-RPC error") || error.message.includes("execution reverted"))) {
        alert("Blockchain Error: The transaction failed. Please check if you have enough Sepolia ETH or if the network is busy.")
      } else {
        alert("Failed to complete setup. Please check console for details.")
      }
    } finally {
      setIsLoading(false)
      setStatusText("Complete Setup")
    }
  }

  if (!ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* ... (Keep existing JSX exactly as is) ... */}
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="absolute top-8 left-8 flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity">
         <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/20">
            <Image 
              src="/vitalis-logo.png" 
              alt="Vitalis Logo" 
              fill
              className="object-cover"
            />
         </div>
         <span className="font-bold text-lg tracking-tight">Vitalis Medical</span>
      </div>

      <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-700">
        
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Identity Setup
            </h1>
            <p className="text-sm text-muted-foreground">Step {step} of 2</p>
          </div>
          <div className="w-1/3">
            <Progress value={step === 1 ? 50 : 100} className="h-2" />
          </div>
        </div>

        <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
          
          <CardHeader className="text-center pb-8 pt-10">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${step === 1 ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
              {step === 1 ? <User className="h-8 w-8" /> : <HeartPulse className="h-8 w-8" />}
            </div>
            
            <CardTitle className="text-3xl font-bold">
              {step === 1 ? "Personal Identity" : "Medical Profile"}
            </CardTitle>
            <CardDescription className="text-base max-w-md mx-auto mt-2">
              {step === 1 
                ? "Let's establish your decentralized identifier (DID). These details will be encrypted and stored securely." 
                : "This critical health data helps providers deliver accurate care. It remains under your control."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8 md:px-12 pb-10">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="Jane" className="bg-background/50 h-11" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" className="bg-background/50 h-11" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" className="bg-background/50 h-11" value={formData.dob} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Age</Label>
                    <Input id="age" name="age" type="number" placeholder="25" className="bg-background/50 h-11" value={formData.age} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="jane@vitalis.health" className="bg-background/50 h-11" value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Physical Address</Label>
                  <Textarea id="address" name="address" placeholder="123 Blockchain Blvd, Web3 City" className="bg-background/50 min-h-[80px] resize-none" value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Emergency Contact</Label>
                  <Input id="emergencyContact" name="emergencyContact" type="tel" placeholder="+1 (555) 000-0000" className="bg-background/50 h-11" value={formData.emergencyContact} onChange={handleInputChange} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                   <Activity className="h-5 w-5 text-primary mt-0.5" />
                   <p className="text-sm text-muted-foreground">
                     <span className="font-medium text-foreground">Note:</span> This information is hashed on-chain. Only authorized doctors can view the full details.
                   </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Blood Type</Label>
                  <Select onValueChange={(val) => handleSelectChange("bloodType", val)}>
                    <SelectTrigger className="bg-background/50 h-11">
                      <SelectValue placeholder="Select Blood Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Known Allergies</Label>
                  <Textarea id="allergies" name="allergies" placeholder="e.g. Penicillin, Peanuts, Latex..." className="bg-background/50 min-h-[80px]" value={formData.allergies} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Current Medications</Label>
                  <Textarea id="medications" name="medications" placeholder="List active prescriptions..." className="bg-background/50 min-h-[80px]" value={formData.medications} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions" className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Medical Conditions</Label>
                  <Textarea id="conditions" name="conditions" placeholder="e.g. Asthma, Type 2 Diabetes..." className="bg-background/50 min-h-[80px]" value={formData.conditions} onChange={handleInputChange} />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between px-8 md:px-12 pb-10 pt-2 bg-muted/20 border-t border-border/40">
            {step === 2 ? (
              <Button variant="ghost" onClick={() => setStep(1)} disabled={isLoading} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : (
              <div /> // Spacer
            )}
            
            <div className={step === 1 ? "w-full flex justify-end" : ""}>
              {step === 1 ? (
                <Button onClick={handleNext} size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto">
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {statusText}
                    </>
                  ) : (
                    <>
                      {statusText} <ShieldCheck className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-card text-card-foreground border-border max-w-md p-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-emerald-500/20 to-transparent pointer-events-none" />
          
          <AlertDialogHeader className="pt-10 px-6 pb-2 text-center relative z-10">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-emerald-100 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold">Identity Verified</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2">
              Your decentralized identity (DID) has been successfully minted on the blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-6 py-4">
             <div className="bg-muted/50 rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Public DID Address</span>
                <code className="font-mono text-sm bg-background px-3 py-1.5 rounded-lg border border-border/50 text-foreground w-full text-center break-all">
                  {createdDID}
                </code>
             </div>
          </div>

          <AlertDialogFooter className="p-6 pt-2 sm:justify-center">
            <AlertDialogAction 
              onClick={() => router.push("/dashboard")}
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
            >
              Enter Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}