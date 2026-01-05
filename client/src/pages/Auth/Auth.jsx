import { useLocation } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const Auth = () => {
  const location = useLocation()
  const isLogin = location.pathname === '/account/login'
  const isRegister = location.pathname === '/account/register'
  return (
    <>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </>
  )
}

export default Auth