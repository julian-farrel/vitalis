"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { supabase } from "@/lib/supabase"

interface UserData {
  firstName: string
  lastName: string
  email: string
  dob: string
  bloodType: string
  address: string
  emergencyContact: string
  allergies: string
  medications: string
  conditions: string
  didWalletAddress: string // <--- ADD THIS
}

interface UserContextType {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  isLoading: boolean
}

const defaultUserData: UserData = {
  firstName: "Guest",
  lastName: "User",
  email: "No Email",
  dob: "--",
  bloodType: "--",
  address: "--",
  emergencyContact: "--",
  allergies: "None",
  medications: "None",
  conditions: "None",
  didWalletAddress: "" // <--- ADD DEFAULT
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, ready, authenticated } = usePrivy()
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (ready && authenticated && user?.wallet?.address) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', user.wallet.address)
            .single()

          if (data) {
            setUserData({
              firstName: data.first_name || "",
              lastName: data.last_name || "",
              email: data.email || user.email?.address || "",
              dob: data.dob || "--",
              bloodType: data.blood_type || "--",
              address: data.address || "--",
              emergencyContact: data.emergency_contact || "--",
              allergies: data.allergies || "None",
              medications: data.medications || "None",
              conditions: data.conditions || "None",
              didWalletAddress: data.did_wallet_address || "Not Created" // <--- MAP FROM DB
            })
            localStorage.setItem("vitalis_user_data", JSON.stringify(data))
          }
        } catch (err) {
          console.error("Error fetching profile:", err)
        }
      }
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [ready, authenticated, user])

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...newData }
      localStorage.setItem("vitalis_user_data", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}