import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// *** IMPORTANT: REPLACE THIS WITH YOUR NEW DEPLOYED CONTRACT ADDRESS ***
export const VITALIS_CONTRACT_ADDRESS = "0x4f6194E931b71F26fFae366470D56Ee3C40dD134" 

export const VITALIS_ABI = [
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
  }
] as const

export const generateHealthWallet = () => {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  return { address: account.address, privateKey: privateKey }
}

export const registerDIDOnChain = async (didAddress: string) => {
  if (typeof window === 'undefined' || !window.ethereum) return;
  try {
    const client = createWalletClient({
      chain: sepolia, 
      transport: custom(window.ethereum)
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

export const addRecordToBlockchain = async (recordHash: string, metadata: string) => {
  if (typeof window === 'undefined' || !window.ethereum) throw new Error("No Wallet Found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum)
  }).extend(publicActions)

  const [account] = await client.requestAddresses()

  // 1. Check registration first to avoid RPC Error
  const myDID = await client.readContract({
      address: VITALIS_CONTRACT_ADDRESS as `0x${string}`,
      abi: VITALIS_ABI,
      functionName: 'getMyDID',
      account: account
  }) as string

  // If user is NOT registered (address is 0x0...), register them first
  if (!myDID || myDID === "0x0000000000000000000000000000000000000000") {
      console.log("User not registered. Auto-registering now...")
      // We register the user's OWN wallet as their DID for simplicity in this flow
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