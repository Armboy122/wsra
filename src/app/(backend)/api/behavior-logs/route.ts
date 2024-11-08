import { NextResponse } from 'next/server';
import { createBehaviorLog, updateMultipleBehaviorLogStatus } from '@/services/behaviorService';
import { approveAndUpdateScores} from '@/services/studentService';
import { CreateBehaviorLogInput } from '@/types';

// บันทึกพฤติกรรมใหม่
export async function POST(req: Request) {
    const body = await req.json();
    const { studentId, behaviorTypeIds, teacherId, description, imageUrl } = body;
  
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!studentId || !behaviorTypeIds?.length || !teacherId) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }
  
    try {
      // สร้าง input object ตาม interface ที่กำหนด
      const input: CreateBehaviorLogInput = {
        studentId,
        behaviorTypeIds,
        teacherId,
        description,
        imageUrl
      };

      // สร้างบันทึกพฤติกรรมใหม่
      const behaviorLog = await createBehaviorLog(input);

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

  if (!Array.isArray(ids) || ids.length === 0 || !status) {
    return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    const updatedCount = await updateMultipleBehaviorLogStatus(ids, status);

    // ถ้าสถานะเป็น approved ให้อัพเดตคะแนน
    if (status === 'approved') {
      await approveAndUpdateScores(ids);
    }

    return NextResponse.json({
      message: `อัพเดตสถานะสำเร็จ ${updatedCount} รายการ`,
      updatedCount
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตสถานะบันทึกพฤติกรรม:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}