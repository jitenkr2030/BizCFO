// Simple database mock for now
export const db = {
  user: {
    findByEmail: async (email: string) => {
      // Mock user data
      if (email === "demo@bizcfo.com") {
        return {
          id: "1",
          email: "demo@bizcfo.com",
          name: "Demo User",
          password: "$2b$12$demo" // In production, this would be properly hashed
        }
      }
      return null
    }
  },
  transaction: {
    create: async (data: any) => {
      // Mock transaction creation
      return data
    },
    findMany: async () => {
      // Mock transaction data
      return []
    }
  }
}