import React from 'react'
import Header from '../components/Header';
import DashboardA2 from '../components/DashboardA2';

function Adminhome() {
  return (
    <div  className="w-screen min-h-screen">
        <Header/>
        <div>
          <DashboardA2/>
        </div>
    </div>
  )
}

export default Adminhome