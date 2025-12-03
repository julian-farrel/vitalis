"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { useUser } from "@/context/user-context" // <--- Import Context Hook
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, HeartPulse, ArrowRight, CheckCircle2 } from "lucide-react"

export default function OnboardingPage() {
  const { ready, authenticated } = usePrivy()
  const { updateUserData } = useUser() // <--- Use context to update data
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Local form state
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

  const handleSubmit = () => {
    // 1. Update Global Context (This updates Sidebar instantly)
    updateUserData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dob: formData.dob,
      bloodType: formData.bloodType
    })

    // 2. Mark onboarding as complete
    localStorage.setItem("vitalis_onboarding_complete", "true")
    
    // 3. Redirect
    router.push("/dashboard")
  }

  if (!ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-lg border-border">
        {/* Same UI code as before... */}
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
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <div className={step === 1 ? "w-full flex justify-end" : ""}>
            {step === 1 ? (
              <Button onClick={handleNext} className="w-full sm:w-auto">
                Next Step <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Complete Setup <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}