'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw,
  File,
  FileText,
  Eye,
  BarChart3,
  AlertTriangle,
  X
} from 'lucide-react'
import Link from 'next/link'

interface StepConfig {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'pending'
}

interface ImportResult {
  message: string
  transactionsImported: number
  reviewsTriggered: number
  validation: {
    isValid: boolean
    totalRows: number
    validRows: number
    invalidRows: number
    errors: string[]
  }
  sampleTransactions?: any[]
  reviewItems?: any[]
}

export default function TallySetupPage() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Export from Tally Prime',
      description: 'Export your financial data from Tally Prime',
      icon: <Download className="w-5 h-5" />,
      status: step >= 1 ? 'completed' : step === 1 ? 'current' : 'pending'
    },
    {
      id: 2,
      title: 'Upload to BizCFO',
      description: 'Upload the exported Excel or CSV file',
      icon: <Upload className="w-5 h-5" />,
      status: step >= 2 ? 'completed' : step === 2 ? 'current' : 'pending'
    },
    {
      id: 3,
      title: 'Map Data Fields',
      description: 'Map Tally columns to BizCFO fields',
      icon: <Settings className="w-5 h-5" />,
      status: step >= 3 ? 'completed' : step === 3 ? 'current' : 'pending'
    },
    {
      id: 4,
      title: 'Import & Review',
      description: 'Import data and review the results',
      icon: <CheckCircle className="w-5 h-5" />,
      status: step >= 4 ? 'completed' : step === 4 ? 'current' : 'pending'
    }
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ]
      
      if (!validTypes.includes(uploadedFile.type)) {
        alert('Please upload an Excel (.xlsx, .xls) or CSV file')
        return
      }

      // Validate file size (max 10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      setFile(uploadedFile)
      setStep(2)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/integrations/tally', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()
      setImportResult(result)
      setStep(4)
    } catch (error) {
      console.error('Import error:', error)
      alert('Import failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'current': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStepIcon = (step: StepConfig) => {
    const iconClass = getStatusColor(step.status)
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${iconClass}`}>
        {step.icon}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src="/logos/tally.png"
            alt="Tally Prime"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold">Connect Tally Prime</h1>
            <p className="text-gray-600">
              Import your financial data from Tally Prime for advanced CFO insights
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          80% Indian Market Share • Most Popular Accounting Software
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              {getStepIcon(s)}
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > s.id ? 'bg-gray-200' : 'bg-blue-600'
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
              <div className="flex items-center justify-center mb-1">
                {s.icon}
                <span className="ml-2">{s.title}</span>
              </div>
              <div className="text-xs">{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Step 1: Export from Tally Prime
            </CardTitle>
            <CardDescription>
              Follow these steps to export your financial data from Tally Prime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Export Instructions */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-blue-900">In Tally Prime:</h4>
              <ol className="list-decimal list-inside space-y-3 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <div>
                    Go to <span className="font-mono bg-white px-2 py-1 rounded">Gateway of Tally</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <div>
                    Select <span className="font-mono bg-white px-2 py-1 rounded">Display</span> → <span className="font-mono bg-white px-2 py-1 rounded">Account Books</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <div>
                    Choose the period you want to export (recommend at least 6 months)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <div>
                    Click <span className="font-mono bg-white px-2 py-1 rounded">Export</span> → <span className="font-mono bg-white px-2 py-1 rounded">Excel</span> or <span className="font-mono bg-white px-2 py-1 rounded">CSV</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">5.</span>
                  <div>
                    Save the exported file to your computer (note the location)
                  </div>
                </li>
              </ol>
            </div>
            
            {/* Important Notes */}
            <div className="bg-amber-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-amber-900">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-amber-800">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Include all ledgers: Sales, Purchases, Bank, Cash, Expenses, etc.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Export at least 6 months of data for better insights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Make sure GST details are included in the export</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Export both vouchers and reports for comprehensive data</span>
                </li>
              </ul>
            </div>

            {/* Visual Guide */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4 text-gray-900">Visual Guide:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tally Prime Export Menu:</p>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-xs font-mono">
                      <div>Gateway of Tally</div>
                      <div>├── Display</div>
                      <div>│   ├── Account Books</div>
                      <div>│   │   ├── Trial Balance</div>
                      <div>│   │   ├── Day Book</div>
                      <div>│   │   └── Sales Register</div>
                      <div>│   └── Export</div>
                      <div>└── Excel (XLSX)</div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Required Columns:</p>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="text-xs font-mono">
                      <div>Voucher No. | Date | Particulars | Ledger | Debit | Credit</div>
                      <div>-----------|-------|------------|--------|------|-------</div>
                      <div>1         | 15-01-24 | Sales     | Sales   |        | 50000</div>
                      <div>2         | 16-01-24 | Rent      | Expenses| 15000  |        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Step 2: Upload to BizCFO
            </CardTitle>
            <CardDescription>
              Upload the exported Tally file to BizCFO for processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <label 
                  htmlFor="tally-file-upload" 
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Click to upload or drag and drop
                </label>
                <input
                  id="tally-file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">
                  Excel (.xlsx, .xls) or CSV files up to 10MB
                </p>
              </div>
            </div>

            {/* File Preview */}
            {file && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{file.name}</p>
                      <p className="text-xs text-green-700">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading and processing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Supported Formats */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Supported Formats:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Excel (.xlsx, .xls)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>CSV (.csv)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || isUploading}
                className="min-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Step 3: Map Data Fields
            </CardTitle>
            <CardDescription>
              BizCFO will automatically detect and map Tally fields to ensure accurate data import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ Automatic Field Mapping</h4>
              <p className="text-sm text-green-700 mb-3">
                BizCFO automatically detects and maps common Tally fields to ensure accurate data import.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Voucher No. → Transaction ID</span>
                  <Badge variant="outline" className="text-xs">Auto-mapped</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Date → Transaction Date</span>
                  <Badge variant="outline" className="text-xs">Auto-mapped</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Particulars → Description</span>
                  <Badge variant="outline" className="text-xs">Auto-mapped</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Ledger → Category</span>
                  <Badge variant="outline" className="text-xs">Auto-mapped</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Debit/Credit → Amount & Type</span>
                  <Badge variant="outline" className="text-xs">Auto-mapped</Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📊 GST Detection</h4>
              <p className="text-sm text-blue-700 mb-3">
                BizCFO automatically detects GST amounts from Tally GST columns (CGST, SGST, IGST).
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">CGST Column → GST Amount</span>
                  <Badge variant="outline" className="text-xs">Auto-detected</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">SGST Column → GST Amount</span>
                  <Badge variant="outline" className="text-xs">Auto-detected</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">IGST Column → GST Amount</span>
                  <Badge variant="outline" className="text-xs">Auto-detected</Badge>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">🔍 Smart Categorization</h4>
              <p className="text-sm text-amber-700 mb-3">
                BizCFO intelligently categorizes transactions based on ledger names and patterns.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Sales Accounts → Sales</span>
                  <Badge variant="outline" className="text-xs">Auto-categorized</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Purchase Accounts → Purchases</span>
                  <Badge variant="outline" className="text-xs">Auto-categorized</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Bank Accounts → Banking</span>
                  <Badge variant="outline" className="text-xs">Auto-categorized</Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(4)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Step 4: Import Results
            </CardTitle>
            <CardDescription>
              Review the results of your Tally data import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">✅ Import Successful!</h4>
              <p className="text-sm text-green-700 mb-3">
                Your Tally data has been successfully imported into BizCFO. 
                You can now view your transactions in the dashboard and access CFO insights.
              </p>
            </div>

            {/* Import Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.transactionsImported}
                </div>
                <div className="text-sm text-gray-500">Transactions Imported</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {importResult.reviewsTriggered}
                </div>
                <div className="text-sm text-gray-500">Reviews Triggered</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">
                  {importResult.transactionsImported - importResult.reviewsTriggered}
                </div>
                <div className="text-sm text-gray-500">Auto-Processed</div>
              </div>
              <div className="text-center bg-white p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">
                  {importResult.validation?.totalRows || 0}
                </div>
                <div className="text-sm text-gray-500">Total Rows in File</div>
              </div>
            </div>

            {/* Validation Results */}
            {importResult.validation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📊 Validation Results</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Rows:</span>
                    <span className="font-medium">{importResult.validation.totalRows}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valid Rows:</span>
                    <span className="font-medium text-green-600">{importResult.validation.validRows}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Invalid Rows:</span>
                    <span className="font-medium text-red-600">{importResult.validation.invalidRows}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Transactions */}
            {importResult.sampleTransactions && importResult.sampleTransactions.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">📋 Sample Imported Transactions</h4>
                <div className="space-y-2">
                  {importResult.sampleTransactions.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-white rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{transaction.particular}</div>
                        <div className="text-xs text-gray-500">
                          {transaction.date} • {transaction.ledger}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Triggered */}
            {importResult.reviewsTriggered > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2">
                  ⚠️ {importResult.reviewsTriggered} Items Need Review
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  Some transactions have been flagged for accountant review due to their complexity or large amounts. 
                  You can view these in the Reviews tab.
                </p>
                {importResult.reviewItems && importResult.reviewItems.length > 0 && (
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/dashboard?tab=reviews'}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Reviews
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">🎯 Next Steps</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>1. <strong>View Dashboard:</strong> See your imported transactions in the financial dashboard</p>
                <p>2. <strong>Generate Reports:</strong> Create CFO insights and financial reports</p>
                <p>3. <strong>Review Items:</strong> Check transactions flagged for accountant review</p>
                <p>4. <strong>Set Up Sync:</strong> Schedule regular data synchronization</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button onClick={() => window.location.href = '/dashboard'}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/dashboard?tab=reports'}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/dashboard?tab=reviews'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Reviews
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                onClick={() => window.location.href = '/integrations'}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Integrations
              </Button>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}