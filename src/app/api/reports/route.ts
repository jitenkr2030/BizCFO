import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "summary"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    switch (type) {
      case "summary":
        return await getSummaryReport(startDate || undefined, endDate || undefined)
      case "profit-loss":
        return await getProfitLossReport()
      case "cash-flow":
        return await getCashFlowReport()
      case "category-breakdown":
        return await getCategoryBreakdownReport()
      case "monthly-trend":
        return await getMonthlyTrendReport()
      default:
        return await getSummaryReport(startDate || undefined, endDate || undefined)
    }
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function getSummaryReport(startDate?: string, endDate?: string) {
  // Mock data for demo
  const income = 45000
  const expenses = 32000
  const profit = income - expenses

  const monthlyData = {
    "2024-01": { income: 45000, expenses: 32000, profit: 13000 },
    "2023-12": { income: 38000, expenses: 28000, profit: 10000 },
    "2023-11": { income: 42000, expenses: 30000, profit: 12000 },
  }

  return NextResponse.json({
    type: "summary",
    period: {
      startDate,
      endDate,
    },
    totals: {
      income,
      expenses,
      profit,
    },
    monthlyData,
    transactionCount: 24,
  })
}

async function getProfitLossReport() {
  const mockData = [
    {
      date: "2024-01-15",
      description: "Office Rent",
      category: "office_rent",
      income: 0,
      expense: 15000,
      profit: -15000,
    },
    {
      date: "2024-01-14",
      description: "Client Payment - ABC Corp",
      category: "consulting",
      income: 25000,
      expense: 0,
      profit: 25000,
    },
    {
      date: "2024-01-13",
      description: "Software Subscription",
      category: "software",
      income: 0,
      expense: 2999,
      profit: -2999,
    },
  ]

  return NextResponse.json({
    type: "profit-loss",
    data: mockData,
  })
}

async function getCashFlowReport() {
  const mockData = [
    {
      date: "2024-01-13",
      description: "Starting Balance",
      inflow: 0,
      outflow: 0,
      balance: 10000,
    },
    {
      date: "2024-01-14",
      description: "Client Payment",
      inflow: 25000,
      outflow: 0,
      balance: 35000,
    },
    {
      date: "2024-01-15",
      description: "Office Rent",
      inflow: 0,
      outflow: 15000,
      balance: 20000,
    },
  ]

  return NextResponse.json({
    type: "cash-flow",
    data: mockData,
    finalBalance: 20000,
  })
}

async function getCategoryBreakdownReport() {
  const mockData = {
    "office_rent": { income: 0, expense: 15000, total: -15000, transactions: 1 },
    "consulting": { income: 25000, expense: 0, total: 25000, transactions: 1 },
    "software": { income: 0, expense: 2999, total: -2999, transactions: 1 },
    "marketing": { income: 0, expense: 5000, total: -5000, transactions: 2 },
  }

  return NextResponse.json({
    type: "category-breakdown",
    data: mockData,
  })
}

async function getMonthlyTrendReport() {
  const mockData = {
    "2024-01": { income: 45000, expenses: 32000, transactions: 24 },
    "2023-12": { income: 38000, expenses: 28000, transactions: 20 },
    "2023-11": { income: 42000, expenses: 30000, transactions: 22 },
  }

  return NextResponse.json({
    type: "monthly-trend",
    data: mockData,
  })
}