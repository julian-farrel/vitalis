"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, HeartPulse, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
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

export default function OnboardingPage() {
  const { ready, authenticated, user } = usePrivy()
  const { updateUserData } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState("Complete Setup")
  
  // Success Popup State
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
        const txHash = await registerDIDOnChain(didAddress)
        console.log("Transaction confirmed:", txHash)
      }

      setStatusText("Saving Profile...")

      // 3. Update Context
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

      // 4. Save to Supabase
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
      
      // 5. Show Success Dialog
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
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-lg border-border">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {step === 1 ? <User className="text-primary h-6 w-6" /> : <HeartPulse className="text-primary h-6 w-6" />}
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? "Complete Your Profile" : "Medical Profile"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "We need a few details to set up your decentralized identity." 
              : "This information helps medical providers treat you safely."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" placeholder="25" value={formData.age} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Textarea id="address" name="address" placeholder="123 Blockchain Blvd, Web3 City" value={formData.address} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                <Input id="emergencyContact" name="emergencyContact" type="tel" placeholder="+1 (555) 000-0000" value={formData.emergencyContact} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select onValueChange={(val) => handleSelectChange("bloodType", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea id="allergies" name="allergies" placeholder="Peanuts, Penicillin, etc. (Leave empty if none)" value={formData.allergies} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" name="medications" placeholder="List any daily medications..." value={formData.medications} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions</Label>
                <Textarea id="conditions" name="conditions" placeholder="Asthma, Diabetes, etc..." value={formData.conditions} onChange={handleInputChange} />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
              Back
            </Button>
          )}
          <div className={step === 1 ? "w-full flex justify-end" : ""}>
            {step === 1 ? (
              <Button onClick={handleNext} className="w-full sm:w-auto">
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {statusText}
                  </>
                ) : (
                  <>
                    {statusText} <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* FIXED Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-card text-card-foreground border-border">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-emerald-100/50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl text-foreground">Registration Successful!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-muted-foreground">
              Your decentralized identity (DID) has been generated and securely registered on the blockchain.
            </AlertDialogDescription>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Your DID Wallet Address</p>
              {/* Changed text color to standard foreground for readability */}
              <code className="text-sm font-mono text-foreground block break-all bg-background p-2 rounded border border-input">
                {createdDID}
              </code>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}