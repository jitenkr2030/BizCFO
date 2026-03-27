'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Clock, AlertTriangle, X, MessageSquare, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface ReviewItem {
  id: string
  clientId: string
  type: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'reviewing' | 'completed' | 'escalated'
  data: string
  reason?: string
  amount?: number
  notes?: string
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    email: string
    company?: string
  }
}

interface ReviewQueueProps {
  accountantId?: string
}

export function ReviewQueue({ accountantId }: ReviewQueueProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews')
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reviewId: string, newStatus: string, reviewNotes: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: reviewNotes,
          assignedTo: accountantId,
        }),
      })

      if (response.ok) {
        await fetchReviews()
        setSelectedReview(null)
        setNotes('')
        setStatus('')
      }
    } catch (error) {
      console.error('Error updating review:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'reviewing': return <Clock className="w-4 h-4 text-blue-600" />
      case 'escalated': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const parseReviewData = (dataString: string) => {
    try {
      return JSON.parse(dataString)
    } catch {
      return { description: 'Invalid data format' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading review queue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Queue</h2>
          <p className="text-gray-600">Items pending your review</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{reviews.length} items</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No items in your review queue</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Review List */}
          <div className="space-y-3">
            {reviews.map((review) => {
              const reviewData = parseReviewData(review.data)
              return (
                <Card 
                  key={review.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedReview?.id === review.id ? 'ring-2 ring-emerald-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedReview(review)
                    setNotes(review.notes || '')
                    setStatus(review.status)
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getPriorityColor(review.priority)} className="flex items-center space-x-1">
                            {getPriorityIcon(review.priority)}
                            <span className="capitalize">{review.priority}</span>
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {review.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {reviewData.description || 'No description'}
                        </h4>
                        {review.amount && (
                          <p className="text-sm text-gray-600">
                            Amount: ₹{review.amount.toFixed(2)}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{review.client.name}</span>
                          {review.client.company && (
                            <span>• {review.client.company}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(review.status)}
                        <span className="text-xs text-gray-500 capitalize">{review.status}</span>
                      </div>
                    </div>
                    {review.reason && (
                      <Alert>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          {review.reason}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Review Details */}
          {selectedReview && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(selectedReview.priority)} className="capitalize">
                        {selectedReview.priority}
                      </Badge>
                      <span className="text-lg font-normal">
                        {selectedReview.type} Review
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(selectedReview.createdAt), 'MMM dd, yyyy HH:mm')}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReview(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Client Information */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    Client Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedReview.client.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedReview.client.email}</p>
                    {selectedReview.client.company && (
                      <p><span className="font-medium">Company:</span> {selectedReview.client.company}</p>
                    )}
                  </div>
                </div>

                {/* Review Data */}
                <div>
                  <h4 className="font-medium mb-2">Review Details</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(parseReviewData(selectedReview.data), null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Review Reason */}
                {selectedReview.reason && (
                  <div>
                    <h4 className="font-medium mb-2">Review Reason</h4>
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        {selectedReview.reason}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <div className="space-y-3">
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Notes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your review notes..."
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleStatusUpdate(selectedReview.id, status, notes)}
                        disabled={updating}
                        className="flex-1"
                      >
                        {updating ? 'Updating...' : 'Update Status'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Handle contact client
                          window.open(`mailto:${selectedReview.client.email}`)
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}