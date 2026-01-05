export const dashboardMockData = {
  summary: {
    totalUsers: 12840,
    totalPosts: 1329,
    totalComments: 4891,
    totalLikes: 22460,
    totalBookmarks: 850,
    newUsersToday: 45,
    newPostsToday: 12
  },

  charts: {
    postsLast7Days: [
      { _id: '2025-12-01', count: 5 },
      { _id: '2025-12-02', count: 12 },
      { _id: '2025-12-03', count: 8 },
      { _id: '2025-12-04', count: 16 },
      { _id: '2025-12-05', count: 10 },
      { _id: '2025-12-06', count: 13 },
      { _id: '2025-12-07', count: 7 }
    ],

    usersLast7Days: [
      { _id: '2025-12-01', count: 9 },
      { _id: '2025-12-02', count: 4 },
      { _id: '2025-12-03', count: 7 },
      { _id: '2025-12-04', count: 12 },
      { _id: '2025-12-05', count: 6 },
      { _id: '2025-12-06', count: 14 },
      { _id: '2025-12-07', count: 5 }
    ]
  },

  top: {
    topPostsByLikes: [
      {
        _id: 'p1',
        title: 'React 19: Những thay đổi lớn trong năm 2025',
        likesCount: 340,
        views: 12400,
        createdAt: '2025-11-21',
        author: {
          _id: 'u1',
          fullName: 'Nguyễn Văn A'
        }
      },
      {
        _id: 'p2',
        title: 'Học Node.js từ cơ bản đến nâng cao',
        likesCount: 280,
        views: 8800,
        createdAt: '2025-10-02',
        author: {
          _id: 'u2',
          fullName: 'Trần Thị B'
        }
      },
      {
        _id: 'p3',
        title: 'MongoDB Aggregation Pipeline chi tiết',
        likesCount: 240,
        views: 6500,
        createdAt: '2025-09-11',
        author: {
          _id: 'u3',
          fullName: 'Lê Văn C'
        }
      }
    ],

    topTags: [
      { tagId: 't1', name: 'ReactJS', postCount: 42 },
      { tagId: 't2', name: 'NodeJS', postCount: 30 },
      { tagId: 't3', name: 'MongoDB', postCount: 18 },
      { tagId: 't4', name: 'JavaScript', postCount: 34 },
      { tagId: 't5', name: 'TailwindCSS', postCount: 22 }
    ]
  }
}

export const mockNotificationsPopulated = [
  {
    _id: 'n1',
    type: 'reply_comment',
    isRead: false,
    postId: 'p101',
    commentId: 'c555',
    createdAt: '2025-02-01T08:00:00Z',

    sender: {
      _id: 'u999',
      fullName: 'Nguyễn Văn A',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },

    message: 'đã trả lời bình luận của bạn'
  },

  {
    _id: 'n2',
    type: 'like_comment',
    isRead: false,
    postId: 'p101',
    commentId: 'c555',
    createdAt: '2025-02-02T12:00:00Z',

    sender: {
      _id: 'u888',
      fullName: 'Trần Thị B',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },

    message: 'đã thích bình luận của bạn'
  },

  {
    _id: 'n3',
    type: 'like_post',
    isRead: true,
    postId: 'p101',
    createdAt: '2025-02-03T09:30:00Z',

    sender: {
      _id: 'u777',
      fullName: 'Lê Quốc C',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },

    message: 'đã thích bài viết của bạn'
  },

  {
    _id: 'n4',
    type: 'reply_comment',
    isRead: true,
    postId: 'p102',
    commentId: 'c777',
    createdAt: '2025-02-05T14:20:00Z',

    sender: {
      _id: 'u555',
      fullName: 'Phạm Duy D',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },

    message: 'đã trả lời bình luận của bạn'
  }
]

export const mockUnreadCount = mockNotificationsPopulated.filter(n => !n.isRead).length;
// Kết quả: 2

