'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Edit2, Trash2, Save, X, TrendingUp, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  gstRate?: number
  gstAmount?: number
  notes?: string
}

interface TransactionFormProps {
  transaction?: Transaction
  onSave: (transaction: Partial<Transaction>) => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSave, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    date: transaction?.date ? format(new Date(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    gstRate: transaction?.gstRate || '',
    notes: transaction?.notes || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    'office_rent', 'salaries', 'marketing', 'software', 'utilities', 'supplies',
    'travel', 'entertainment', 'legal_fees', 'insurance', 'taxes', 'bank_fees',
    'consulting', 'sales', 'services', 'products', 'other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validation
      if (!formData.description || !formData.amount || !formData.category) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      const amount = parseFloat(formData.amount as string)
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount')
        setLoading(false)
        return
      }

      // Calculate GST if rate is provided
      let gstAmount: number | undefined = undefined
      if (formData.gstRate) {
        const gstRate = parseFloat(formData.gstRate as string)
        if (!isNaN(gstRate) && gstRate > 0) {
          gstAmount = (amount * gstRate) / 100
        }
      }

      const transactionData = {
        ...formData,
        amount,
        gstAmount,
        gstRate: formData.gstRate ? parseFloat(formData.gstRate as string) : undefined,
      }

      await onSave(transactionData)
    } catch (error) {
      setError('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </CardTitle>
            <CardDescription>
              {transaction ? 'Update the transaction details' : 'Enter a new transaction'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Office rent payment"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').replace(/\b\w/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Input
                id="gstRate"
                type="number"
                step="0.01"
                value={formData.gstRate}
                onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
                placeholder="18.00"
              />
            </div>
            
            {formData.gstRate && (
              <div className="space-y-2">
                <Label>GST Amount</Label>
                <div className="p-2 bg-gray-100 rounded text-sm">
                  ₹{formData.amount && formData.gstRate 
                    ? ((parseFloat(formData.amount as string) * parseFloat(formData.gstRate as string)) / 100).toFixed(2)
                    : '0.00'
                  }
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Transaction'}
              <Save className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function TransactionList({ transactions, onEdit, onDelete }: {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">{transaction.description}</h4>
                  <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                    {transaction.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {transaction.category.replace('_', ' ').replace(/\b\w/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                  {transaction.gstAmount && (
                    <span>GST: ₹{transaction.gstAmount.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </div>
                  {transaction.gstAmount && (
                    <div className="text-xs text-gray-500">
                      Total: ₹{(transaction.amount + transaction.gstAmount).toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}