import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const PostPreview = ({ key, post }) => {
  return (
    <Link key={key} to={`/blog-detail/${post._id}`}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
      >
        <img
          src={post?.coverImage}
          alt={post?.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <img
              src={post?.author?.avatar}
              alt={''}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span>{post?.author?.username}</span>
            <span>•</span>
            <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue">
            {post?.title}
          </h2>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 text-xs bg-indigo-100 text-blue dark:bg-blue dark:text-indigo-200 rounded-full">
              {post?.category?.name}
            </span>
            {post?.tags.map(t => (
              <span
                key={t._id}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-full"
              >
                      #{t.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mt-2">
            <Heart className='fill-red-600'/> <span>{post?.likesCount}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostPreview