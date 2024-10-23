import prisma from '@/lib/prisma'
import { BehaviorType, BehaviorLog, BehaviorLogWithDetails, CreateBehaviorLogInput } from '@/types'
// import { APPROVAL_STATUS } from '@/lib/constants'

// ดึงรายการประเภทพฤติกรรม
export async function getBehaviorTypes(category?: string): Promise<BehaviorType[]> {
 return prisma.behaviorType.findMany({
   where: category ? { category } : undefined,
 })
}

// สร้างบันทึกพฤติกรรมใหม่
export async function createBehaviorLog({
  studentId,
  behaviorTypeIds,
  teacherId,
  description,
  imageUrl
}: CreateBehaviorLogInput): Promise<BehaviorLogWithDetails> {
  return prisma.behaviorLog.create({
    data: {
      studentId,
      teacherId,
      description,  // เพิ่มบรรทัดนี้
      imageUrl,
      behaviorTypes: {
        create: behaviorTypeIds.map(id => ({
          behaviorType: {
            connect: { id }
          }
        }))
      }
    },
    include: {
      behaviorTypes: {
        include: {
          behaviorType: true
        }
      },
      student: true,
      teacher: true
    }
  })
}

// ดึงประวัติพฤติกรรมของนักเรียน
export async function getBehaviorLogsByStudent(studentId: number): Promise<BehaviorLogWithDetails[]> {
 return prisma.behaviorLog.findMany({
   where: { studentId },
   include: {
     behaviorTypes: {
       include: {
         behaviorType: true
       }
     },
     student: true, 
     teacher: true
   },
 })
}

// อัพเดทสถานะบันทึกพฤติกรรมเดี่ยว
export async function updateBehaviorLogStatus(id: number, status: string): Promise<BehaviorLog> {
 return prisma.behaviorLog.update({
   where: { id },
   data: { status },
 })
}

// อัพเดทสถานะบันทึกพฤติกรรมหลายรายการ
export async function updateMultipleBehaviorLogStatus(ids: number[], status: string): Promise<number> {
 const result = await prisma.behaviorLog.updateMany({
   where: { id: { in: ids } },
   data: { status },
 })
 return result.count
}