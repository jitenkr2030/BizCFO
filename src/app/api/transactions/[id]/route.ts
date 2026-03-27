import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock transaction data
    const transaction = {
      id: id,
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
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    if (type && !["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      )
    }

    // Calculate GST if applicable
    let gstAmount: number | null = null
    if (gstRate && gstRate > 0 && amount) {
      gstAmount = (parseFloat(amount) * parseFloat(gstRate)) / 100
    }

    const transaction = {
      id: id,
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
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error updating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ message: "Transaction deleted successfully" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}