# Vitalis Medical 🏥

**Vitalis** is a decentralized medical identity and health record management platform built on the Ethereum blockchain. It empowers patients with full ownership of their data, allowing for secure storage, selective sharing with healthcare providers, and immutable on-chain verification of medical history.

## ✨ New Feature: Family Guardian
Vitalis now supports **Family Guardian** capabilities, allowing users to manage decentralized identities for their dependents (children or elderly family members). 
* **Register Dependents:** Create secure, unique DIDs for family members directly from your settings.
* **On-Chain Relationships:** Guardian relationships are verified and stored on the blockchain via the `registerDependent` smart contract function.
* **Unified Management:** View and manage the medical profiles of your loved ones from a single guardian account.

## 🌟 Core Features

* **Decentralized Identity (DID):** Users generate a unique, cryptographically secure identity linked to their wallet address upon onboarding.
* **Hybrid Data Storage:**
    * **Off-chain:** Medical files (PDFs, images) are encrypted and stored securely (Supabase/IPFS).
    * **On-chain:** File hashes (SHA-256) and metadata are minted to the blockchain to ensure data integrity and immutability.
* **Data Consent & Access Control:** Patients can grant specific hospitals access to their records and revoke permissions on-chain at any time.
* **Blockchain Appointments:** Book, confirm, and cancel doctor appointments directly via smart contract transactions.
* **Wallet Integration:** Seamless login and transaction signing using **Privy** and **Viem**.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
* **Authentication & Wallet:** [Privy](https://www.privy.io/)
* **Blockchain Interaction:** [Viem](https://viem.sh/)
* **Backend & Storage:** [Supabase](https://supabase.com/)
* **Network:** Ethereum Sepolia Testnet

## 📂 Project Structure

```bash
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # Main user overview
│   ├── medical-record/   # Upload and view health records
│   ├── data-consent/     # Manage hospital permissions & appointments
│   ├── onboarding/       # DID generation flow
│   ├── setting/          # Profile settings & Family Manager
│   └── ...
├── components/           # Reusable UI components
│   ├── family-manager.tsx # Dependent management logic
│   ├── vitalis-sidebar.tsx # Main navigation
│   └── ...
├── lib/                  # Utilities
│   ├── supabase.ts       # Database client
│   └── web3.ts           # Smart contract ABI and interaction logic
├── hooks/                # Custom React hooks
└── public/               # Static assets
