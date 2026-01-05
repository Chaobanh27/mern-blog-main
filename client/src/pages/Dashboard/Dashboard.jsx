import StatsCard from '~/components/Dashboard/StatsCard'
import { Users, FileText, MessageSquare, Heart } from 'lucide-react'
import LineChartFrame from '~/components/Dashboard/LineChartFrame'
import BarChartFrame from '~/components/Dashboard/BarChartFrame'
import PieChartFrame from '~/components/Dashboard/PieChartFrame'
import { useEffect, useState } from 'react'
import { getDashboardOverviewAPI } from '~/apis'

const Dashboard = () => {
  const [data, setData] = useState({})

  useEffect(() => {
    const fecthData = async () => {
      await getDashboardOverviewAPI()
        .then(res => setData(res))
    }

    fecthData()
  }, [])

  console.log(data);


  return (
    <div className="p-4 h-screen">
      <section className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        <StatsCard
          label="Tổng User"
          value={data?.summary?.totalUsers}
          icon={Users}
          trend={12}
        />
        <StatsCard
          label="Tổng Bài viết"
          value={data?.summary?.totalPosts}
          icon={FileText}
          trend={5}
        />

        <StatsCard
          label="Tổng Comment"
          value={data?.summary?.totalComments}
          icon={MessageSquare}
          trend={-3}
        />

        <StatsCard
          label="Tổng Lượt Like"
          value={data?.summary?.totalLikes}
          icon={Heart}
          trend={18}
        />
      </section>

      <section className='mt-4 grid md:grid-cols-2 sm:grid-cols-1 gap-4'>
        {
          Object.keys(data).length > 0 && <>
            <LineChartFrame data={data?.charts?.postsLast7Days}/>
            <BarChartFrame data={data?.charts?.usersLast7Days}/>
            <PieChartFrame data={data?.top?.topTags}/>
          </>

        }

      </section>

    </div>
  )
}

export default Dashboard