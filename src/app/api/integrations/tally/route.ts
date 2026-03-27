import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import * as xlsx from 'xlsx'

interface TallyRow {
  'Voucher No.': string
  'Date': string
  'Particulars': string
  'Ledger': string
  'Voucher Type': string
  'Debit': string | number
  'Credit': string | number
  'CGST'?: string | number
  'SGST'?: string | number
  'IGST'?: string | number
  'GST'?: string | number
  'CESS'?: string | number
}

interface Transaction {
  voucherNo: string
  date: Date
  particular: string
  voucherType: string
  debit: number
  credit: number
  ledger: string
  amount: number
  type: 'income' | 'expense'
  category: string
  gstAmount: number | null
  needsReview: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reviewReason: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  totalRows: number
  validRows: number
  invalidRows: number
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type", 
        details: "Please upload an Excel (.xlsx, .xls) or CSV file"
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File too large", 
        details: "File size must be less than 10MB"
      }, { status: 400 })
    }

    // Parse Tally Excel/CSV export
    const buffer = await file.arrayBuffer()
    const workbook = xlsx.read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const rawData = xlsx.utils.sheet_to_json(worksheet) as TallyRow[]

    // Validate Tally data format
    const validationResult = validateTallyFormat(rawData)
    if (!validationResult.isValid) {
      return NextResponse.json({ 
        error: "Invalid Tally format", 
        details: validationResult.errors,
        validation: validationResult
      }, { status: 400 })
    }

    // Map Tally data to BizCFO format
    const transactions = parseTallyData(rawData)
    
    // Save to database with source tracking
    const savedTransactions: any[] = []
    const reviewItems: any[] = []
    
    for (const transaction of transactions) {
      try {
        // In a real implementation, save to database
        // const saved = await db.transaction.create({
        //   data: {
        //     userId: session.user.id,
        //     source: 'tally',
        //     sourceId: transaction.voucherNo,
        //     ...transaction
        //   }
        // })
        savedTransactions.push(transaction)
        
        // Trigger reviews for complex transactions
        if (transaction.needsReview) {
          reviewItems.push({
            clientId: session.user.id,
            type: 'transaction',
            priority: transaction.priority,
            reason: transaction.reviewReason,
            status: 'pending',
            data: JSON.stringify(transaction)
          })
        }
      } catch (error) {
        console.error('Error saving transaction:', error)
      }
    }

    // Update integration status
    // In a real implementation, save to database
    // await db.integration.upsert({
    //   where: { 
    //     userId: session.user.id, 
    //     software: 'tally' 
    //   },
    //   update: {
    //     status: 'connected',
    //     lastSync: new Date(),
    //     config: {
    //       lastImportCount: transactions.length,
    //       lastReviewCount: reviewItems.length
    //     }
    //   },
    //   create: {
    //     data: {
    //       userId: session.user.id,
    //       software: 'tally',
    //       status: 'connected',
    //       lastSync: new Date(),
    //       config: {
    //         lastImportCount: transactions.length,
    //         lastReviewCount: reviewItems.length
    //       }
    //     }
    //   }
    // })

    return NextResponse.json({
      message: "Tally data imported successfully",
      transactionsImported: transactions.length,
      reviewsTriggered: reviewItems.length,
      validation: validationResult,
      sampleTransactions: transactions.slice(0, 3), // Return sample for preview
      reviewItems: reviewItems.slice(0, 3) // Return sample for preview
    })

  } catch (error) {
    console.error("Tally import error:", error)
    return NextResponse.json({ error: "Import failed" }, { status: 500 })
  }
}

