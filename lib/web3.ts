import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export const VITALIS_CONTRACT_ADDRESS = "0x7598493c3EE09694fb46bfB6c81A2963cEb5F8Ac" 

export const VITALIS_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_did", "type": "address" }],
    "name": "registerPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_dependentDID", "type": "address" }],
    "name": "registerDependent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDependents",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyDID",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_recordHash", "type": "string" },
      { "internalType": "string", "name": "_metadata", "type": "string" }
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_hospitalId", "type": "uint256" },
      { "internalType": "uint256", "name": "_doctorId", "type": "uint256" },
      { "internalType": "string", "name": "_date", "type": "string" },
      { "internalType": "string", "name": "_time", "type": "string" }
    ],
    "name": "bookAppointment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_appointmentId", "type": "uint256" }],
    "name": "cancelAppointment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_hospitalId", "type": "uint256" }],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyAppointments",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "patient", "type": "address" },
          { "internalType": "uint256", "name": "doctorId", "type": "uint256" },
          { "internalType": "uint256", "name": "hospitalId", "type": "uint256" },
          { "internalType": "string", "name": "date", "type": "string" },
          { "internalType": "string", "name": "time", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "status", "type": "string" }
        ],
        "internalType": "struct Vitalis.Appointment[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const generateHealthWallet = () => {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  return { address: account.address, privateKey: privateKey }
}

export const registerDIDOnChain = async (didAddress: string, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");
  
  try {
    const client = createWalletClient({
      chain: sepolia, 
      transport: custom(provider)
    }).extend(publicActions)

    const [account] = await client.requestAddresses()

    const hash = await client.writeContract({
      account,
      address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
      abi: VITALIS_ABI,
      functionName: 'registerPatient',
      args: [didAddress as `0x${string}`]
    })
    return hash
  } catch (error) {
    console.error("Smart Contract Error:", error)
    throw error 
  }
}

export const registerDependentOnChain = async (dependentDID: string, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");
  
  try {
    const client = createWalletClient({
      chain: sepolia, 
      transport: custom(provider)
    }).extend(publicActions)

    const [account] = await client.requestAddresses()

    const hash = await client.writeContract({
      account,
      address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
      abi: VITALIS_ABI,
      functionName: 'registerDependent',
      args: [dependentDID as `0x${string}`]
    })
    return hash
  } catch (error) {
    console.error("Smart Contract Error:", error)
    throw error 
  }
}

export const addRecordToBlockchain = async (recordHash: string, metadata: string, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(provider)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  const hash = await client.writeContract({
    account,
    address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VITALIS_ABI,
    functionName: 'addRecord',
    args: [recordHash, metadata]
  })

  return hash;
}

export const bookAppointmentOnChain = async (
  hospitalId: number,
  doctorId: number,
  date: string,
  time: string,
  provider: any
) => {
  if (!provider) throw new Error("No wallet provider found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(provider)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  const hash = await client.writeContract({
    account,
    address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VITALIS_ABI,
    functionName: 'bookAppointment',
    args: [BigInt(hospitalId), BigInt(doctorId), date, time]
  })

  return hash;
}

export const cancelAppointmentOnChain = async (appointmentId: bigint, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(provider)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  const hash = await client.writeContract({
    account,
    address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VITALIS_ABI,
    functionName: 'cancelAppointment',
    args: [appointmentId]
  })

  return hash;
}

export const revokeAccessOnChain = async (hospitalId: number, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(provider)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  const hash = await client.writeContract({
    account,
    address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VITALIS_ABI,
    functionName: 'revokeAccess',
    args: [BigInt(hospitalId)]
  })

  return hash;
}

// === NEW HELPER FUNCTION ADDED HERE ===
export const getOnChainAppointmentId = async (
    hospitalId: number,
    doctorId: number,
    date: string,
    time: string,
    provider: any
) => {
    if (!provider) throw new Error("No wallet provider found");

    const client = createWalletClient({
        chain: sepolia,
        transport: custom(provider)
    }).extend(publicActions)

    const [account] = await client.requestAddresses()

    // Read all appointments for this user from Blockchain
    const appointments: any = await client.readContract({
        address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
        abi: VITALIS_ABI,
        functionName: 'getMyAppointments',
        account: account
    })

    console.log("On-Chain Appointments Found:", appointments);
    console.log("Searching for:", { hospitalId, doctorId, date, time });

    // Find matching active appointment
    // Important: We slice the DB time (09:00:00) to match Contract time (09:00)
    const match = appointments.find((app: any) => {
        const dbTimeShort = time.slice(0, 5); // "09:00:00" -> "09:00"
        
        return Number(app.hospitalId) === hospitalId &&
               Number(app.doctorId) === doctorId &&
               app.date === date &&
               (app.time === time || app.time === dbTimeShort) && 
               app.status === "Confirmed"
    })

    if (!match) return null;
    return match.id; // Returns the BigInt ID required for the contract call
}