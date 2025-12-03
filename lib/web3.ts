import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// Your Deployed Contract Address
export const VITALIS_CONTRACT_ADDRESS = "0xfbc6e41c9F21d5F718195C5A4F79B903155A2c67" 

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
  }
] as const

// 1. Helper to generate a new random wallet (Health DID)
export const generateHealthWallet = () => {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  
  return {
    address: account.address,
    privateKey: privateKey
  }
}

// 2. Function to interact with the Smart Contract
export const registerDIDOnChain = async (didAddress: string) => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  try {
    // Create the wallet client
    const client = createWalletClient({
      chain: sepolia, 
      transport: custom(window.ethereum)
    }).extend(publicActions)

    // FORCE SWITCH TO SEPOLIA NETWORK
    // This fixes the issue where the transaction fails simulation on wrong networks
    try {
      await client.switchChain({ id: sepolia.id })
    } catch (e) {
      console.warn("Failed to switch chain or user rejected request:", e)
      // We continue anyway; sometimes the user is already on the network but the request fails typically
    }

    // Request account access
    const [account] = await client.requestAddresses()

    // Send the transaction
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
    throw error // Propagate error so the UI shows the alert
  }
}