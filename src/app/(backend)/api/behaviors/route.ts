import { NextResponse } from 'next/server';
import { getBehaviorTypes } from '@/services/behaviorService';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    

    // ต้องมี category
    if (!category) {
      return NextResponse.json({ error: 'ต้องระบุประเภทพฤติกรรม' }, { status: 400 });
    }

    // ตรวจสอบว่า category ถูกต้อง
    if (category !== 'positive' && category !== 'negative') {
      return NextResponse.json({ error: 'ประเภทพฤติกรรมไม่ถูกต้อง' }, { status: 400 });
    }

    const behaviors = await getBehaviorTypes(category);
    
    // ถ้าไม่พบข้อมูลให้ส่ง empty array
    if (!behaviors || behaviors.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(behaviors);
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลประเภทพฤติกรรม:', error);
    return NextResponse.json([], { status: 500 }); // ส่ง empty array แทน error object
  }
}