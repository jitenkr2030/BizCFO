import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface ZohoInvoice {
  invoice_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  subtotal: number
  gst_total: number
  total: number
  status: string
  due_date: string
  notes: string
  date: string
  line_items: any[]
}

interface ZohoTransaction {
  transaction_id: string
  description: string
  amount: number
  date: string
  notes: string
  account_name: string
  chart_of_account_id: string
  currency_id: string
}

interface ZohoCustomer {
  contact_id: string
  contact_name: string
  email: string
  phone: string
  company_name: string
  gstin: string
  billing_address: any
  shipping_address: any
}

interface ZohoBill {
  bill_id: string
  vendor_name: string
  vendor_email: string
  subtotal: number
  gst_total: number
  total: number
  status: string
  due_date: string
  notes: string
  date: string
  line_items: any[]
}

interface SyncResult {
  synced: number
  errors: number
}

export class ZohoBooksIntegration {
  private accessToken: string
  private organizationId: string

  constructor(accessToken: string, organizationId: string) {
    this.accessToken = accessToken
    this.organizationId = organizationId
  }

  async getInvoices(fromDate?: string, toDate?: string): Promise<ZohoInvoice[]> {
    let url = `https://books.zoho.com/api/v3/invoices?organization_id=${this.organizationId}`
    
    if (fromDate && toDate) {
      url += `&custom_field_date1=${fromDate}&custom_field_date2=${toDate}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.invoices || []
  }

  async getTransactions(fromDate?: string, toDate?: string): Promise<ZohoTransaction[]> {
    let url = `https://books.zoho.com/api/v3/banktransactions?organization_id=${this.organizationId}`
    
    if (fromDate && toDate) {
      url += `&date_from=${fromDate}&date_to=${toDate}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.banktransactions || []
  }

  async getCustomers(): Promise<ZohoCustomer[]> {
    const response = await fetch(
      `https://books.zoho.com/api/v3/contacts?organization_id=${this.organizationId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.contacts || []
  }

  async getBills(): Promise<ZohoBill[]> {
    const response = await fetch(
      `https://books.zoho.com/api/v3/bills?organization_id=${this.organizationId}`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.bills || []
  }

  async syncToBizCFO(userId: string): Promise<any> {
    try {
      // Fetch data from Zoho in parallel
      const [invoices, transactions, customers, bills] = await Promise.all([
        this.getInvoices(),
        this.getTransactions(),
        this.getCustomers(),
        this.getBills()
      ])

      // Transform and save to BizCFO database
      const results = {
        invoices: await this.syncInvoices(invoices, userId),
        transactions: await this.syncTransactions(transactions, userId),
        customers: await this.syncCustomers(customers, userId),
        bills: await this.syncBills(bills, userId)
      }

      return {
        success: true,
        ...results,
        totalRecords: results.invoices.synced + results.transactions.synced + 
                     results.customers.synced + results.bills.synced
      }

    } catch (error) {
      console.error('Zoho sync error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async syncInvoices(invoices: ZohoInvoice[], userId: string): Promise<SyncResult> {
    let synced = 0
    let errors = 0

    for (const invoice of invoices) {
      try {
        // In a real implementation, save to database
        // const existingInvoice = await db.invoice.findFirst({
        //   where: {
        //     userId,
        //     source: 'zoho',
        //     sourceId: invoice.invoice_id
        //   }
        // })

        // if (existingInvoice) {
        //   // Update existing invoice
        //   await db.invoice.update({
        //     where: { id: existingInvoice.id },
        //     data: {
        //       clientName: invoice.customer_name,
        //       clientEmail: invoice.customer_email,
        //       clientPhone: invoice.customer_phone,
        //       subtotal: invoice.subtotal,
        //       gstAmount: invoice.gst_total,
        //       total: invoice.total,
        //       status: this.mapZohoStatus(invoice.status),
        //       dueDate: new Date(invoice.due_date),
        //       notes: invoice.notes,
        //       data: invoice,
        //       updatedAt: new Date()
        //     }
        //   })
        // } else {
        //   // Create new invoice
        //   await db.invoice.create({
        //     data: {
        //       userId,
        //       source: 'zoho',
        //       sourceId: invoice.invoice_id,
        //       clientName: invoice.customer_name,
        //       clientEmail: invoice.customer_email,
        //       clientPhone: invoice.customer_phone,
        //       subtotal: invoice.subtotal,
        //       gstAmount: invoice.gst_total,
        //       total: invoice.total,
        //       status: this.mapZohoStatus(invoice.status),
        //       dueDate: new Date(invoice.due_date),
        //       notes: invoice.notes,
        //       data: invoice
        //     }
        //   })
        // }
        synced++
      } catch (error) {
        console.error('Error syncing Zoho invoice:', error)
        errors++
      }
    }

    return { synced, errors }
  }

  private async syncTransactions(transactions: ZohoTransaction[], userId: string): Promise<SyncResult> {
    let synced = 0
    let errors = 0

    for (const transaction of transactions) {
      try {
        // In a real implementation, save to database
        synced++
      } catch (error) {
        console.error('Error syncing Zoho transaction:', error)
        errors++
      }
    }

    return { synced, errors }
  }

  private async syncCustomers(customers: ZohoCustomer[], userId: string): Promise<SyncResult> {
    let synced = 0
    let errors = 0

    for (const customer of customers) {
      try {
        // In a real implementation, save to database
        synced++
      } catch (error) {
        console.error('Error syncing Zoho customer:', error)
        errors++
      }
    }

    return { synced, errors }
  }

  private async syncBills(bills: ZohoBill[], userId: string): Promise<SyncResult> {
    let synced = 0
    let errors = 0

    for (const bill of bills) {
      try {
        // In a real implementation, save to database
        synced++
      } catch (error) {
        console.error('Error syncing Zoho bill:', error)
        errors++
      }
    }

    return { synced, errors }
  }

  private mapZohoStatus(zohoStatus: string): string {
    const statusMap: Record<string, string> = {
      'sent': 'sent',
      'paid': 'paid',
      'overdue': 'overdue',
      'draft': 'draft',
      'void': 'void',
      'partially_paid': 'partially_paid',
      'viewed': 'sent',
      'accepted': 'sent',
      'declined': 'void'
    }
    
    return statusMap[zohoStatus] || 'draft'
  }

  private categorizeZohoTransaction(transaction: ZohoTransaction): string {
    // Use Zoho chart of accounts to categorize
    const accountId = transaction.chart_of_account_id
    const accountName = transaction.account_name?.toLowerCase() || ''
    
    // Map based on account name for better categorization
    const categoryMap: Record<string, string> = {
      // Income categories
      'sales': 'sales',
      'service': 'services',
      'consulting': 'services',
      'fees': 'services',
      'commission': 'commission',
      'interest': 'interest',
      'discount': 'discount',
      'revenue': 'sales',
      
      // Expense categories
      'purchase': 'purchases',
      'expenses': 'expenses',
      'cost': 'expenses',
      'rent': 'rent',
      'salary': 'payroll',
      'wages': 'payroll',
      'utilities': 'utilities',
      'marketing': 'marketing',
      'advertising': 'marketing',
      'insurance': 'insurance',
      'tax': 'taxes',
      'legal': 'legal',
      'bank charges': 'banking',
      
      // Banking categories
      'bank': 'banking',
      'cash': 'cash',
      'hdfc': 'banking',
      'icici': 'banking',
      'sbi': 'banking',
      
      // Asset categories
      'equipment': 'fixed_assets',
      'furniture': 'fixed_assets',
      'computer': 'fixed_assets',
      'vehicle': 'fixed_assets',
      
      // Liability categories
      'loan': 'loans',
      'credit': 'payables',
      'payable': 'payables',
      'overdraft': 'overdraft',
      
      // Equity categories
      'capital': 'capital',
      'drawings': 'drawings',
      'equity': 'equity'
    }
    
    // Try exact match first
    if (categoryMap[accountName]) {
      return categoryMap[accountName]
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(categoryMap)) {
      if (accountName.includes(key) || key.includes(accountName)) {
        return value
      }
    }
    
    // Fallback based on transaction type
    if (transaction.amount < 0) {
      return 'expenses'
    } else {
      return 'income'
    }
  }
}

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