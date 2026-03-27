import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/simple-db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // For demo, return mock data
    const mockTransactions = [
      {
        id: "1",
        userId: session.user.id,
        description: "Office Rent",
        amount: 15000,
        type: "expense",
        category: "office_rent",
        date: "2024-01-15",
        gstAmount: 2700,
        gstRate: 18,
        notes: "Monthly rent payment",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        userId: session.user.id,
        description: "Client Payment - ABC Corp",
        amount: 25000,
        type: "income",
        category: "consulting",
        date: "2024-01-14",
        gstAmount: 4500,
        gstRate: 18,
        notes: "Project completion payment",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Apply filters
    let filteredTransactions = mockTransactions
    if (type) filteredTransactions = filteredTransactions.filter(t => t.type === type)
    if (category) filteredTransactions = filteredTransactions.filter(t => t.category === category)

    const startIndex = (page - 1) * limit
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      transactions: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        pages: Math.ceil(filteredTransactions.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      description,
      amount,
      type,
      category,
      date,
      gstRate,
      notes,
    } = body

    // Validation
    if (!description || !amount || !type || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      )
    }

    // Calculate GST if applicable
    let gstAmount: number | null = null
    if (gstRate && gstRate > 0) {
      gstAmount = (parseFloat(amount) * parseFloat(gstRate)) / 100
    }

    // Create transaction (mock for demo)
    const transaction = {
      id: Math.random().toString(36).substring(7),
      userId: session.user.id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
      gstRate: gstRate ? parseFloat(gstRate) : null,
      gstAmount,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Check for review triggers (mock)
    if (parseFloat(amount) > 100000) {
      console.log("Large transaction detected - would add to review queue")
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}