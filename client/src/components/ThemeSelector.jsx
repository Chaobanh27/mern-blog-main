import { Sun, Moon, Monitor } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentTheme, setTheme } from '~/redux/theme/themeSlice'

const ThemeSelector = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectCurrentTheme)

  const options = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-yellow-500" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-blue-500" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4 text-gray-500" /> }
  ]

  return (
    <div className="relative inline-block w-40">
      <select
        value={theme}
        onChange={(e) => dispatch(setTheme(e.target.value))}
        className="
          w-full appearance-none rounded-2xl border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
          px-4 py-2 pr-10 text-sm font-medium
          transition-all hover:border-gray-400 dark:hover:border-gray-500
          focus:outline-none shadow-xl/30
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        {options.find((opt) => opt.value === theme)?.icon}
      </div>
    </div>
  )
}

export default ThemeSelector
