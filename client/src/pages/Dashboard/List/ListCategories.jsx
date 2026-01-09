import { useState, useEffect } from 'react'
import TableItem from '~/components/Dashboard/TableItem'
import { useForm } from 'react-hook-form'
import { useDebounce } from '@uidotdev/usehooks'
import { getCategoriesAPI } from '~/apis'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Pagination from '~/components/Pagination'

const ListCategories = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const currentPage = parseInt(searchParams.get('page')) || 1
  const [totalPages, setTotalPages] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)

  const limit = 10

  const { register, watch, setValue } = useForm({
    defaultValues: {
      search: '',
      sortField: 'createdAt',
      sortOrder: 'desc'
    }
  })

  const search = watch('search')
  const sortField = watch('sortField')
  const sortOrder = watch('sortOrder')

  const debouncedSearch = useDebounce(search, 500)


  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategoriesAPI(currentPage, limit)
      setCategories(res.data)
      setTotalPages(res.totalPages)
      setTotalCategories(res.totalCategories)
    }

    fetchData()
  }, [currentPage, debouncedSearch, sortField, sortOrder])

  const changePage = (page) => {
    setSearchParams({ page })
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-gray-900 dark:text-white mt-5 font-bold">All Categories <span className='text-blue'>{totalCategories}</span></h1>
        {/* SEARCH + FILTER */}
        <div className="flex justify-between mb-4 mt-4 ">
          <input
            {
              ...register('search')
            }
            type="text"
            placeholder="Search...."
            className="border p-2 rounded w-1/3 dark:border-white dark:text-white"
            value={search}
          />

          <Link to='/dashboard/add-category' className='rounded p-2 bg-blue text-white'><Plus/></Link>
        </div>

        {categories.length > 0 ? <TableItem data={categories} setData={setCategories} sortField={sortField} sortOrder={sortOrder} setValue={setValue}/> :
          <div className='dark:text-white w-full text-center font-bold uppercase'>
            <p>no results found</p>
          </div>
        }

        {/* PAGINATION */}
        <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>

      </div>
    </>
  )
}

export default ListCategories