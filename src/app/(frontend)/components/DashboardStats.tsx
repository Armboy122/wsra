'use client'
import { useEffect, useState } from 'react'

interface DashboardData {
  overview: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  dailyStats: {
    date: string
    pending: number
    approved: number
    rejected: number
  }[]
  topBehaviors: {
    name: string
    category: string
    score: number
    count: number
  }[]
}

export default function DashboardStats({ triggerRefetch }: { triggerRefetch: boolean }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/status', {
        method: 'GET',
        cache: 'no-store', // บังคับปิด Cache
      }); // ปิด cache เพื่อดึงข้อมูลใหม่เสมอ
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [triggerRefetch]) // เรียก fetchData ใหม่เมื่อ triggerRefetch เปลี่ยน

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>No data available</div>
  }

  return (
    <div className="space-y-6">
      {/* สถานะรวม */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">สถานะทั้งหมด</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-gray-600">ทั้งหมด</div>
            <div className="text-2xl font-bold text-gray-800">
              {data.overview.total}
            </div>
          </div>
          <div className="text-center">
            <div className="text-yellow-600">รออนุมัติ</div>
            <div className="text-2xl font-bold text-yellow-500">
              {data.overview.pending}
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-600">อนุมัติ</div>
            <div className="text-2xl font-bold text-green-500">
              {data.overview.approved}
            </div>
          </div>
          <div className="text-center">
            <div className="text-red-600">ไม่อนุมัติ</div>
            <div className="text-2xl font-bold text-red-500">
              {data.overview.rejected}
            </div>
          </div>
        </div>
      </div>

      {/* พฤติกรรมที่พบมากที่สุด */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">พฤติกรรมที่พบมากที่สุด</h2>
        <div className="space-y-2">
          {data.topBehaviors.map((behavior, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-2 hover:bg-gray-50"
            >
              <div>
                <span className={`
                  inline-block w-3 h-3 rounded-full mr-2
                  ${behavior.category === 'positive' ? 'bg-green-500' : 'bg-red-500'}
                `}></span>
                {behavior.name}
              </div>
              <div className="font-semibold">{behavior.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
