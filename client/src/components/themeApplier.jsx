import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const ThemeApplier = () => {
  const theme = useSelector((state) => state.theme.theme)

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      root.classList.remove('light', 'dark')

      if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
        root.classList.add('dark')
      } else {
        root.classList.add('light')
      }
    }

    applyTheme()

    // 👉 lắng nghe OS đổi theme
    mediaQuery.addEventListener('change', applyTheme)

    return () => {
      mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [theme])

  return null
}

export default ThemeApplier
