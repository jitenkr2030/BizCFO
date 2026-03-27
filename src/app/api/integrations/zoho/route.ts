import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { ZohoBooksIntegration } from "@/lib/integrations/zoho/ZohoBooksIntegration"

// API endpoint for Zoho integration
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { accessToken, organizationId } = body

    if (!accessToken || !organizationId) {
      return NextResponse.json({ 
        error: "Missing required credentials", 
        details: "Access token and organization ID are required"
      }, { status: 400 })
    }

    // Create Zoho integration instance
    const zohoIntegration = new ZohoBooksIntegration(accessToken, organizationId)
    
    // Perform sync
    const result = await zohoIntegration.syncToBizCFO(session.user.id)

    return NextResponse.json({
      message: "Zoho Books integration completed successfully",
      ...result
    })

  } catch (error) {
    console.error("Zoho integration error:", error)
    return NextResponse.json({ 
      error: "Integration failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}