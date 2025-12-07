"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase } from "@/lib/supabase"
import { registerDependentOnChain } from "@/lib/web3"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, UserPlus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAddress } from 'viem'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function FamilyManager() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { toast } = useToast()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dependents, setDependents] = useState<any[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    relationship: "Child",
    bloodType: ""
  })

  useEffect(() => {
    if (user?.wallet?.address) {
      fetchDependents()
    }
  }, [user?.wallet?.address])

  const fetchDependents = async () => {
    if (!user?.wallet?.address) return
    const { data } = await supabase
      .from('dependents')
      .select('*')
      .eq('guardian_wallet', user.wallet.address)
    
    if (data) setDependents(data)
  }

  const generateDependentDID = async () => {
    const dataString = `${formData.firstName}${formData.lastName}${formData.dob}${user?.wallet?.address}`.toLowerCase().trim()
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(dataString)
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return getAddress(`0x${hashHex.substring(0, 40)}`)
  }

  const handleRegister = async () => {
    if (!user?.wallet?.address) return
    if (!formData.firstName || !formData.lastName) {
       toast({ title: "Error", description: "Name is required", variant: "destructive" })
       return
    }

    setIsLoading(true)

    try {
      const activeWallet = wallets.find((w) => w.address === user.wallet?.address)
      if (!activeWallet) throw new Error("Wallet not found")
      
      const dependentDID = await generateDependentDID()
      const provider = await activeWallet.getEthereumProvider()

      const txHash = await registerDependentOnChain(dependentDID, provider)
      console.log("Dependent minted:", txHash)

      const { error } = await supabase.from('dependents').insert({
        guardian_wallet: user.wallet.address,
        did_address: dependentDID,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dob: formData.dob,
        relationship: formData.relationship,
        blood_type: formData.bloodType
      })

      if (error) throw error

      toast({ title: "Success", description: "Dependent identity created and secured on-chain." })
      setIsOpen(false)
      fetchDependents()
      
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message || "Failed to register dependent", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          Family Members
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none">
              <Plus className="h-4 w-4"/> Add Dependent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Dependent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Relationship</Label>
                  <Select onValueChange={v => setFormData({...formData, relationship: v})} defaultValue="Child">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Blood Type</Label>
                  <Select onValueChange={v => setFormData({...formData, bloodType: v})}>
                    <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                       {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => (
                         <SelectItem key={t} value={t}>{t}</SelectItem>
                       ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Date of Birth</Label>
                <Input type="date" onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <Button onClick={handleRegister} disabled={isLoading} className="mt-2">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Create Identity (Gas Fee)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {dependents.length === 0 ? (
        <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
           No dependents added yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {dependents.map((dep) => (
            <Card key={dep.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-blue-100 text-blue-600">
                  <AvatarFallback>{dep.first_name[0]}{dep.last_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-semibold">{dep.first_name} {dep.last_name}</h4>
                  <p className="text-xs text-muted-foreground">{dep.relationship} • {dep.dob}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-1 truncate" title={dep.did_address}>
                    DID: {dep.did_address}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}