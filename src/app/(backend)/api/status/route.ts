import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [statusCounts, topBehaviors] = await Promise.all([
      prisma.behaviorLog.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.behaviorType.findMany({
        select: {
          name: true,
          category: true,
          score: true,
          _count: { select: { behaviorLogs: true } },
        },
        orderBy: { behaviorLogs: { _count: 'desc' } },
        take: 5,
      }),
    ]);

    console.log('API Called: statusCounts', statusCounts);
    console.log('API Called: topBehaviors', topBehaviors);

    return NextResponse.json(
      {
        overview: {
          total: statusCounts.reduce((acc, curr) => acc + curr._count, 0),
          pending: statusCounts.find((s) => s.status === 'pending')?._count || 0,
          approved: statusCounts.find((s) => s.status === 'approved')?._count || 0,
          rejected: statusCounts.find((s) => s.status === 'rejected')?._count || 0,
        },
        topBehaviors: topBehaviors.map((b) => ({
          name: b.name,
          category: b.category,
          score: b.score,
          count: b._count.behaviorLogs,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

