import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function GSTTaxCompliance() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="BizCFO Logo"
                className="w-8 h-8 rounded-lg"
              />
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
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
              Tax Service
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              GST & Tax <span className="text-green-600">Compliance</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Complete tax compliance solutions including GST filing, TDS management, and income tax returns with expert CA assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Comprehensive Tax Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to stay compliant with Indian tax regulations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">GST Calculation & Filing</CardTitle>
                <CardDescription>
                  Automated GST compliance for your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    CGST/SGST/IGST calculation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Monthly GSTR-1 filing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Quarterly GSTR-3B filing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">TDS Management</CardTitle>
                <CardDescription>
                  Complete TDS compliance and certificate generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    TDS calculation & deduction
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    TDS return filing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Form 16/16A generation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Income Tax Returns</CardTitle>
                <CardDescription>
                  Professional income tax filing for businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    ITR preparation & filing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Tax planning & optimization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Tax notice handling
                  </li>
                </ul>
              </CardContent>
            </Card>
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