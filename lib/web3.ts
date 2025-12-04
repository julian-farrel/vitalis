// lib/web3.ts

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
  },
  // <--- Added: Function to store record hash
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

// 1. Helper to generate a new random wallet (Health DID)
export const generateHealthWallet = () => {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  
  return {
    address: account.address,
    privateKey: privateKey
  }
}

// 2. Function to interact with the Smart Contract: Register DID
export const registerDIDOnChain = async (didAddress: string) => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  try {
    const client = createWalletClient({
      chain: sepolia, 
      transport: custom(window.ethereum)
    }).extend(publicActions)

    try {
      await client.switchChain({ id: sepolia.id })
    } catch (e) {
      console.warn("Failed to switch chain:", e)
    }

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

// 3. <--- Added: Function to store Medical Record Hash on Blockchain
export const addRecordToBlockchain = async (recordHash: string, metadata: string) => {
  if (typeof window === 'undefined' || !window.ethereum) throw new Error("No Wallet Found");

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum)
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