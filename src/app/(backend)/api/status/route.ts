
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {

    // ดึงข้อมูลทั้งหมดพร้อมกัน
    const [statusCounts, topBehaviors] = await Promise.all([
      // สถานะทั้งหมด
      prisma.behaviorLog.groupBy({
        by: ['status'],
        _count: true
      }),



      // พฤติกรรมที่พบมากที่สุด
      prisma.behaviorType.findMany({
        select: {
          name: true,
          category: true,
          score: true,
          behaviorLogs: {
            where: {
              behaviorLog: {
                status: 'approved'
              }
            }
          },
          _count: {
            select: {
              behaviorLogs: {
                where: {
                  behaviorLog: {
                    status: 'approved'
                  }
                }
              }
            }
          }
        },
        orderBy: {
          behaviorLogs: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ])

    // จัดรูปแบบสถานะรวม
    const totalStats = {
      total: statusCounts.reduce((acc, curr) => acc + curr._count, 0),
      pending: statusCounts.find(s => s.status === 'pending')?._count || 0,
      approved: statusCounts.find(s => s.status === 'approved')?._count || 0,
      rejected: statusCounts.find(s => s.status === 'rejected')?._count || 0
    }



    // จัดรูปแบบพฤติกรรมที่พบมากที่สุด
    const formattedTopBehaviors = topBehaviors.map(behavior => ({
      name: behavior.name,
      category: behavior.category,
      score: behavior.score,
      count: behavior._count.behaviorLogs
    }))

    return NextResponse.json({
      overview: totalStats,
      topBehaviors: formattedTopBehaviors
    })
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}