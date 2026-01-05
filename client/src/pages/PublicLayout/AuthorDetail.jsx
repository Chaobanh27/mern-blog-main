import { useState } from 'react'

const AuthorDetail = () => {
  const [sortOrder, setSortOrder] = useState('newest')

  const author = {
    name: 'Nguyen Chanh Bao',
    avatar: 'https://i.pravatar.cc/100?img=5',
    bio: 'Fullstack Developer, passionate about ReactJS and Tailwind CSS.'
  }

  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Bài viết ${i + 1}`,
    thumbnail: `https://source.unsplash.com/random/600x400/?coding&sig=${i + 1}`,
    category: 'Web Development',
    tags: ['React', 'UI'],
    date: `2025-09-${i + 1}`,
    likes: Math.floor(Math.random() * 200)
  }))

  return (
    <div className="space-y-8 py-30">
      {/* Author Info */}
      <section className="flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold ">{author.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{author.bio}</p>
        </div>
      </section>

      {/* Sort / Filter */}
      <section className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-2 sm:mb-0">
            Sort posts by:
        </p>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
          <option value="likesAsc">Likes: Low → High</option>
          <option value="likesDesc">Likes: High → Low</option>
        </select>
      </section>

      {/* Author Posts Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold  hover:text-indigo-500">
                {post.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-700 dark:text-indigo-200 rounded-full">
                  {post.category}
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-full"
                  >
                      #{tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-gray-500 dark:text-gray-300 text-sm mt-2">
                <time dateTime={post.date}>{post.date}</time>
                <span>❤️ {post.likes}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="flex justify-center items-center gap-2 mt-8 flex-wrap">
        <button className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Prev
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Next
        </button>
      </section>
    </div>
  )
}

export default AuthorDetail
