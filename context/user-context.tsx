"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

// 1. Add medical fields to the interface
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
}

interface UserContextType {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
}

// 2. Add default values
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
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = usePrivy()
  const [userData, setUserData] = useState<UserData>(defaultUserData)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vitalis_user_data")
      if (stored) {
        setUserData({ ...defaultUserData, ...JSON.parse(stored) })
      } else if (user?.email?.address) {
        setUserData((prev) => ({ ...prev, email: user.email!.address }))
      }
    }
  }, [user])

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...newData }
      localStorage.setItem("vitalis_user_data", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
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