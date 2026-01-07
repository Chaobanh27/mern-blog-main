import { useEffect, useState } from 'react'
import { getPostsAPI } from '~/apis'
import LoadingSpinner from './LoadingSpinner'
import PostPreview from './PostPreview'

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
          <div key={post._id}>
            <PostPreview post={post}/>
          </div>
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
