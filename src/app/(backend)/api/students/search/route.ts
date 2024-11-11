// app/api/students/search/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'กรุณาระบุคำค้นหา' }, { status: 400 });
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { studentNumber: { contains: query, mode: 'insensitive' }},
          { firstName: { contains: query, mode: 'insensitive' }},
          { lastName: { contains: query, mode: 'insensitive' }}
        ]
      },
      include: {
        classroom: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหา' }, 
      { status: 500 }
    );
  }
}