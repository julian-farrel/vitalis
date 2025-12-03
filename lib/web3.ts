import { createWalletClient, custom, http, publicActions } from 'viem'
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'
import { mainnet, sepolia } from 'viem/chains'

// 1. GENERATE A NEW HEALTH WALLET (DID)
export const generateHealthWallet = () => {
  // Generates a random private key
  const privateKey = generatePrivateKey()
  // Creates an account from that key
  const account = privateKeyToAccount(privateKey)
  
  return {
    address: account.address,
    privateKey: privateKey
  }
}

// 2. SMART CONTRACT CONFIGURATION (Example)
// In a real app, you would deploy this contract and paste the address here.
export const VITALIS_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" 

export const VITALIS_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_did", "type": "address" }],
    "name": "registerPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// 3. FUNCTION TO REGISTER DID ON-CHAIN
export const registerDIDOnChain = async (didAddress: string) => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  try {
    const client = createWalletClient({
      chain: sepolia, // Using Sepolia testnet for dev
      transport: custom(window.ethereum)
    }).extend(publicActions)

    const [account] = await client.requestAddresses()

    // This prompts the user's MetaMask to sign a transaction
    const hash = await client.writeContract({
      account,
      address: VITALIS_CONTRACT_ADDRESS,
      abi: VITALIS_ABI,
      functionName: 'registerPatient',
      args: [didAddress as `0x${string}`]
    })

    return hash
  } catch (error) {
    console.error("Smart Contract Error:", error)
    return null
  }
}