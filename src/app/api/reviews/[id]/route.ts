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

    // Mock review data
    const review = {
      id: id,
      clientId: "client1",
      type: "transaction",
      priority: "high",
      status: "pending",
      data: '{"description": "Large transaction", "amount": 150000}',
      reason: "Large transaction amount",
      notes: "Needs accountant review",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: {
        id: "client1",
        name: "John Doe",
        email: "john@example.com",
        company: "ABC Corp",
      },
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching review:", error)
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
    const { status, notes } = body

    const review = {
      id: id,
      clientId: "client1",
      type: "transaction",
      priority: "high",
      status: status || "pending",
      data: '{"description": "Large transaction", "amount": 150000}',
      reason: "Large transaction amount",
      notes: notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
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

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}