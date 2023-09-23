import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import '../styles/root.css'

export default function Root({children}) {
  return (<>
  <Header />
  <Sidebar />
    <div className='content'>{children}</div>
  </>
  )
}
