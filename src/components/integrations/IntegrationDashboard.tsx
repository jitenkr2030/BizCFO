'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Link2, RefreshCw, Unlink, Upload, Eye } from 'lucide-react'
import Link from 'next/link'

interface AccountingSoftware {
  id: string
  name: string
  logo: string
  type: 'api' | 'import' | 'bank' | 'manual'
  status: 'connected' | 'disconnected' | 'error'
  market: 'indian' | 'global'
  marketShare: string
  features: string[]
  description: string
  authType: 'oauth' | 'apikey' | 'file' | 'bank'
  priority: number
}

export default function IntegrationDashboard() {
  const [integrations, setIntegrations] = useState<AccountingSoftware[]>([
    {
      id: 'tally',
      name: 'Tally Prime',
      logo: '/logos/tally.png',
      type: 'import',
      status: 'disconnected',
      market: 'indian',
      marketShare: '80%',
      description: 'India\'s most popular accounting software for SMBs',
      features: [
        'Excel/CSV Import',
        'GST Reports', 
        'Ledger Sync',
        'Compliance',
        'Voucher Export',
        'Financial Statements'
      ],
      authType: 'file',
      priority: 1
    },
    {
      id: 'zoho',
      name: 'Zoho Books',
      logo: '/logos/zoho.png',
      type: 'api',
      status: 'disconnected',
      market: 'global',
      marketShare: '15%',
      description: 'Cloud-based accounting software with strong Indian presence',
      features: [
        'Real-time API Sync',
        'Invoices & Bills',
        'Bank Feeds',
        'Multi-currency',
        'Mobile App',
        'GST Compliance',
        'Project Accounting'
      ],
      authType: 'oauth',
      priority: 2
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      logo: '/logos/quickbooks.png',
      type: 'api',
      status: 'disconnected',
      market: 'global',
      marketShare: '25%',
      description: 'Global leader in cloud accounting software',
      features: [
        'API Sync',
        'Bank Feeds',
        'Multi-currency',
        'Advanced Reports',
        'Payroll Integration',
        'Mobile Apps',
        'Third-party Apps'
      ],
      authType: 'oauth',
      priority: 3
    },
    {
      id: 'xero',
      name: 'Xero',
      logo: '/logos/xero.png',
      type: 'api',
      status: 'disconnected',
      market: 'global',
      marketShare: '10%',
      description: 'Popular cloud accounting platform with strong bank feeds',
      features: [
        'Bank Feed Automation',
        'Multi-currency',
        'Invoice Management',
        'Bill Tracking',
        'Payroll Integration',
        'Mobile Apps',
        'Add-on Marketplace'
      ],
      authType: 'oauth',
      priority: 4
    },
    {
      id: 'busy',
      name: 'Busy Accounting',
      logo: '/logos/busy.png',
      type: 'import',
      status: 'disconnected',
      market: 'indian',
      marketShare: '5%',
      description: 'Popular accounting software for tier-2/3 cities in India',
      features: [
        'Excel/CSV Import',
        'Financial Reports',
        'GST Compliance',
        'Inventory Management',
        'Payroll Processing',
        'Bank Reconciliation'
      ],
      authType: 'file',
      priority: 5
    },
    {
      id: 'marg',
      name: 'Marg ERP',
      logo: '/logos/marg.png',
      type: 'import',
      status: 'disconnected',
      market: 'indian',
      marketShare: '3%',
      description: 'Manufacturing and trading ERP with strong accounting features',
      features: [
        'Excel/CSV Import',
        'Manufacturing Cost Analysis',
        'Inventory Integration',
        'GST Reports',
        'Financial Statements',
        'Multi-branch Accounting'
      ],
      authType: 'file',
      priority: 6
    },
    {
      id: 'sage',
      name: 'Sage 50cloud',
      logo: '/logos/sage.png',
      type: 'import',
      status: 'disconnected',
      market: 'global',
      marketShare: '8%',
      description: 'Established accounting software for traditional businesses',
      features: [
        'Import/Export Integration',
        'Compliance Features',
        'Financial Reporting',
        'Tax Management',
        'Multi-user Access',
        'Cloud Sync'
      ],
      authType: 'file',
      priority: 7
    },
    {
      id: 'wave',
      name: 'Wave Accounting',
      logo: '/logos/wave.png',
      type: 'api',
      status: 'disconnected',
      market: 'global',
      marketShare: '5%',
      description: 'Free accounting software popular with startups and small businesses',
      features: [
        'API Integration',
        'Bank Feed Automation',
        'Invoice Generation',
        'Receipt Scanning',
        'Mobile Apps',
        'Unlimited Users'
      ],
      authType: 'apikey',
      priority: 8
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      logo: '/logos/hdfc.png',
      type: 'bank',
      status: 'disconnected',
      market: 'indian',
      marketShare: 'N/A',
      description: 'Leading private sector bank in India',
      features: [
        'Transaction Feeds',
        'Account Balance',
        'Transaction History',
        'UPI Integration',
        'Auto-categorization',
        'GST Compliance'
      ],
      authType: 'bank',
      priority: 9
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      logo: '/logos/icici.png',
      type: 'bank',
      status: 'disconnected',
      market: 'indian',
      marketShare: 'N/A',
      description: 'Major private sector bank with strong digital services',
      features: [
        'Transaction Feeds',
        'Account Balance',
        'Transaction History',
        'UPI Integration',
        'Auto-categorization',
        'GST Compliance'
      ],
      authType: 'bank',
      priority: 10
    }
  ])

  const [connectedCount, setConnectedCount] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)

  useEffect(() => {
    // Simulate connected integrations and transaction counts
    const connected = integrations.filter(i => i.status === 'connected').length
    const transactions = connected * 1247 // Mock transaction count
    setConnectedCount(connected)
    setTotalTransactions(transactions)
  }, [integrations])

  const handleConnect = (integrationId: string) => {
    // Navigate to integration setup page
    window.location.href = `/integrations/${integrationId}`
  }

  const handleDisconnect = async (integrationId: string) => {
    // Handle disconnection logic
    console.log(`Disconnecting ${integrationId}`)
  }

  const handleSync = async (integrationId: string) => {
    // Handle sync logic
    console.log(`Syncing ${integrationId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default'
      case 'error': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Error'
      default: return status
    }
  }

  const getMarketBadgeColor = (market: string) => {
    return market === 'indian' ? 'default' : 'secondary'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return '🔌'
      case 'import': return '📁'
      case 'bank': return '🏦'
      case 'manual': return '✏️'
      default: return '📊'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Accounting Software Integrations</h2>
          <p className="text-gray-600">
            Connect your existing accounting software for advanced CFO insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{connectedCount}</div>
            <div className="text-sm text-gray-500">Connected</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalTransactions.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Transactions</div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations
          .sort((a, b) => a.priority - b.priority)
          .map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {integration.logo ? (
                      <img
                        src={integration.logo}
                        alt={integration.name}
                        className="w-10 h-10 rounded"
                      />
                    ) : (
                      <span>{getTypeIcon(integration.type)}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {integration.name}
                      <Badge variant={getMarketBadgeColor(integration.market)} className="text-xs">
                        {integration.market}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {integration.description}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {integration.marketShare} market share
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {integration.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={getStatusColor(integration.status)}
                  className="shrink-0"
                >
                  {getStatusText(integration.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="font-medium mb-2 text-sm">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 4).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{integration.features.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Status Information */}
                {integration.status === 'connected' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Last sync: 2 hours ago
                    </span>
                    <span className="font-medium">
                      1,247 records
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSync(integration.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        <Unlink className="w-4 h-4 mr-1" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConnect(integration.id)}
                    >
                      <Link2 className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Benefits</CardTitle>
          <CardDescription>
            Why connect your accounting software to BizCFO?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">90%</div>
              <div className="text-sm text-gray-600">Time Savings</div>
              <div className="text-xs text-gray-500 mt-1">
                Automate routine tasks, focus on strategic decisions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5x</div>
              <div className="text-sm text-gray-600">Client Capacity</div>
              <div className="text-xs text-gray-500 mt-1">
                Serve more clients with the same team size
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Data Utilization</div>
              <div className="text-xs text-gray-500 mt-1">
                Get insights from all your financial data sources
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}