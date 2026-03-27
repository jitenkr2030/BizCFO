import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Get review queue items for accountants
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock review data
    const mockReviews = [
      {
        id: "1",
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
      },
      {
        id: "2",
        clientId: "client2",
        type: "invoice",
        priority: "medium",
        status: "pending",
        data: '{"description": "GST invoice", "amount": 50000}',
        reason: "GST calculation needs review",
        notes: "Check GST applicability",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        client: {
          id: "client2",
          name: "Jane Smith",
          email: "jane@example.com",
          company: "XYZ Ltd",
        },
      },
    ]

    return NextResponse.json({ reviews: mockReviews })
  } catch (error) {
    console.error("Error fetching review queue:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Add item to review queue
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { clientId, type, priority, data, reason, notes } = body

    // Validation
    if (!clientId || !type || !data) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const review = {
      id: Math.random().toString(36).substring(7),
      clientId,
      type,
      priority: priority || "medium",
      data: typeof data === "string" ? data : JSON.stringify(data),
      reason,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, you'd send notifications to accountants here
    console.log(`New review item created: ${type} for client ${clientId}`)

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review item:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}