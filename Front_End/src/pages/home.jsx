import { useEffect, useState } from 'react'
import Header from "../components/header"
import { Dashboard } from '../components/Dashboard/dashboard'
import { Sidebar } from '../components/Sidebar/sidebar'

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="grid grid-cols-[220px,1fr] gap-2 p-2">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  )
}

export default Home

