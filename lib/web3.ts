import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export const VITALIS_CONTRACT_ADDRESS = "0x616E65710C077f06f0B013CF20f8Bf8dA652D368" 

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

export const cancelAppointmentOnChain = async (appointmentId: number, provider: any) => {
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
    args: [BigInt(appointmentId)]
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