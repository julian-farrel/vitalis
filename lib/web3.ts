import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// *** IMPORTANT: REPLACE THIS WITH YOUR NEW DEPLOYED CONTRACT ADDRESS ***
export const VITALIS_CONTRACT_ADDRESS = "0x33031b613D7283c9ab74D3D9BdB2b5DEC134C61c" 

export const VITALIS_ABI = [
  // --- Identity & Records Functions ---
  {
    "inputs": [{ "internalType": "address", "name": "_did", "type": "address" }],
    "name": "registerPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
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
  // --- Appointment Functions ---
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

export const addRecordToBlockchain = async (recordHash: string, metadata: string, provider: any) => {
  if (!provider) throw new Error("No wallet provider found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(provider)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  // 1. Check registration first
  const myDID = await client.readContract({
      address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
      abi: VITALIS_ABI,
      functionName: 'getMyDID',
      account: account
  }) as string

  // If user is NOT registered (address is 0x0...), register them first
  if (!myDID || myDID === "0x0000000000000000000000000000000000000000") {
      console.log("User not registered. Auto-registering now...")
      const regHash = await client.writeContract({
          account,
          address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
          abi: VITALIS_ABI,
          functionName: 'registerPatient',
          args: [account]
      })
      // Wait for registration transaction to complete
      await client.waitForTransactionReceipt({ hash: regHash })
      console.log("Registration complete. Proceeding to add record...")
  }

  // 2. Now add the record
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

  // 1. Check registration first
  const myDID = await client.readContract({
      address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
      abi: VITALIS_ABI,
      functionName: 'getMyDID',
      account: account
  }) as string

   // If user is NOT registered, register them first
   if (!myDID || myDID === "0x0000000000000000000000000000000000000000") {
      console.log("User not registered. Auto-registering now...")
      const regHash = await client.writeContract({
          account,
          address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
          abi: VITALIS_ABI,
          functionName: 'registerPatient',
          args: [account]
      })
      await client.waitForTransactionReceipt({ hash: regHash })
  }

  // 2. Book Appointment
  const hash = await client.writeContract({
    account,
    address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
    abi: VITALIS_ABI,
    functionName: 'bookAppointment',
    args: [BigInt(hospitalId), BigInt(doctorId), date, time]
  })

  return hash;
}