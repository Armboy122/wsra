import { NextResponse } from 'next/server';
import { getStudentById } from '@/services/studentService';
import { getBehaviorLogsByStudent } from '@/services/behaviorService';

// ดึงข้อมูลนักเรียนและประวัติพฤติกรรมรายบุคคล
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const studentId = parseInt(params.id);

  try {
    // ดึงข้อมูลนักเรียน
    const student = await getStudentById(studentId);
    if (!student) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลนักเรียน' }, { status: 404 });
    }

    // ดึงประวัติพฤติกรรมของนักเรียน
    const behaviorLogs = await getBehaviorLogsByStudent(studentId);
    return NextResponse.json({ student, behaviorLogs });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}