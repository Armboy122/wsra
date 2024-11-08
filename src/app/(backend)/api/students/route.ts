import { NextResponse } from 'next/server';
import { getStudentsByClassroom, updateClassroomBehaviorScores } from '@/services/studentService';

// ดึงข้อมูลนักเรียนตามห้องเรียน
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classroomId = searchParams.get('classroomId');

  // ตรวจสอบว่ามีการระบุ classroomId หรือไม่
  if (!classroomId) {
    return NextResponse.json({ error: 'ต้องระบุรหัสห้องเรียน' }, { status: 400 });
  }

  try {
    // ดึงข้อมูลนักเรียนจากฐานข้อมูล
    const students = await getStudentsByClassroom(parseInt(classroomId));
    return NextResponse.json(students);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลนักเรียน:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// อัพเดตคะแนนพฤติกรรมของทั้งห้องเรียน
export async function PATCH(req: Request) {
  const body = await req.json();
  const { classroomId, scoreChange } = body;

  // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
  if (!classroomId || typeof scoreChange !== 'number') {
    return NextResponse.json({ error: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
  }

  try {
    // อัพเดตคะแนนพฤติกรรมของนักเรียนทั้งห้อง
    await updateClassroomBehaviorScores(classroomId, scoreChange);
    return NextResponse.json({ message: 'อัพเดตคะแนนพฤติกรรมสำเร็จ' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพเดตคะแนนพฤติกรรม:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' }, { status: 500 });
  }
}