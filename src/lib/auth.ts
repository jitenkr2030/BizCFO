// Simple auth configuration for now
import { db } from "@/lib/simple-db"
import bcrypt from "bcryptjs"

export const auth = async () => {
  // Return a mock session for now
  // In production, this would validate a real session token
  return {
    user: {
      id: "mock-user-id",
      email: "demo@bizcfo.com",
      name: "Demo User"
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  }
}

export const signIn = async (credentials: any) => {
  try {
    const { email, password } = credentials
    
    if (!email || !password) {
      return null
    }

    const user = await db.users.findByEmail(email)
    
    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export const signOut = async () => {
  // Placeholder
  return null
}

export const handlers = {
  auth: auth,
  signIn: signIn,
  signOut: signOut,
}