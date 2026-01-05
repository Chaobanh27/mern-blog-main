import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const NotificationBell = ({ notifications, unreadCount, onMarkAllRead }) => {
  const [open, setOpen] = useState(false)
  const bellRef = useRef(null)

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={bellRef}>
      {/* CHUÔNG */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bell className="h-7 w-7 text-gray-700 dark:text-gray-200" />

        {unreadCount > 0 && (
          <span className="
            absolute -top-1 -right-1 bg-red-600 text-white text-xs
            w-5 h-5 flex items-center justify-center rounded-full
            font-semibold shadow
          ">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN THÔNG BÁO */}
      {open && (
        <div className="
          absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800
          shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 z-50
        ">
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Thông báo
            </h3>

            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-blue-600 text-sm hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                Không có thông báo
              </p>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  className={`
                    flex items-start gap-3 px-4 py-3 cursor-pointer
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    ${!n.isRead ? 'bg-blue-50 dark:bg-gray-700/50' : ''}
                  `}
                >
                  <img
                    src={n.senderId?.avatar}
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />

                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{n.senderId?.username}</span>{' '}
                      { n.type === 'like_comment'
                        ? 'đã thích bình luận của bạn'
                        : n.type === 'reply_comment'
                          ? 'đã trả lời bình luận của bạn'
                          : n.type === 'comment_post'
                            ? 'đã bình luận bài viết của bạn'
                            : 'đã thích bài viết của bạn'}
                    </p>

                    <span className="text-xs text-gray-500">
                      {new Date(n?.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
