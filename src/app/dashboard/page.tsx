'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import Link from "next/link"
import { TransactionForm, TransactionList } from "@/components/transactions/TransactionForm"
import { ReviewQueue } from "@/components/reviews/ReviewQueue"
import { FinancialReports } from "@/components/reports/FinancialReports"

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  gstAmount?: number
}

export default function Dashboard() {
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [financialSummary, setFinancialSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactionCount: 0
  })
  const [pendingReviews, setPendingReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  // Mock session for now
  const session = {
    user: {
      id: "mock-user-id",
      name: "Demo User",
      email: "demo@bizcfo.com"
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [activeTab])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch transactions
      const transactionsResponse = await fetch('/api/transactions')
      const transactionsData = await transactionsResponse.json()
      setTransactions(transactionsData.transactions || [])

      // Calculate financial summary
      const income = transactionsData.transactions?.filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0
      const expenses = transactionsData.transactions?.filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0) || 0

      setFinancialSummary({
        totalIncome: income,
        totalExpenses: expenses,
        netProfit: income - expenses,
        transactionCount: transactionsData.transactions?.length || 0
      })

      // Fetch pending reviews
      const reviewsResponse = await fetch('/api/reviews?status=pending')
      const reviewsData = await reviewsResponse.json()
      setPendingReviews(reviewsData.reviews?.length || 0)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      if (editingTransaction) {
        // Update existing transaction
        await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        })
      } else {
        // Create new transaction
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        })
      }
      
      setShowTransactionForm(false)
      setEditingTransaction(null)
      fetchDashboardData()
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionForm(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
        })
        fetchDashboardData()
      } catch (error) {
        console.error('Error deleting transaction:', error)
      }
    }
  }

  const isAccountant = session.user?.email?.includes('accountant') || session.user?.email?.includes('ca')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="BizCFO Logo"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-slate-900">BizCFO</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <Button
                onClick={() => router.push("/auth/signin")}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your business finances with our hybrid platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {isAccountant && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Income
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{financialSummary.totalIncome.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From {financialSummary.transactionCount} transactions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Expenses
                      </CardTitle>
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        ₹{financialSummary.totalExpenses.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From {financialSummary.transactionCount} transactions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Net Profit
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{financialSummary.netProfit.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Profit margin: {financialSummary.totalIncome > 0 ? ((financialSummary.netProfit / financialSummary.totalIncome) * 100).toFixed(1) : 0}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  {isAccountant && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Pending Reviews
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                          {pendingReviews}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Items awaiting your review
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks you can perform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        onClick={() => setShowTransactionForm(true)}
                        className="justify-start"
                        variant="outline"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('transactions')}
                        className="justify-start"
                        variant="outline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View All
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('reports')}
                        className="justify-start"
                        variant="outline"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Reports
                      </Button>
                      {isAccountant && (
                        <Button 
                          onClick={() => setActiveTab('reviews')}
                          className="justify-start"
                          variant="outline"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Reviews
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                          Latest financial activity
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('transactions')}
                      >
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TransactionList 
                      transactions={transactions.slice(0, 5)}
                      onEdit={handleEditTransaction}
                      onDelete={handleDeleteTransaction}
                    />
                  </CardContent>
                </Card>

                {/* Accountant Section */}
                {!isAccountant && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Accountant</CardTitle>
                      <CardDescription>
                        Get expert help with your finances
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div>
                            <p className="font-medium">Priya Sharma</p>
                            <p className="text-sm text-gray-500">Senior Accountant</p>
                            <Badge variant="outline" className="mt-1">Available</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Schedule Call</Button>
                          <Button size="sm" variant="outline">Send Message</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Transactions</h2>
                <p className="text-gray-600">Manage your income and expenses</p>
              </div>
              <Button onClick={() => setShowTransactionForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>

            {showTransactionForm && (
              <TransactionForm
                transaction={editingTransaction || undefined}
                onSave={handleSaveTransaction}
                onCancel={() => {
                  setShowTransactionForm(false)
                  setEditingTransaction(null)
                }}
              />
            )}

            <TransactionList 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>

          {/* Reviews Tab - Accountants Only */}
          {isAccountant && (
            <TabsContent value="reviews" className="space-y-6">
              <ReviewQueue accountantId={session.user.id} />
            </TabsContent>
          )}

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <FinancialReports />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}