import { useState, useRef, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import NotificationBell from './NotificationBell'
import { API_ROOT } from '~/utils/constants'
import { io } from 'socket.io-client'
import { getNotificationsAPI, markAllReadAPI } from '~/apis'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)


  const handleLogout = () => {
    dispatch(logoutUserAPI()).then(
      navigate('/account/login')
    )
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotificationsAPI()
      setNotifications(res)
    }

    currentUser && fetchNotifications()
  }, [currentUser])

  useEffect(() => {
    const socket = io(API_ROOT)
    if (currentUser) {
      socket.emit('join', currentUser._id)

      socket.on('notification', (data) => {
        setNotifications(prevState => [data, ...prevState])
        setUnreadCount(prevState => prevState + 1)
      })
    }

  }, [currentUser])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = async () => {
    const res = await markAllReadAPI()
    setNotifications(res)
    setUnreadCount(0)
  }


  return (
    <>
      <nav className="sm:px-[5vw] md:px-[7vw] lg:px-[9vw] w-full mx-auto px-4 dark:bg-gray-900 bg-gray-200 shadow-md fixed transition-colors duration-300 top-0 left-0 z-50">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to='/' className="fle -shrink-0 text-2xl font-bold text-blue">
              MyLogo
          </Link>

          {/* Menu - Desktop */}
          <div className="hidden md:flex space-x-6 items-center h-16 ">
            <Link to='/' className="dark:text-white hover:text-blue transition font-bold">
                        Home
            </Link>
            <Link to='/about-us' className="dark:text-white hover:text-blue transition font-bold">
                        About
            </Link>
            <Link to='/search-detail' className="dark:text-white hover:text-blue transition font-bold">
                        Search
            </Link>
            {
              currentUser ? <Link to='/bookmark' className="dark:text-white hover:text-blue transition font-bold">
                        Bookmark
              </Link> : null
            }

            <div ref={dropdownRef} className="relative flex" >

              {
                currentUser ?
                  <>
                    <img
                      onClick={() => setOpen(!open)}
                      src={currentUser.avatar}
                      alt="User Avatar"
                      className="object-cover w-10 h-10 mr-4 rounded-full border-2 border-blue cursor-pointer"
                    />
                    <NotificationBell
                      notifications={notifications}
                      unreadCount={notifications.filter(n => n.isRead === false).length + unreadCount}
                      onMarkAllRead={markAllRead}
                    />
                  </>

                  : <button className=" border-blue mr-4 border-2 px-3 py-1 cursor-pointer rounded-2xl">
                    <Link to='/account/login' className="dark:text-white hover:text-blue0 transition">
                        Login
                    </Link>
                  </button>
              }
              {/* Avatar + Dropdown */}

              <ThemeSelector/>

              <div className={`absolute left-0 mt-13 w-48 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 origin-top-right
                        ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
                      `}>
                <Link
                  to='/dashboard'
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                                Profile
                </Link>
                <Link
                  to='/dashboard/setting'
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                                Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-black px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                                Logout
                </button>
              </div>

            </div>

          </div>

          {/* Button Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Avatar (mobile vẫn có dropdown) */}
            <div className="relative">
              <img
                onClick={() => setOpen(!open)}
                src={currentUser?.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-blue"
              />

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
                  <Link
                    to='/dashboard'
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                                Profile
                  </Link>
                  <Link
                    to='/dashboard/setting'
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                                Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                                Logout
                  </button>
                </div>
              )}
            </div>

            {
              !currentUser && <button className=" border-blue border-2 px-3 py-1 cursor-pointer rounded-2xl text-white">
                    Sign Up
              </button>
            }


            {/* Hamburger Menu */}
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="text-gray-700 focus:outline-none"
            >
              {openMenu ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>
        </div>

        {/* Menu Mobile */}
        {openMenu && (
          <div className="md:hidden bg-gray-200 dark:bg-gray-900 shadow-md">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <Link to='/' className="block  hover:text-blue transition dark:text-white">
                        Home
              </Link>
              <Link to='/about-us' className="block  hover:text-blue transition dark:text-white">
                        About
              </Link>
              <Link to="/search-detail" className="block  hover:text-blue transition dark:text-white">
                        Search
              </Link>
              <Link to="/dashboard" className="block  hover:text-blue transition dark:text-white">
                        Dashboard
              </Link>
              <ThemeSelector/>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar