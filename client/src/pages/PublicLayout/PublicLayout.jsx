import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import FloatingButton from '~/components/FloatingButton'

export default function PublicLayout() {
  const location = useLocation()

  const url = location.pathname

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-gray-900 dark:text-white'>
      {url.includes('/account') ? null : <Navbar/>}
      <main className=''>
        <Outlet />
      </main>
      <FloatingButton/>
      {url.includes('/account') ? null : <Footer/>}
    </div>
  )
}
