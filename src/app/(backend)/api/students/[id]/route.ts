import { NextResponse } from 'next/server';
import { getStudentById } from '@/services/studentService';
import { getBehaviorLogsByStudent } from '@/services/behaviorService';

// ดึงข้อมูลนักเรียนและประวัติพฤติกรรมรายบุคคล
export async function GET(
  req: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const studentId = parseInt(params.id);

    const [student, behaviorLogs] = await Promise.all([
      getStudentById(studentId),
      getBehaviorLogsByStudent(studentId)
    ]);

    if (!student) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลนักเรียน' }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ student, behaviorLogs });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, 
      { status: 500 }
    );
  }
}