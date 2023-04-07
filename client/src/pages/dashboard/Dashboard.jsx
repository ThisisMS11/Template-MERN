import React from 'react'
import { Navbar, Footer } from "../../components";
import './dashboard.css'

const Dashboard = () => {
  return (
    <div>
        <Navbar />
        <div className='dashboard'>
            <h1>Main</h1>
        </div>
        <Footer />
    </div>
  )
}

export default Dashboard