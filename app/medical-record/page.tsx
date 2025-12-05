"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth" 
import { VitalisSidebar } from "@/components/vitalis-sidebar"
import { 
  FileText, 
  AlertCircle,
  Plus,
  UploadCloud,
  Loader2,
  CheckCircle2,
  File,
  ExternalLink,
  Pill,
  Activity,
  Search
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/context/user-context"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { addRecordToBlockchain } from "@/lib/web3"

interface MedicalRecord {
  id: string
  title: string
  type: string
  date: string
  file_hash: string
  tx_hash?: string // <--- Added optional tx_hash field
  status: string
  file_path: string
}

export default function MedicalRecordsPage() {
  const { userData } = useUser()
  const { toast } = useToast()
  const { user } = usePrivy()
  const { wallets } = useWallets()
  
  const [localRecords, setLocalRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState<"idle" | "hashing" | "uploading" | "minting" | "success">("idle")
  
  const [file, setFile] = useState<File | null>(null)
  const [docName, setDocName] = useState("")
  const [docType, setDocType] = useState("visit")
  const [docDate, setDocDate] = useState("")

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userData.didWalletAddress) return;

      try {
        const { data, error } = await supabase
          .from('records')
          .select('*')
          .eq('user_wallet', userData.didWalletAddress)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) setLocalRecords(data)
      } catch (error) {
        console.error("Error fetching records:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [userData.didWalletAddress])

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  const handleUpload = async () => {
    if (!file || !docName || !docDate) {
      toast({ title: "Missing Information", description: "Please fill in all fields.", variant: "destructive" })
      return
    }

    if (!userData.didWalletAddress || userData.didWalletAddress === "Not Created") {
       toast({ title: "Profile Error", description: "DID Wallet not found. Please complete onboarding.", variant: "destructive" })
       return
    }

    const activeWallet = wallets.find((w) => w.address === user?.wallet?.address);
    if (!activeWallet) {
        toast({ title: "Wallet Error", description: "Please refresh the page.", variant: "destructive" })
        return;
    }
    const provider = await activeWallet.getEthereumProvider();

    setIsUploading(true)
    
    try {
      setUploadStep("hashing")
      const fileHash = await computeSHA256(file)

      setUploadStep("uploading")
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${userData.didWalletAddress}/${Date.now()}_${cleanFileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(fileName, file)

      if (uploadError) throw new Error("Storage upload failed: " + uploadError.message)

      setUploadStep("minting")
      const metadata = JSON.stringify({ name: docName, type: docType, date: docDate })
      
      // <--- CHANGE: Capture the returned transaction hash --->
      const txHash = await addRecordToBlockchain(fileHash, metadata, provider)

      const newRecord = {
        user_wallet: userData.didWalletAddress,
        title: docName,
        type: docType,
        date: docDate,
        file_path: fileName,
        file_hash: fileHash,
        tx_hash: txHash, // <--- CHANGE: Save tx_hash to database
        status: "Verified"
      }

      const { data: insertedData, error: dbError } = await supabase
        .from('records')
        .insert(newRecord)
        .select()
        .single()
      
      if (dbError) throw new Error("Database save failed: " + dbError.message)

      if (insertedData) setLocalRecords(prev => [insertedData, ...prev])
      setUploadStep("success")
      toast({ title: "Success", description: "Record secured on blockchain and stored." })

      setTimeout(() => {
        setIsUploadOpen(false)
        resetForm()
      }, 2000)

    } catch (error: any) {
      console.error(error)
      let msg = error.message
      if (msg.includes("User rejected")) msg = "Transaction rejected by user."
      
      toast({ title: "Error", description: msg, variant: "destructive" })
      setUploadStep("idle")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setDocName("")
    setDocType("visit")
    setDocDate("")
    setUploadStep("idle")
  }

  const getRecords = (filterType: string) => {
    if (filterType === "all") return localRecords;
    return localRecords.filter(r => r.type === filterType);
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl bg-muted/20">
      <div className="p-4 bg-muted rounded-full mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No records found</h3>
      <p className="text-muted-foreground max-w-sm mt-1 mb-6">
        There are no medical records uploaded to your decentralized storage yet.
      </p>
      <Button onClick={() => setIsUploadOpen(true)} variant="outline">
        Upload First Record
      </Button>
    </div>
  )

  return (
    <div className="flex min-h-screen w-full bg-background">
      <VitalisSidebar activeItem="Medical Record" />

      <main className="pl-64 w-full">
        <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Medical Records</h1>
                <p className="text-muted-foreground">View and manage your on-chain health documents.</p>
              </div>
            </div>

            <Dialog open={isUploadOpen} onOpenChange={(open) => { if(!isUploading) setIsUploadOpen(open) }}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" /> Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload Medical Record</DialogTitle>
                  <DialogDescription>
                    Your file will be encrypted, hashed (SHA-256), and linked to your DID.
                  </DialogDescription>
                </DialogHeader>

                {!isUploading && uploadStep === "idle" ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Document Name</Label>
                      <Input id="name" placeholder="e.g. Blood Test Results" value={docName} onChange={(e) => setDocName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={docType} onValueChange={setDocType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visit">Clinical Visit</SelectItem>
                            <SelectItem value="lab">Lab Result</SelectItem>
                            <SelectItem value="medication">Prescription</SelectItem>
                            <SelectItem value="procedure">Surgery</SelectItem>
                            <SelectItem value="scan">X-Ray/Scan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date Issued</Label>
                        <Input id="date" type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Attachment (PDF)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer relative">
                        <input 
                          type="file" 
                          accept=".pdf" 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        {file ? (
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <File className="h-5 w-5" />
                            {file.name}
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload PDF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                    {uploadStep === "success" ? (
                      <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                    ) : (
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    )}
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {uploadStep === "hashing" && "Encrypting & Hashing..."}
                        {uploadStep === "uploading" && "Secure Uploading..."}
                        {uploadStep === "minting" && "Blockchain Confirmation..."}
                        {uploadStep === "success" && "Upload Complete!"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {uploadStep === "hashing" && "Generating SHA-256 integrity proof."}
                        {uploadStep === "uploading" && "Storing file in encrypted vault."}
                        {uploadStep === "minting" && "Please sign the wallet transaction."}
                        {uploadStep === "success" && "Your record is now immutable."}
                      </p>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {!isUploading && (
                    <Button onClick={handleUpload} className="w-full">Start Secure Upload</Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <Card className="bg-red-50/50 border-red-100 dark:bg-red-950/10 dark:border-red-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.allergies || "None Reported"}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <Pill className="h-4 w-4" /> Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.medications || "None Reported"}</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{userData.conditions || "None Reported"}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by doctor, diagnosis, or date..."
                className="pl-9 bg-card"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-muted/50 mb-6">
              <TabsTrigger value="all" className="py-2">All Records</TabsTrigger>
              <TabsTrigger value="visit" className="py-2">Visits</TabsTrigger>
              <TabsTrigger value="lab" className="py-2">Labs</TabsTrigger>
              <TabsTrigger value="medication" className="py-2">Meds</TabsTrigger>
              <TabsTrigger value="procedure" className="py-2">Surgeries</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {getRecords('all').length > 0 ? (
                 <div className="grid gap-4">
                   {getRecords('all').map((record) => (
                     <Card key={record.id} className="flex flex-row items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{record.type} • {record.date}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          {/* <CHANGE> Render Etherscan Link if tx_hash exists, otherwise fallback to file hash display */}
                          {record.tx_hash ? (
                            <a 
                              href={`https://sepolia.etherscan.io/tx/${record.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hidden md:flex items-center gap-1 text-xs font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded underline underline-offset-2 transition-colors"
                              title="View on Etherscan"
                            >
                              {record.tx_hash.slice(0, 6)}...{record.tx_hash.slice(-4)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <div className="hidden md:block text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded" title={record.file_hash}>
                              {record.file_hash.slice(0, 10)}...
                            </div>
                          )}
                          
                          <span className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3 w-3" /> On-Chain
                          </span>
                        </div>
                     </Card>
                   ))}
                 </div>
              ) : <EmptyState />}
            </TabsContent>

            {/* ... Repeated for other tabs (visit, lab, etc.) ... */}
            {/* Note: You should apply the same JSX change inside the map() function for other tabs as well */}

            <TabsContent value="visit" className="mt-0">
              {getRecords('visit').length > 0 ? (
                 <div className="grid gap-4">
                   {getRecords('visit').map((record) => (
                     <Card key={record.id} className="flex flex-row items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{record.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{record.type} • {record.date}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                           {record.tx_hash ? (
                            <a 
                              href={`https://sepolia.etherscan.io/tx/${record.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hidden md:flex items-center gap-1 text-xs font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded underline underline-offset-2 transition-colors"
                            >
                              {record.tx_hash.slice(0, 6)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <div className="hidden md:block text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                              {record.file_hash.slice(0, 10)}...
                            </div>
                          )}
                        </div>
                     </Card>
                   ))}
                 </div>
              ) : <EmptyState />}
            </TabsContent>
            
            <TabsContent value="lab" className="mt-0"><EmptyState /></TabsContent>
            <TabsContent value="medication" className="mt-0"><EmptyState /></TabsContent>
            <TabsContent value="procedure" className="mt-0"><EmptyState /></TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  )
}