"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { supabase } from "@/lib/supabase"
import { registerDependentOnChain, generateMnemonicAndAddress } from "@/lib/web3" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, UserPlus, Users, Copy, AlertCircle, CheckCircle2 } from "lucide-react" 
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

  const [generatedMnemonic, setGeneratedMnemonic] = useState<string>("")
  const [generatedDid, setGeneratedDid] = useState<string>("")
  const [showMnemonic, setShowMnemonic] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    relationship: "Child",
    bloodType: ""
  })

  useEffect(() => {
    if (!isOpen) {
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            relationship: "Child",
            bloodType: ""
        })
        setGeneratedMnemonic("")
        setGeneratedDid("")
        setShowMnemonic(false)
    }
    if (user?.wallet?.address) {
      fetchDependents()
    }
  }, [user?.wallet?.address, isOpen])


  const fetchDependents = async () => {
    if (!user?.wallet?.address) return
    const { data } = await supabase
      .from('dependents')
      .select('*')
      .eq('guardian_wallet', user.wallet.address)
    
    if (data) setDependents(data)
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
      
      const { mnemonic, didAddress } = generateMnemonicAndAddress()
      setGeneratedMnemonic(mnemonic)
      setGeneratedDid(didAddress)
      
      const provider = await activeWallet.getEthereumProvider()

      const txHash = await registerDependentOnChain(didAddress, provider)
      console.log("Dependent minted:", txHash)

      const { error } = await supabase.from('dependents').insert({
        guardian_wallet: user.wallet.address,
        did_address: didAddress,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dob: formData.dob,
        relationship: formData.relationship,
        blood_type: formData.bloodType
      })

      if (error) throw error

      setShowMnemonic(true)
      
    } catch (error: any) {
      console.error(error)
      toast({ title: "Error", description: error.message || "Failed to register dependent", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMnemonicCopied = () => {
    navigator.clipboard.writeText(generatedMnemonic)
    toast({ title: "Copied!", description: "Recovery phrase copied to clipboard." })
  }

  const handleFinish = () => {
      setIsOpen(false)
      fetchDependents()
  }

  const DependentForm = (
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
  )

  const DependentMnemonicView = (
    <div className="grid gap-4 py-4">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">
                Identity for {formData.firstName} {formData.lastName} created successfully!
            </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-800 font-medium flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p><strong>CRITICAL:</strong> This is the **only time** you will see this recovery phrase. Write it down securely.</p>
        </div>

        <div className="bg-muted/50 rounded-xl border border-border p-4 flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">12-Word Recovery Phrase</span>
            <code className="font-mono text-base font-semibold text-foreground w-full text-center break-words leading-relaxed">
              {generatedMnemonic.split(' ').map((word, index) => (
                <span key={index} className="inline-block p-1" >
                  <span className="text-muted-foreground text-xs">{index + 1}.</span> {word}
                </span>
              ))}
            </code>
            <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleMnemonicCopied}
            >
                <Copy className="h-4 w-4" /> Copy Phrase
            </Button>
        </div>

        <div className="bg-muted/50 rounded-xl border border-border p-4 flex flex-col items-center gap-2">
           <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dependent DID Address</span>
           <code className="font-mono text-xs bg-background px-3 py-1.5 rounded-lg border border-border/50 text-foreground w-full text-center break-all">
             {generatedDid}
           </code>
        </div>
        
        <Button onClick={handleFinish} className="mt-2">
            Finish & View Family
        </Button>
    </div>
  )

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
              <DialogTitle>{showMnemonic ? "Recovery Phrase Generated" : "Register Dependent"}</DialogTitle>
            </DialogHeader>
            {showMnemonic ? DependentMnemonicView : DependentForm}
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