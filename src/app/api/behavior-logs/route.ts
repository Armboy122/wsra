import { NextResponse } from 'next/server';
import { createBehaviorLog, updateMultipleBehaviorLogStatus } from '@/services/behaviorService';
import { updateStudentBehaviorScore } from '@/services/studentService';

// บันทึกพฤติกรรมใหม่
export async function POST(req: Request) {
    const body = await req.json();
    const { studentId, behaviorId, teacherId, imageUrl } = body;
  
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!studentId || !behaviorId || !teacherId) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }
  
    try {
      // สร้างบันทึกพฤติกรรมใหม่
      const behaviorLog = await createBehaviorLog(studentId, behaviorId, teacherId, imageUrl);
      // อัพเดตคะแนนพฤติกรรมของนักเรียน
      await updateStudentBehaviorScore(studentId, behaviorLog.behaviorType.score);
      return NextResponse.json(behaviorLog);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการสร้างบันทึกพฤติกรรม:', error);
      return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
    }
  }

// อัพเดตสถานะของบันทึกพฤติกรรมหลายรายการ
export async function PATCH(req: Request) {
  const body = await req.json();
  const { ids, status } = body;

  // ตรวจสอบความถูกต้องของข้อมูล
  if (!Array.isArray(ids) || !status) {
    return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    // อัพเดตสถานะของบันทึกพฤติกรรมหลายรายการ
    const updatedCount = await updateMultipleBehaviorLogStatus(ids, status);
    return NextResponse.json({ updatedCount });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตสถานะบันทึกพฤติกรรม:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}