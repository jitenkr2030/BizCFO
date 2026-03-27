'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import IntegrationDashboard from '@/components/integrations/IntegrationDashboard'

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto py-8">
      <IntegrationDashboard />
    </div>
  )
}