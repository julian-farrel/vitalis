# Vitalis Medical

**Vitalis** is a decentralized medical identity and health record management platform built on the Ethereum blockchain. It empowers patients with full ownership of their data, allowing for secure storage, selective sharing with healthcare providers, and immutable on-chain verification of medical history.

## Core Features

* **Decentralized Identity (DID):** Users generate a unique, cryptographically secure identity linked to their wallet address upon onboarding.
* **Hybrid Data Storage:**
    * **Off-chain:** Medical files (PDFs, images) are encrypted and stored securely (Supabase/IPFS).
    * **On-chain:** File hashes (SHA-256) and metadata are minted to the blockchain to ensure data integrity and immutability.
* **Family Guardian:** Manage decentralized identities for dependents (children or elderly family members).
    * **Register Dependents:** Create secure, unique DIDs for family members directly from your settings.
    * **On-Chain Relationships:** Guardian relationships are verified and stored on the blockchain via the `registerDependent` smart contract function.
    * **Unified Management:** View and manage the medical profiles of your loved ones from a single guardian account.
* **Data Consent & Access Control:** Patients can grant specific hospitals access to their records and revoke permissions on-chain at any time.
* **Blockchain Appointments:** Book, confirm, and cancel doctor appointments directly via smart contract transactions.
* **Wallet Integration:** Seamless login and transaction signing using **Privy** and **Viem**.

## Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
* **Authentication & Wallet:** [Privy](https://www.privy.io/)
* **Blockchain Interaction:** [Viem](https://viem.sh/)
* **Backend & Storage:** [Supabase](https://supabase.com/)
* **Network:** Ethereum Sepolia Testnet

## Project Structure
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
```

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* A Supabase project
* A Privy App ID

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/vitalis.git](https://github.com/yourusername/vitalis.git)
    cd vitalis
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add the following keys:

    ```env
    NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Smart Contract Integration

Vitalis interacts with a custom Solidity smart contract deployed on the **Sepolia Testnet**.

* **Contract Address:** `0x9A9669aD8C22A5F0DA9C1F5b25B04Ffbbef8C0b4`
* **Key Functions:**
    * `registerPatient(address _did)`: Registers a new user identity.
    * `registerDependent(address _dependentDID)`: Links a dependent to a guardian.
    * `addRecord(string _recordHash, string _metadata)`: Mints a medical record hash.
    * `bookAppointment(...)`: Schedules a visit on-chain.
    * `revokeAccess(uint256 _hospitalId)`: Removes provider permissions.

*See `lib/web3.ts` for the full ABI and interaction logic.*

## 🔒 Security & Privacy

* **Zero-Knowledge Principles:** While Vitalis verifies identity on-chain, sensitive personal data (names, specific conditions) is stored off-chain or hashed to preserve privacy.
* **Integrity Verification:** Medical records uploaded are hashed on the client side using SHA-256. This hash is stored on the blockchain. Any alteration to the off-chain file will result in a mismatch with the on-chain proof, alerting the user to tampering.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
