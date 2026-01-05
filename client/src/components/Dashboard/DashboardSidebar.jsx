import { Home, Users, Settings, ChevronRight, ChevronLeft, Pen, Newspaper, MessageSquareText, Tag, Blocks } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const DashBoardSidebar = ({ collapsed, setCollapsed }) => {

  const sidebarItems = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: <Home/>
    },
    {
      name: 'Add Blogs',
      to: '/dashboard/add-blog',
      icon: <Pen />
    },
    {
      name: 'Users',
      to: '/dashboard/list-users',
      icon: <Users />
    },
    {
      name: 'Blogs',
      to: '/dashboard/list-blogs',
      icon: <Newspaper />
    },
    {
      name: 'Comments',
      to: '/dashboard/list-comments',
      icon: <MessageSquareText />
    },
    {
      name: 'Category',
      to: '/dashboard/list-categories',
      icon: <Blocks />
    },
    {
      name: 'Tag',
      to: '/dashboard/list-tags',
      icon: <Tag />
    },
    {
      name: 'Settings',
      to: '/dashboard/setting',
      icon: <Settings />
    }
  ]


  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 
          ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex items-center justify-between p-4 h-18 border-b border-gray-700">
        <span
          className={`font-semibold text-lg transition-opacity duration-200 ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          {!collapsed && 'Admin'}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-700 cursor-pointer"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft/>}
        </button>
      </div>
      {/* //dùng navlink để dùng cho menu điều hướng, khi muốn biết tab nào đang active để highlights */}
      {
        sidebarItems.map( item => {
          return (
            <NavLink key={item.name} end={true} to={item.to} className={({ isActive }) => `dark:text-white flex items-center gap-3 py-3.5 px-3  cursor-pointer ${item.name === 'Settings' && 'absolute bottom-0 w-full'} ${collapsed && 'justify-center'} ${isActive && 'bg-indigo-800/40 dark:bg-white/10 dark:border-white'}`}>
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          )
        })
      }

    </aside>

  )
}

export default DashBoardSidebar

