import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code, clientId, clientSecret, redirectUri } = body

    if (!code || !clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ 
        error: "Missing required parameters", 
        details: "code, clientId, clientSecret, and redirectUri are required"
      }, { status: 400 })
    }

    // Exchange authorization code for access token
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token'
    const tokenData = new URLSearchParams()
    tokenData.append('grant_type', 'authorization_code')
    tokenData.append('client_id', clientId)
    tokenData.append('client_secret', clientSecret)
    tokenData.append('redirect_uri', redirectUri)
    tokenData.append('code', code)

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData.toString()
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      return NextResponse.json({ 
        error: "Token exchange failed", 
        details: errorData.error || 'Unknown error'
      }, { status: 400 })
    }

    const tokenResult = await tokenResponse.json()
    
    return NextResponse.json({
      success: true,
      access_token: tokenResult.access_token,
      refresh_token: tokenResult.refresh_token,
      expires_in: tokenResult.expires_in,
      api_domain: tokenResult.api_domain,
      token_type: tokenResult.token_type
    })

  } catch (error) {
    console.error('Zoho auth error:', error)
    return NextResponse.json({ 
      error: "Authentication failed", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}