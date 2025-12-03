import { createWalletClient, custom, publicActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

// <--- PASTE YOUR DEPLOYED CONTRACT ADDRESS BELOW --->
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

export const generateHealthWallet = () => {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  return {
    address: account.address,
    privateKey: privateKey
  }
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