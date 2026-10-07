import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'

function Layout() {
  return (
    <div className='flex flex-col h-screen'>
    <Header />
    <div className="flex-1 overflow-y-auto min-h-0">
        <Outlet />
        <Footer />
    </div>
    </div>
  )
}

export default Layout