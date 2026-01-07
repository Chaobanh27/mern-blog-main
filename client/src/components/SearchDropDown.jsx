import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'
import { searchAPI } from '~/apis'

const SearchDropdown = ({ data = [] }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, 1000)

  const containerRef = useRef(null)

  const filteredData = data.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  const highlight = (text, keyword) => {
    if (!keyword) return text

    const parts = text.split(new RegExp(`(${keyword})`, 'gi'))

    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="font-semibold text-blue-400">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const fetchData = async () => {
      const data = await searchAPI(debouncedQuery)
      setResults(data)
      setOpen(true)
    }

    fetchData()
  }, [debouncedQuery])

  const handleKeyDown = e => {
    if (!open) return

    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      setActiveIndex(prev =>
        prev < filteredData.length - 1 ? prev + 1 : 0
      )
      break

    case 'ArrowUp':
      e.preventDefault()
      setActiveIndex(prev =>
        prev > 0 ? prev - 1 : filteredData.length - 1
      )
      break

    case 'Enter':
      if (activeIndex >= 0) {
        setQuery(filteredData[activeIndex])
        setOpen(false)
        setActiveIndex(-1)
      }
      break

    case 'Escape':
      setOpen(false)
      setActiveIndex(-1)
      break
    }
  }

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-96">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search post or author..."
        className="w-full rounded-md border px-3 py-2 text-sm dark:placeholder:text-white placeholder:text-black "
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-gray-800 shadow-lg">
          {/* <div className="px-3 py-2 text-sm text-gray-500">
              Searching...
          </div> */}

          {results.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}

          {results.length > 0 &&
            results.map((post, index) => (
              <div
                key={post._id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => (window.location.href = `/posts/${post.slug}`)}
                className={`cursor-pointer px-3 py-2 text-sm
                  ${index === activeIndex ? 'dark:bg-black bg-gray-300' : 'hover:bg-gray-700'}
                `}
              >
                <div className="font-medium">
                  {highlight(post.title, query)}
                </div>
                <div className="text-xs text-gray-500">
                  by {highlight(post.author.name, query)}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
