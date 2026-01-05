import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPostsAPI } from '~/apis'
import LoadingSpinner from './LoadingSpinner'

const Blogs = () => {

  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState([])
  const postsPerPage = 6
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost)

  useEffect( () => {
    const fetchPosts = async () => {
      const res = await getPostsAPI()
      setPosts(res.posts)
    }
    fetchPosts()
  }, [])


  return (
    <div className=" w-full mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Danh sách bài viết
      </h1>

      <section className={ currentPosts.length > 0 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'h-40' }>
        {currentPosts.length > 0 ? currentPosts.map((post) => (
          <Link key={post._id} to={`/blog-detail/${post._id}`}>
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <img
                    src={post.author.avatar}
                    alt={''}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span>{post.author.username}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue">
                  {post.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-indigo-100 text-blue dark:bg-blue dark:text-indigo-200 rounded-full">
                    {post.category.name}
                  </span>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mt-2">
                  ❤️ <span>{post.likesCount}</span>
                </div>
              </div>
            </div>
          </Link>

        )) : <LoadingSpinner/>}
      </section>

      <section className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
            Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-lg transition ${
              currentPage === i + 1
                ? 'bg-blue text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
            Next
        </button>
      </section>
    </div>
  )
}

export default Blogs
