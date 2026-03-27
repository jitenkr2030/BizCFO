// Simple database setup for now - we'll migrate to Prisma later
export interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  phone?: string;
  company?: string;
  plan: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock database for development
const users: User[] = [];

export const db = {
  users: {
    findByEmail: async (email: string) => {
      return users.find(user => user.email === email);
    },
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const user: User = {
        ...data,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
      return user;
    },
    findById: async (id: string) => {
      return users.find(user => user.id === id);
    }
  }
};