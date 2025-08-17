'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import Navbar from './navbar'

interface ProtectedLayoutProps {
  children: React.ReactNode
  user: {
    id: string
    email?: string | null
    image?: string | null
  } | null
  userDetails?: {
    id: string
    first_name?: string | null
    last_name?: string | null
    email?: string | null
  } | null
}

export function ProtectedLayout({ children, user, userDetails }: ProtectedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        className="md:relative"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          user={user} 
          userDetails={userDetails}
          onMenuClick={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
