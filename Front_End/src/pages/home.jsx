import { useEffect, useState } from 'react'
import Header from "../components/header"
import axios from 'axios'
import { Dashboard } from '../components/Dashboard/dashboard'
import { Sidebar } from '../components/Sidebar/sidebar'

function Home() {

  return (
    <div className='grid gap-4 p-4 grid-cols-[220px,_1fr]'>
      <Header />
      <Sidebar />
      <Dashboard />
    </div>
  )
}



export default Home

  