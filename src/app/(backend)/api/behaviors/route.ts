import { NextResponse } from 'next/server';
import { getBehaviorTypes } from '@/services/behaviorService';

// ดึงข้อมูลประเภทพฤติกรรม
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  try {
    // ดึงข้อมูลประเภทพฤติกรรมตามหมวดหมู่ (ถ้าระบุ)
    const behaviors = await getBehaviorTypes(category || undefined);
    return NextResponse.json(behaviors);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลประเภทพฤติกรรม:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}