'use client'

import * as React from 'react'
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useDashboardStore from '@/hooks/useDashboardStore'
import { getOrgs } from "@/server/actions/getOrgs"
import {useEffect } from 'react'
import {useTheme} from 'next-themes'
import { Toggle } from '@/components/ui/toggle'
import { MoonIcon } from 'lucide-react'

export default function CustomSidebar() {
  useEffect(()=> {
    const orgs = getOrgs()
    console.log("frontend orgs: ", orgs)
  }, [])
  
  const {organisationId, organisationName} = useDashboardStore()
  const { theme, setTheme } = useTheme()

  return (

      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className='flex items-center justify-between w-full'>
          <h1 className="font-semibold">{organisationName}</h1>

          <Toggle onChange={()=> {setTheme(theme === 'light' ? 'dark' : 'light')}}>
            <MoonIcon />
          </Toggle>
          </div>
        </header>
        <main className="flex-1 p-6">
          {/* Your main content goes here */}
          <p>Main content area</p>
        </main>
      </div>
    // </SidebarProvider>
  )
}

