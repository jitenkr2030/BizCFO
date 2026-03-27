'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface ReportData {
  type: string
  totals?: {
    income: number
    expenses: number
    profit: number
  }
  monthlyData?: Record<string, any>
  data?: any[]
  finalBalance?: number
  transactionCount?: number
}

export function FinancialReports() {
  const [reportType, setReportType] = useState('summary')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set default date range to current month
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])
  }, [])

  const fetchReport = async () => {
    if (!startDate || !endDate) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: reportType,
        startDate,
        endDate,
      })

      const response = await fetch(`/api/reports?${params}`)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [reportType, startDate, endDate])

  const downloadReport = () => {
    if (!reportData) return

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}_report_${startDate}_to_${endDate}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderSummaryReport = () => {
    if (!reportData?.totals) return null

    const { totals, monthlyData, transactionCount } = reportData

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{totals.income.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ₹{totals.expenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{totals.profit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        {monthlyData && Object.keys(monthlyData).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>
                Income, expenses, and profit by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(monthlyData)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([month, data]) => (
                    <div key={month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium">{month}</div>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">Income: ₹{data.income.toLocaleString()}</span>
                        <span className="text-red-600">Expenses: ₹{data.expenses.toLocaleString()}</span>
                        <span className={`font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Profit: ₹{data.profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Count */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {transactionCount}
              </div>
              <p className="text-gray-600">Total transactions in this period</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderProfitLossReport = () => {
    if (!reportData?.data) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
          <CardDescription>
            Detailed income and expense breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Income</th>
                  <th className="text-right p-2">Expense</th>
                  <th className="text-right p-2">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((item: any, index: number) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2 text-right text-green-600">
                      {item.income > 0 ? `₹${item.income.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-2 text-right text-red-600">
                      {item.expense > 0 ? `₹${item.expense.toLocaleString()}` : '-'}
                    </td>
                    <td className={`p-2 text-right font-bold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{Math.abs(item.profit).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold border-t-2">
                  <td colSpan={3} className="p-2">Total</td>
                  <td className="p-2 text-right text-green-600">
                    ₹{reportData.data.reduce((sum: number, item: any) => sum + item.income, 0).toLocaleString()}
                  </td>
                  <td className="p-2 text-right text-red-600">
                    ₹{reportData.data.reduce((sum: number, item: any) => sum + item.expense, 0).toLocaleString()}
                  </td>
                  <td className={`p-2 text-right font-bold ${reportData.data.reduce((sum: number, item: any) => sum + item.profit, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(reportData.data.reduce((sum: number, item: any) => sum + item.profit, 0)).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderCategoryBreakdown = () => {
    if (!reportData?.data) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>
            Income and expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(reportData.data).map(([category, data]: [string, any]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium capitalize">
                    {category.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {data.transactions} transactions
                  </div>
                </div>
                <div className="text-right space-x-4">
                  <span className="text-green-600">₹{data.income.toLocaleString()}</span>
                  <span className="text-red-600">₹{Math.abs(data.expense).toLocaleString()}</span>
                  <span className={`font-bold ${data.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(data.total).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderReport = () => {
    switch (reportType) {
      case 'summary':
        return renderSummaryReport()
      case 'profit-loss':
        return renderProfitLossReport()
      case 'category-breakdown':
        return renderCategoryBreakdown()
      default:
        return <div>Select a report type to view</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            Financial Reports
          </CardTitle>
          <CardDescription>
            Generate and analyze your financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary Report</SelectItem>
                  <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                  <SelectItem value="cash-flow">Cash Flow</SelectItem>
                  <SelectItem value="category-breakdown">Category Breakdown</SelectItem>
                  <SelectItem value="monthly-trend">Monthly Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button onClick={fetchReport} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button variant="outline" onClick={downloadReport} disabled={!reportData}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2">Generating report...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        renderReport()
      )}
    </div>
  )
}