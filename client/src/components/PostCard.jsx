

const PostCard = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition p-4 border border-gray-200 dark:border-gray-700">
      <div className="w-full h-40 rounded-lg overflow-hidden">
        <img
          src={post?.coverImage}
          alt="post cover image"
          className="w-full h-full object-cover"
        />
      </div>

      <span className="text-sm mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
        {post?.category?.name}
      </span>

      <h3 className="text-lg font-semibold mt-2 line-clamp-2 dark:text-white">
        {post?.title}
      </h3>

      {/* Description */}
      {/* <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
        {post.description}
      </p> */}

      <div className="flex items-center gap-3 mt-4">
        <img
          src={post?.author?.avatar}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium dark:text-white">{post?.author?.username}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export default PostCard
