import { Pen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { toggleActiveById } from '~/apis'
import LoadingSpinner from '~/components/LoadingSpinner'


const TableItem = ({ data, setData, sortField, sortOrder, setValue }) => {
  const location = useLocation()
  const url = (location.pathname).substring('/dashboard/'.length)

  //const dataCopy = [...data]

  console.log(data);

  const toggleActive = async (name, id) => {
    await toggleActiveById(name, id)

    // const res = await toggleActiveById(name, id)
    // for (let i = 0; i < dataCopy.length; i++) {
    //   if (dataCopy[i]._id === res._id) {
    //     dataCopy[i].isActive = res.isActive
    //   }
    // }
    // setData(dataCopy)

    //dùng cách này hay hơn :D
    setData(prevState =>
      prevState.map(item => item._id === id ? { ...item, isActive: !item.isActive } : item)
    )
  }

  if (data.length > 0) {
    if (url === 'list-users') {
      return (
        <div className="overflow-x-auto ">
          <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
            <Thead className="bg-gray-100 uppercase text-gray-900">
              <Tr>
                <Th className="p-3 text-center">#</Th>
                <Th className="p-3 ">Avatar</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'username')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Username {sortField === 'username' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Email</Th>
                <Th className="p-3 text-start">Role</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'createdAt')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Created At {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Status</Th>
                <Th className="p-3">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data && data.map((user, i) => {
                return (
                  <Tr key={user?._id} className="border-t border-gray-200">
                    <Td className="text-center p-3">{i + 1}</Td>
                    <Td className="p-3">
                      <img src={user?.avatar} alt="user avatar" className="w-10 h-10 rounded-full object-cover m-auto" />
                    </Td>
                    <Td className="p-3">{user?.username}</Td>
                    <Td className="p-3">{user?.email}</Td>
                    <Td className="p-3">{user?.role?.name}</Td>
                    <Td className="p-3">{new Date(user?.createdAt).toLocaleDateString()}</Td>
                    <Td className="p-3">
                      <span
                        className={`${
                          user.isActive ? 'text-green-600' : 'text-orange-600'
                        } font-semibold`}
                      >
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Td>
                    <Td>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleActive('users', user._id)}
                          checked={user.isActive}
                          type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                        </div>
                      </label>
                    </Td>
                  </Tr>
                )}
              )
              }
            </Tbody>
          </Table>
        </div>
      )
    }
    else if (url === 'list-blogs') {
      return (
        <div className="overflow-x-auto ">
          <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
            <Thead className="bg-gray-100 uppercase text-gray-900">
              <Tr>
                <Th className="p-3 text-center">#</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'title')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Title {sortField === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Category</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'createdAt')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Created At {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Status</Th>
                <Th className="p-3">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 && data.map((post, i) => {
                return (
                  <Tr key={post._id} className="border-t border-gray-200">
                    <Td className="text-center p-3">{i + 1}</Td>
                    <Td className="p-3">{post?.title}</Td>
                    <Td className="p-3">{post?.category?.name}</Td>
                    <Td className="p-3">{new Date(post?.createdAt).toLocaleDateString()}</Td>
                    <Td className="p-3">
                      <span
                        className={`${
                          post?.status === 'published' ? 'text-green-600' : 'text-orange-600'
                        } font-semibold`}
                      >
                        {post?.status}
                      </span>
                    </Td>
                    <Td className='flex gap-2 items-center justify-center p-3'>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleActive('posts', post._id)}
                          checked={post.isActive}
                          type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                        </div>
                      </label>
                      <Link to={'/dashboard/edit-blog/' + post._id}><Pen/></Link>
                    </Td>
                  </Tr>
                )}
              )
              }
            </Tbody>
          </Table>
        </div>
      )
    }
    else if (url === 'list-comments') {
      return (
        <div className="overflow-x-auto ">
          <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
            <Thead className="bg-gray-100 uppercase text-gray-900">
              <Tr>
                <Th className="p-3 text-center">#</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'username')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Username {sortField === 'username' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'content')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >content {sortField === 'content' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'createdAt')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Created At {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Status</Th>
                <Th className="p-3">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 && data.map((comment, i) => {
                return (
                  <Tr key={comment._id} className="border-t border-gray-200">
                    <Td className="text-center p-3">{i + 1}</Td>
                    <Td className="p-3">{comment.userId.username}</Td>
                    <Td className="p-3">{comment?.content}</Td>
                    <Td className="p-3">{new Date(comment?.createdAt).toLocaleDateString()}</Td>
                    <Td className="p-3">
                      <span
                        className={`${
                          comment?.isActive === true ? 'text-green-600' : 'text-orange-600'
                        } font-semibold`}
                      >
                        {comment?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Td>
                    <Td>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleActive('comments', comment._id)}
                          checked={comment.isActive}
                          type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                        </div>
                      </label>
                    </Td>
                  </Tr>
                )}
              )
              }
            </Tbody>
          </Table>
        </div>
      )
    }
    else if (url === 'list-categories') {
      return (
        <div className="overflow-x-auto ">
          <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
            <Thead className="bg-gray-100 uppercase text-gray-900">
              <Tr>
                <Th className="p-3 text-center">#</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'name')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'createdAt')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Created At {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Status</Th>
                <Th className="p-3">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 && data.map((category, i) => {
                return (
                  <Tr key={category?._id} className="border-t border-gray-200">
                    <Td className="text-center p-3">{i + 1}</Td>
                    <Td className="p-3">{category?.name}</Td>
                    <Td className="p-3">{new Date(category?.createdAt).toLocaleDateString()}</Td>
                    <Td className="p-3">
                      <span
                        className={`${
                          category?.isActive === true ? 'text-green-600' : 'text-orange-600'
                        } font-semibold`}
                      >
                        {category?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Td>
                    <Td className='flex gap-2 items-center justify-center p-3'>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleActive('categories', category._id)}
                          checked={category.isActive}
                          type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                        </div>
                      </label>
                    </Td>
                  </Tr>
                )}
              )
              }
            </Tbody>
          </Table>
        </div>
      )
    }
    else if (url === 'list-tags') {
      return (
        <div className="overflow-x-auto ">
          <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
            <Thead className="bg-gray-100 uppercase text-gray-900">
              <Tr>
                <Th className="p-3 text-center">#</Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'name')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start cursor-pointer"
                  onClick={() => {
                    setValue('sortField', 'createdAt')
                    setValue('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc' )
                  }}
                >Created At {sortField === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </Th>
                <Th className="p-3 text-start">Status</Th>
                <Th className="p-3">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length > 0 && data.map((tag, i) => {
                return (
                  <Tr key={tag._id} className="border-t border-gray-200">
                    <Td className="text-center p-3">{i + 1}</Td>
                    <Td className="p-3">{tag?.name}</Td>
                    <Td className="p-3">{new Date(tag?.createdAt).toLocaleDateString()}</Td>
                    <Td className="p-3">
                      <span
                        className={`${
                          tag?.isActive === true ? 'text-green-600' : 'text-orange-600'
                        } font-semibold`}
                      >
                        {tag?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </Td>
                    <Td className='flex gap-2 items-center justify-center p-3'>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          onChange={() => toggleActive('tags', tag._id)}
                          checked={tag.isActive}
                          type="checkbox" value="" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                        </div>
                      </label>
                    </Td>
                  </Tr>
                )}
              )
              }
            </Tbody>
          </Table>
        </div>
      )
    }
  }

  if (data.length === 0) {
    return (
      <div className="dark:text-white w-full text-center font-bold uppercase">
        <p>no results found</p>
      </div>
    )
  }
}

export default TableItem