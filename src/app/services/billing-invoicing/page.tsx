import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function BillingInvoicing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="BizCFO Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-slate-900">BizCFO</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-slate-600 hover:text-emerald-600 transition-colors">Features</Link>
              <Link href="/#pricing" className="text-slate-600 hover:text-emerald-600 transition-colors">Pricing</Link>
              <Link href="/#contact" className="text-slate-600 hover:text-emerald-600 transition-colors">Contact</Link>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">Essential Service</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Billing & <span className="text-purple-600">Invoicing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Professional invoicing solutions with GST compliance and automated payment tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-sm text-slate-400">
            <p>&copy; 2024 BizCFO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}