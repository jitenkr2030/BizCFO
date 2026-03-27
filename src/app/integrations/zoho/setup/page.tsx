'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Link2, 
  RefreshCw, 
  CheckCircle, 
  Eye, 
  Settings, 
  Key,
  ExternalLink,
  AlertTriangle,
  FileText
} from 'lucide-react'

interface ZohoCredentials {
  clientId: string
  clientSecret: string
  redirectUri: string
  organizationId: string
}

interface SyncResult {
  success: boolean
  invoices?: { synced: number; errors: number }
  transactions?: { synced: number; errors: number }
  customers?: { synced: number; errors: number }
  bills?: { synced: number; errors: number }
  totalRecords?: number
  error?: string
}

export default function ZohoSetupPage() {
  const [step, setStep] = useState(1)
  const [credentials, setCredentials] = useState<ZohoCredentials>({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    organizationId: ''
  })
  const [authCode, setAuthCode] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const steps = [
    { id: 1, title: 'Get Zoho Credentials', description: 'Register your Zoho Books application' },
    { id: 2, title: 'Configure Integration', description: 'Enter your Zoho Books credentials' },
    { id: 3, title: 'Authorize Access', description: 'Connect BizCFO to your Zoho Books account' },
    { id: 4, title: 'Sync Data', description: 'Import your financial data from Zoho Books' }
  ]

  const handleGetCredentials = () => {
    // Open Zoho Developer Console in new tab
    window.open('https://developer.zoho.com/', '_blank')
    setStep(2)
  }

  const handleConfigure = () => {
    // Validate credentials
    if (!credentials.clientId || !credentials.clientSecret || !credentials.organizationId) {
      alert('Please fill in all required fields')
      return
    }

    // Validate redirect URI format
    try {
      const url = new URL(credentials.redirectUri)
      if (!url.protocol.startsWith('http')) {
        alert('Redirect URI must be a valid URL (e.g., https://yourdomain.com/zoho/callback)')
        return
      }
    } catch {
      alert('Redirect URI must be a valid URL (e.g., https://yourdomain.com/zoho/callback)')
      return
    }

    setStep(3)
  }

  const handleOAuth = () => {
    // Construct OAuth URL
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoBooks.fullaccess.all&client_id=${credentials.clientId}&response_type=code&redirect_uri=${encodeURIComponent(credentials.redirectUri)}&access_type=offline`
    
    // Open OAuth URL in new window
    const popup = window.open(authUrl, 'zoho-oauth', 'width=600,height=600')
    
    // Listen for OAuth callback
    const checkOAuth = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkOAuth)
          return
        }
        
        const urlParams = new URL(popup.location.href).searchParams
        const code = urlParams.get('code')
        
        if (code) {
          setAuthCode(code)
          clearInterval(checkOAuth)
          popup.close()
          handleTokenExchange(code)
        }
      } catch (error) {
        // Cross-origin error, ignore
      }
    }, 1000)
  }

  const handleTokenExchange = async (code: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/integrations/zoho/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          redirectUri: credentials.redirectUri
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setAccessToken(result.access_token)
        setStep(4)
      } else {
        alert('Failed to exchange authorization code: ' + result.error)
      }
    } catch (error) {
      console.error('Token exchange error:', error)
      alert('Failed to exchange authorization code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async () => {
    if (!accessToken) return

    setIsSyncing(true)
    
    try {
      const response = await fetch('/api/integrations/zoho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: accessToken,
          organizationId: credentials.organizationId
        })
      })

      const result = await response.json()
      setSyncResult(result)
    } catch (error) {
      console.error('Sync error:', error)
      alert('Failed to sync data from Zoho Books')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src="/logos/zoho.png"
            alt="Zoho Books"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">Connect Zoho Books</h1>
            <p className="text-gray-600">
              Integrate your Zoho Books account for real-time financial insights
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          Cloud Accounting • Real-time API • Global Coverage
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > s.id ? 'bg-green-100 text-green-800' : 
                step === s.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {step > s.id ? '✓' : s.id}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > s.id ? 'bg-green-200' : 'bg-blue-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {steps.map((s) => (
            <div key={s.id} className={`text-center ${
              step === s.id ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              <div className="font-medium">Step {s.id}</div>
              <div>{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Step 1: Get Zoho Credentials
            </CardTitle>
            <CardDescription>
              Register your application with Zoho Developer Console to get API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                You need to register a Zoho Books application to get API credentials. This is free and only takes a few minutes.
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-blue-900">How to Get Zoho Credentials:</h4>
              <ol className="list-decimal list-inside space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <div>
                    Go to <a href="https://developer.zoho.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Zoho Developer Console
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <div>
                    Sign in with your Zoho account (create one if you don't have one)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <div>
                    Click on <span className="font-mono bg-white px-2 py-1 rounded">Add Client</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <div>
                    Fill in the client details:
                    <ul className="mt-2 ml-4 space-y-1 text-xs">
                      <li>• Client Name: BizCFO Integration</li>
                      <li>• Homepage URL: https://yourdomain.com</li>
                      <li>• Authorized Redirect URIs: https://yourdomain.com/zoho/callback</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">5.</span>
                  <div>
                    Click <span className="font-mono bg-white px-2 py-1 rounded">Create</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">6.</span>
                  <div>
                    Note down your <span className="font-mono bg-white px-2 py-1 rounded">Client ID</span> and <span className="font-mono bg-white px-2 py-1 rounded">Client Secret</span>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-amber-900">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-amber-800">
                <li>Keep your Client Secret secure and never share it publicly</li>
                <li>The redirect URI must match exactly what you configure in Zoho</li>
                <li>You'll also need your Zoho Books Organization ID (found in Zoho Books settings)</li>
                <li>Make sure your Zoho Books account has the necessary permissions</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGetCredentials}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Zoho Developer Console
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Step 2: Configure Integration
            </CardTitle>
            <CardDescription>
              Enter your Zoho Books credentials to configure the integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientId">Client ID *</Label>
                  <Input
                    id="clientId"
                    placeholder="Enter your Zoho Client ID"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Found in Zoho Developer Console
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="clientSecret">Client Secret *</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    placeholder="Enter your Zoho Client Secret"
                    value={credentials.clientSecret}
                    onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keep this secret and secure
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="redirectUri">Redirect URI *</Label>
                  <Input
                    id="redirectUri"
                    placeholder="https://yourdomain.com/zoho/callback"
                    value={credentials.redirectUri}
                    onChange={(e) => setCredentials({ ...credentials, redirectUri: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must match exactly what you configured in Zoho
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="organizationId">Organization ID *</Label>
                  <Input
                    id="organizationId"
                    placeholder="Enter your Zoho Books Organization ID"
                    value={credentials.organizationId}
                    onChange={(e) => setCredentials({ ...credentials, organizationId: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Found in Zoho Books → Settings → General → Organization Details
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Where to find Organization ID:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Log in to your Zoho Books account</li>
                <li>Go to <span className="font-mono bg-white px-2 py-1 rounded">Settings</span> → <span className="font-mono bg-white px-2 py-1 rounded">General</span></li>
                <li>Look for <span className="font-mono bg-white px-2 py-1 rounded">Organization ID</span> in the Organization Details section</li>
              </ol>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfigure}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link2 className="w-5 h-5 mr-2" />
              Step 3: Authorize Access
            </CardTitle>
            <CardDescription>
              Connect BizCFO to your Zoho Books account using OAuth 2.0
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ OAuth 2.0 Authentication</h4>
              <p className="text-sm text-green-700 mb-3">
                BizCFO uses OAuth 2.0 to securely connect to your Zoho Books account without storing your password.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Security:</span>
                  <Badge variant="outline" className="text-xs">Enterprise-grade</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Permissions:</span>
                  <Badge variant="outline" className="text-xs">Full access</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Refresh Token:</span>
                  <Badge variant="outline" className="text-xs">Automatic renewal</Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📋 Permissions Requested:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Read invoices and bills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Access bank transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Manage customer information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Generate financial reports</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Exchanging authorization code...</p>
              </div>
            ) : (
              <div className="text-center">
                <Button onClick={handleOAuth} size="lg" className="min-w-[200px]">
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect to Zoho Books
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This will open a Zoho login window in a new tab
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="outline" onClick={handleGetCredentials}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Credentials
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Step 4: Sync Data
            </CardTitle>
            <CardDescription>
              Import your financial data from Zoho Books into BizCFO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ Connection Ready</h4>
              <p className="text-sm text-green-700 mb-3">
                Your Zoho Books account is now connected to BizCFO. You can start syncing your financial data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">What will be synced:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• All invoices and bills</li>
                  <li>• Bank transactions</li>
                  <li>• Customer information</li>
                  <li>• Payment records</li>
                  <li>• Tax details (GST)</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-2">Sync frequency:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Initial sync: All historical data</li>
                  <li>• Ongoing sync: Every hour</li>
                  <li>• Real-time updates: For new transactions</li>
                  <li>• Manual sync: Available anytime</li>
                </ul>
              </div>
            </div>

            {isSyncing ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Syncing data from Zoho Books...</p>
                <p className="text-xs text-gray-500 mt-2">This may take a few minutes depending on data volume</p>
              </div>
            ) : (
              <div className="text-center">
                <Button onClick={handleSync} size="lg" className="min-w-[200px]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Initial Sync
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This will import all your historical data from Zoho Books
                </p>
              </div>
            )}

            {syncResult && (
              <div className="space-y-4">
                {syncResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ Sync Completed Successfully!</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {syncResult.totalRecords || 0}
                        </div>
                        <div className="text-sm text-gray-500">Total Records</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {syncResult.invoices?.synced || 0}
                        </div>
                        <div className="text-sm text-gray-500">Invoices</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {syncResult.transactions?.synced || 0}
                        </div>
                        <div className="text-sm text-gray-500">Transactions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {syncResult.customers?.synced || 0}
                        </div>
                        <div className="text-sm text-gray-500">Customers</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Sync Failed</h4>
                    <p className="text-sm text-red-700">
                      Error: {syncResult.error}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">🎯 Next Steps:</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>1. <strong>View Dashboard:</strong> See your Zoho data in the BizCFO dashboard</p>
                    <p>2. <strong>Generate Reports:</strong> Create CFO insights and financial reports</p>
                    <p>3. <strong>Set Up Automation:</strong> Configure automatic sync schedules</p>
                    <p>4. <strong>Enable Notifications:</strong> Get alerts for new transactions</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button onClick={() => window.location.href = '/dashboard'}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/dashboard?tab=reports'}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button variant="outline" onClick={() => setStep(2)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}