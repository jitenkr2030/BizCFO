import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Legal</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Terms of <span className="text-emerald-600">Service</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Read our terms and conditions for using BizCFO services.
          </p>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-slate-400">&copy; 2024 BizCFO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}