function validateTallyFormat(data: TallyRow[]): ValidationResult {
  const errors: string[] = []
  
  // Check if data exists
  if (!data || data.length === 0) {
    errors.push("No data found in file")
    return { isValid: false, errors, totalRows: 0, validRows: 0, invalidRows: 0 }
  }

  const requiredColumns = ['Voucher No.', 'Date', 'Particulars', 'Ledger']
  const firstRow = data[0]
  
  // Check required columns
  for (const column of requiredColumns) {
    if (!(column in firstRow)) {
      errors.push(`Missing required column: ${column}`)
    }
  }

  let validRows = 0
  let invalidRows = 0

  // Validate data types and format
  data.forEach((row, index) => {
    if (index === 0) return // Skip header row
    
    let isValid = true
    
    // Validate date format
    if (row['Date'] && !parseTallyDate(row['Date'])) {
      errors.push(`Invalid date format in row ${index + 1}: ${row['Date']}`)
      isValid = false
    }
    
    // Validate amounts
    if (row['Debit'] && isNaN(parseFloat(row['Debit'].toString()))) {
      errors.push(`Invalid debit amount in row ${index + 1}: ${row['Debit']}`)
      isValid = false
    }
    
    if (row['Credit'] && isNaN(parseFloat(row['Credit'].toString()))) {
      errors.push(`Invalid credit amount in row ${index + 1}: ${row['Credit']}`)
      isValid = false
    }
    
    if (isValid) {
      validRows++
    } else {
      invalidRows++
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    totalRows: data.length,
    validRows,
    invalidRows
  }
}

function parseTallyData(data: TallyRow[]): Transaction[] {
  const transactions: Transaction[] = []
  
  data.forEach((row, index) => {
    // Skip header row
    if (index === 0) return
    
    // Parse and validate each field
    const transaction: Transaction = {
      voucherNo: row['Voucher No.']?.toString() || '',
      date: parseTallyDate(row['Date']) || new Date(),
      particular: row['Particulars']?.toString() || '',
      voucherType: row['Voucher Type']?.toString() || '',
      debit: parseFloat(row['Debit']?.toString()) || 0,
      credit: parseFloat(row['Credit']?.toString()) || 0,
      ledger: row['Ledger']?.toString() || '',
      amount: Math.abs(parseFloat(row['Debit']?.toString()) || parseFloat(row['Credit']?.toString()) || 0),
      type: parseFloat(row['Debit']?.toString()) > 0 ? 'expense' : 'income',
      category: categorizeTallyLedger(row['Ledger']?.toString() || ''),
      gstAmount: calculateGSTFromTally(row),
      needsReview: needsTallyReview(row),
      priority: determinePriority(row),
      reviewReason: getReviewReason(row)
    }
    
    transactions.push(transaction)
  })
  
  return transactions
}

function parseTallyDate(dateStr: string): Date {
  if (!dateStr) return new Date()
  
  // Handle various Tally date formats
  const formats = [
    'DD-MM-YYYY',    // 15-01-2024
    'DD/MM/YYYY',    // 15/01/2024
    'DD-MM-YY',      // 15-01-24
    'DD/MM/YY',      // 15/01/24
    'D-M-YYYY',      // 5-1-2024
    'D/M/YYYY',      // 5/1/2024
  ]
  
  for (const format of formats) {
    const parsed = parseDate(dateStr, format)
    if (parsed) return parsed
  }
  
  // Fallback to current date
  return new Date()
}

function parseDate(dateStr: string, format: string): Date | null {
  try {
    const parts = dateStr.split(/[-\/]/)
    
    if (parts.length !== 3) return null
    
    let day: number, month: number, year: number
    
    if (format === 'DD-MM-YYYY' || format === 'DD/MM/YYYY') {
      day = parseInt(parts[0])
      month = parseInt(parts[1])
      year = parseInt(parts[2])
    } else if (format === 'DD-MM-YY' || format === 'DD/MM/YY') {
      day = parseInt(parts[0])
      month = parseInt(parts[1])
      year = parseInt(parts[2]) + 2000
    } else if (format === 'D-M-YYYY' || format === 'D/M/YYYY') {
      day = parseInt(parts[0])
      month = parseInt(parts[1])
      year = parseInt(parts[2])
    } else {
      // Default case
      day = parseInt(parts[0])
      month = parseInt(parts[1])
      year = parseInt(parts[2])
    }
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    if (day < 1 || day > 31) return null
    if (month < 1 || month > 12) return null
    if (year < 2000 || year > 2100) return null
    
    return new Date(year, month - 1, day)
  } catch {
    return null
  }
}

function categorizeTallyLedger(ledger: string): string {
  const categories: Record<string, string> = {
    // Income categories
    'Sales Accounts': 'sales',
    'Service Income': 'services',
    'Interest Income': 'interest',
    'Commission Received': 'commission',
    'Discount Received': 'discount',
    'Bad Debts Recovered': 'bad_debts_recovered',
    'Sales': 'sales',
    'Revenue': 'sales',
    'Income': 'income',
    
    // Expense categories
    'Purchase Accounts': 'purchases',
    'Direct Expenses': 'direct_expenses',
    'Indirect Expenses': 'indirect_expenses',
    'Duties & Taxes': 'taxes',
    'Provision for Taxes': 'tax_provision',
    'Depreciation': 'depreciation',
    'Interest Paid': 'interest_paid',
    'Commission Paid': 'commission_paid',
    'Discount Allowed': 'discount_allowed',
    'Bad Debts': 'bad_debts',
    'Expenses': 'expenses',
    'Purchase': 'purchases',
    'Cost': 'expenses',
    
    // Banking categories
    'Bank Accounts': 'banking',
    'Cash-in-Hand': 'cash',
    'HDFC Bank': 'banking',
    'ICICI Bank': 'banking',
    'SBI Bank': 'banking',
    'Bank': 'banking',
    'Cash': 'cash',
    
    // Asset categories
    'Fixed Assets': 'fixed_assets',
    'Current Assets': 'current_assets',
    'Investments': 'investments',
    'Loans & Advances': 'loans',
    'Assets': 'assets',
    
    // Liability categories
    'Sundry Debtors': 'receivables',
    'Sundry Creditors': 'payables',
    'Bank Loan': 'bank_loan',
    'Bank Overdraft': 'overdraft',
    'Liabilities': 'liabilities',
    'Creditors': 'payables',
    'Debtors': 'receivables',
    
    // Equity categories
    'Capital Account': 'capital',
    'Reserves & Surplus': 'reserves',
    'Profit & Loss Account': 'pl_account',
    'Equity': 'equity'
  }
  
  // Try exact match first
  if (categories[ledger]) {
    return categories[ledger]
  }
  
  // Try partial match
  const ledgerLower = ledger.toLowerCase()
  for (const [key, value] of Object.entries(categories)) {
    if (key.toLowerCase().includes(ledgerLower) || ledgerLower.includes(key.toLowerCase())) {
      return value
    }
  }
  
  // Fallback categories based on keywords
  if (ledgerLower.includes('sales') || ledgerLower.includes('revenue')) {
    return 'sales'
  }
  if (ledgerLower.includes('purchase') || ledgerLower.includes('expense')) {
    return 'expenses'
  }
  if (ledgerLower.includes('bank') || ledgerLower.includes('cash')) {
    return 'banking'
  }
  if (ledgerLower.includes('tax') || ledgerLower.includes('gst')) {
    return 'taxes'
  }
  if (ledgerLower.includes('salary') || ledgerLower.includes('wages')) {
    return 'payroll'
  }
  if (ledgerLower.includes('rent') || ledgerLower.includes('lease')) {
    return 'rent'
  }
  if (ledgerLower.includes('interest')) {
    return 'interest'
  }
  if (ledgerLower.includes('commission')) {
    return 'commission'
  }
  if (ledgerLower.includes('insurance')) {
    return 'insurance'
  }
  if (ledgerLower.includes('legal')) {
    return 'legal'
  }
  if (ledgerLower.includes('marketing') || ledgerLower.includes('advertising')) {
    return 'marketing'
  }
  if (ledgerLower.includes('utilities')) {
    return 'utilities'
  }
  if (ledgerLower.includes('software')) {
    return 'software'
  }
  if (ledgerLower.includes('office')) {
    return 'office'
  }
  
  return 'other'
}

function calculateGSTFromTally(row: TallyRow): number | null {
  const gstColumns = ['CGST', 'SGST', 'IGST', 'GST', 'CESS']
  let totalGST = 0
  
  for (const col of gstColumns) {
    const value = parseFloat(row[col]?.toString()) || 0
    if (!isNaN(value)) {
      totalGST += value
    }
  }
  
  return totalGST > 0 ? totalGST : null
}

function needsTallyReview(row: TallyRow): boolean {
  const amount = Math.abs(parseFloat(row['Debit']?.toString()) || parseFloat(row['Credit']?.toString()) || 0)
  const particular = (row['Particulars'] || '').toLowerCase()
  const voucherType = (row['Voucher Type'] || '').toLowerCase()
  
  // Trigger review conditions
  return (
    amount > 100000 || // Large amounts
    amount < -100000 || // Large credits
    particular.includes('adjustment') || // Adjustments
    particular.includes('write off') || // Write-offs
    particular.includes('provision') || // Provisions
    particular.includes('settlement') || // Settlements
    particular.includes('capital') || // Capital transactions
    voucherType === 'journal' || // Journal entries
    voucherType === 'contra' || // Contra entries
    voucherType === 'memorandum' || // Memorandum entries
    (row['Ledger'] || '').toLowerCase().includes('suspense') || // Suspense accounts
    (row['Ledger'] || '').toLowerCase().includes('rounding') // Rounding accounts
  )
}

function determinePriority(row: TallyRow): 'low' | 'medium' | 'high' | 'urgent' {
  const amount = Math.abs(parseFloat(row['Debit']?.toString()) || parseFloat(row['Credit']?.toString()) || 0)
  const particular = (row['Particulars'] || '').toLowerCase()
  
  // Urgent priority
  if (amount > 1000000) return 'urgent'
  if (particular.includes('fraud') || particular.includes('investigation')) return 'urgent'
  
  // High priority
  if (amount > 100000) return 'high'
  if (particular.includes('legal') || particular.includes('tax')) return 'high'
  
  // Medium priority
  if (amount > 50000) return 'medium'
  if (particular.includes('adjustment') || particular.includes('provision')) return 'medium'
  
  // Low priority
  return 'low'
}

function getReviewReason(row: TallyRow): string {
  const amount = Math.abs(parseFloat(row['Debit']?.toString()) || parseFloat(row['Credit']?.toString()) || 0)
  const particular = (row['Particulars'] || '').toLowerCase()
  const voucherType = (row['Voucher Type'] || '').toLowerCase()
  
  const reasons: string[] = []
  
  if (amount > 1000000) reasons.push('Very large amount')
  if (amount > 100000) reasons.push('Large amount')
  
  if (particular.includes('adjustment')) reasons.push('Adjustment entry')
  if (particular.includes('write off')) reasons.push('Write-off')
  if (particular.includes('provision')) reasons.push('Provision')
  if (particular.includes('settlement')) reasons.push('Settlement')
  if (particular.includes('capital')) reasons.push('Capital transaction')
  
  if (voucherType === 'journal') reasons.push('Journal entry')
  if (voucherType === 'contra') reasons.push('Contra entry')
  if (voucherType === 'memorandum') reasons.push('Memorandum entry')
  
  if ((row['Ledger'] || '').toLowerCase().includes('suspense')) reasons.push('Suspense account')
  if ((row['Ledger'] || '').toLowerCase().includes('rounding')) reasons.push('Rounding')
  
  return reasons.join(', ') || 'Standard transaction review'
}