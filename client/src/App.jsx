import { useSelector } from 'react-redux'
import Home from '~/pages/PublicLayout/Home'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'
import PublicLayout from '~/pages/PublicLayout/PublicLayout'
import DashboardLayout from '~/pages/Dashboard/DashboardLayout'
import Dashboard from '~/pages/Dashboard/Dashboard'
import ListUsers from '~/pages/Dashboard/List/ListUsers'
import Settings from '~/pages/Dashboard/settings/Settings'
import AccountTab from '~/pages/Dashboard/settings/AccountTab'
import SecurityTab from '~/pages/Dashboard/settings/SecurityTab'
import NotFoundPage from '~/pages/404/NotFoundPage'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { selectCurrentUser } from '~/redux/user/userSlice'
import ForgotPassword from '~/pages/Auth/ForgotPassword'
import ResetPassword from '~/pages/Auth/ResetPassword'
import BlogDetail from '~/pages/PublicLayout/BlogDetail'
import AuthorDetail from '~/pages/PublicLayout/AuthorDetail'
import SearchDetail from '~/pages/PublicLayout/SearchDetail'
import AboutUs from '~/pages/PublicLayout/AboutUs'
import ListBlogs from '~/pages/Dashboard/List/ListBlogs'
import ListComments from '~/pages/Dashboard/List/ListComments'
import ListCategories from '~/pages/Dashboard/List/ListCategories'
import ListTags from '~/pages/Dashboard/List/ListTags'
import Bookmark from '~/pages/PublicLayout/Bookmark'
import AddBlog from '~/pages/Dashboard/Add/AddBlog'
import AddCategory from '~/pages/Dashboard/Add/AddCategory'
import AddTag from '~/pages/Dashboard/Add/AddTag'
import EditBlog from '~/pages/Dashboard/EditBlog'
import Require2FA from './components/Require2FA'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

const App = () => {
  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    if (currentUser.require2FA && !currentUser.is2FAVerified) {
      return <Require2FA user={currentUser}/>
    }
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path='/' element={ <Navigate to='/home' replace={true} />}/>
          <Route path='/blog-detail/:postId' element={<BlogDetail/>} />
          <Route path='/author-detail' element={<AuthorDetail/>} />
          <Route path='/search-detail' element={<SearchDetail/>} />
          <Route path='/bookmark' element={<Bookmark/>} />
          <Route path='/about-us' element={<AboutUs/>} />

          <Route path='/account/login' element={<Auth/>} />
          <Route path='/account/register' element={<Auth/>} />
          <Route path="/account/forgot-password" element={<ForgotPassword />} />
          <Route path="/account/reset-password" element={<ResetPassword />} />
          <Route path='/account/verification' element={<AccountVerification/>} />
        </Route>


        {/* Dashboard routes */}
        <Route element={<ProtectedRoute user={currentUser} />}>
          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<Dashboard/>} />
            <Route path='add-blog' element={<AddBlog/>}/>
            <Route path='edit-blog/:postId' element={<EditBlog/>}/>
            <Route path='add-category' element={<AddCategory/>}/>
            <Route path='add-tag' element={<AddTag/>}/>
            <Route path='list-users' element={<ListUsers/>}/>
            <Route path='list-blogs' element={<ListBlogs/>}/>
            <Route path='list-comments' element={<ListComments/>}/>
            <Route path='list-categories' element={<ListCategories/>}/>
            <Route path='list-tags' element={<ListTags/>}/>
            <Route path='setting' element={<Settings/>}>
              <Route index element={<AccountTab/>}/>
              <Route path='security-tab' element={<SecurityTab/>}/>
            </Route>

          </Route>
        </Route>


        <Route path='*' element={<NotFoundPage/>} />

      </Routes>

    </>
  )
}

export default App
