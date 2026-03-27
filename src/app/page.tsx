'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CheckCircle, TrendingUp, Shield, Users, BarChart3, FileText, Calculator, MessageSquare, Zap, Lock, ArrowRight, Phone, Mail, MapPin, Star, Clock, HeadphonesIcon, FileCheck, IndianRupee, Building2, Receipt, PiggyBank, Award, Globe, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGetStarted = () => {
    // Redirect to signup page for user registration
    window.location.href = '/auth/signup'
  }

  const handleScheduleDemo = () => {
    // Handle schedule demo action
    console.log('Schedule Demo clicked')
    window.open('#contact', '_self')
  }

  const handlePricingClick = (planType: string) => {
    // Handle pricing plan selection
    console.log(`${planType} plan selected`)
    window.open('#contact', '_self')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="BizCFO Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-slate-900">BizCFO</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-slate-600 hover:text-emerald-600 transition-colors">Contact</a>
              <Button onClick={handleGetStarted} className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <a 
                    href="#features" 
                    className="text-slate-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#pricing" 
                    className="text-slate-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <a 
                    href="#contact" 
                    className="text-slate-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                  <Button onClick={() => { handleGetStarted(); setIsMobileMenuOpen(false); }} className="bg-emerald-600 hover:bg-emerald-700 w-full">
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                Complete Accounting & Finance Partner
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                Your Virtual <span className="text-emerald-600">CFO</span> & Accounting Team
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl">
                From day-to-day bookkeeping to strategic financial guidance—allowing small businesses and startups to grow without hiring in-house staff or multiple consultants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleGetStarted} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={handleScheduleDemo} size="lg" variant="outline" className="text-lg px-8 py-3">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/hero-image.png"
                alt="Financial Dashboard"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Monthly Growth</div>
                    <div className="text-xl font-bold text-slate-900">+24.5%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600">500+</div>
              <div className="text-slate-600">Businesses Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">15+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">99.9%</div>
              <div className="text-slate-600">Compliance Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600">24/7</div>
              <div className="text-slate-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete Financial Solution</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to manage your business finances, from basic bookkeeping to strategic CFO advisory
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Accounting & Bookkeeping */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Accounting & Bookkeeping</CardTitle>
                <CardDescription>
                  Daily transaction recording, automated ledger management, and bank reconciliation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Daily transaction recording
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Automated ledger & journal management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Bank & cash reconciliation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Inventory tracking
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* GST & Tax Compliance */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">GST & Tax Compliance</CardTitle>
                <CardDescription>
                  GST calculation, filing preparation, and CA-assisted compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    GST calculation (CGST/SGST/IGST)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Monthly/quarterly GST filing prep
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    TDS computation & records
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Income tax return preparation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Billing & Invoicing */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Billing & Invoicing</CardTitle>
                <CardDescription>
                  Professional invoices with GST details and digital payment options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Customizable invoice templates
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    QR code-enabled invoices
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Email/WhatsApp delivery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Payment tracking system
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Virtual CFO Services */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Virtual CFO Services</CardTitle>
                <CardDescription>
                  Financial reporting, business insights, and strategic advisory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    P&L, Balance Sheet, Cash Flow
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Business insights & analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Budgeting & cost control
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Growth & funding advisory
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Outsourced Accounting */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Outsourced Accounting</CardTitle>
                <CardDescription>
                  End-to-end accounting without hiring in-house staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Monthly/quarterly/yearly services
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Data entry & reconciliations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Cloud document management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    System integration support
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Client Communication */}
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Client Communication</CardTitle>
                <CardDescription>
                  WhatsApp/email support with automated alerts and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    WhatsApp/email support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Automated deadline alerts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Monthly performance reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                    Priority support channels
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Software Integration Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Seamless Integration</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Works with your existing tools and systems for a smooth transition
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accounting Software</h3>
              <p className="text-slate-600">Tally, Zoho Books, QuickBooks integration</p>
            </Card>
            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cloud Storage</h3>
              <p className="text-slate-600">Google Drive, Dropbox secure storage</p>
            </Card>
            <Card className="text-center p-8 border-0 shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">SaaS Tools</h3>
              <p className="text-slate-600">Automated billing, GST reports, dashboard</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Scalable solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="relative border-0 shadow-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Basic Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹4,999</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Entry-level bookkeeping & GST summary
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Daily transaction recording</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic GST summary</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Monthly reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Button onClick={() => handlePricingClick('Basic')} className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="relative border-2 border-emerald-500 shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Growth Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹9,999</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Full accounting + reconciliation + limited CA support
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Basic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Bank reconciliation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">GST filing preparation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic financial reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">WhatsApp + email support</span>
                  </li>
                </ul>
                <Button onClick={() => handlePricingClick('Growth')} className="w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-0 shadow-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹19,999</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <CardDescription className="mt-4">
                  Complete outsourced accounting + virtual CFO advisory
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Everything in Growth</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Virtual CFO advisory</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced financial analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Budgeting & forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority CA support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">24/7 dedicated support</span>
                  </li>
                </ul>
                <Button onClick={() => handlePricingClick('Pro')} className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Security & Compliance</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your data is secure and compliant with Indian regulations
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Data</h3>
              <p className="text-slate-600 text-sm">Encrypted storage and transmission</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance Ready</h3>
              <p className="text-slate-600 text-sm">Indian accounting & GST regulations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Audit Ready</h3>
              <p className="text-slate-600 text-sm">Complete documentation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certified Experts</h3>
              <p className="text-slate-600 text-sm">CA and CPA professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Trusted by hundreds of businesses across India
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "BizCFO transformed our financial management. We saved 40% on accounting costs while getting better insights."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Rahul Sharma</div>
                  <div className="text-sm text-slate-600">CEO, TechStart</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "The virtual CFO services helped us secure funding. Professional, reliable, and always available."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Priya Patel</div>
                  <div className="text-sm text-slate-600">Founder, EcoSolutions</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">
                "GST compliance used to be a nightmare. Now it's automated and stress-free. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Amit Kumar</div>
                  <div className="text-sm text-slate-600">MD, Manufacturing Co.</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business Finance?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join 500+ businesses that trust BizCFO for their complete accounting and financial needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleGetStarted} size="lg" className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button onClick={handleScheduleDemo} size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-3">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Have questions? Our team is here to help you find the perfect solution
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6 border-0 shadow-sm">
              <Phone className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-slate-600">+91 98765 43210</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm">
              <Mail className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-slate-600">contact@bizcfo.in</p>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm">
              <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Office</h3>
              <p className="text-slate-600">Mumbai, India</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo.png"
                  alt="BizCFO Logo"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold">BizCFO</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your complete accounting and finance partner for business growth.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/services/accounting-bookkeeping" className="hover:text-emerald-400 transition-colors">Accounting & Bookkeeping</a></li>
                <li><a href="/services/gst-tax-compliance" className="hover:text-emerald-400 transition-colors">GST & Tax Compliance</a></li>
                <li><a href="/services/virtual-cfo" className="hover:text-emerald-400 transition-colors">Virtual CFO Services</a></li>
                <li><a href="/services/billing-invoicing" className="hover:text-emerald-400 transition-colors">Billing & Invoicing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="/blog" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/help" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 BizCFO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}