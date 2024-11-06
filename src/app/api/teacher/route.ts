import { NextResponse } from 'next/server';
import { getTeacher } from '@/services/teacherService';

// ดึงข้อมูลประเภทพฤติกรรม
export async function GET() {

  try {
    // ดึงข้อมูลประเภทพฤติกรรมตามหมวดหมู่ (ถ้าระบุ)
    const teachers = await getTeacher();
    return NextResponse.json(teachers);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลประเภทพฤติกรรม:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}