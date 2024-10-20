import prisma from '@/lib/prisma'
import { BehaviorType, BehaviorLog, BehaviorLogWithDetails } from '@/types'
// import { APPROVAL_STATUS } from '@/lib/constants'

export async function getBehaviorTypes(category?: string): Promise<BehaviorType[]> {
  return prisma.behaviorType.findMany({
    where: category ? { category } : undefined,
  })
}

export async function createBehaviorLog(
    studentId: number,
    behaviorId: number,
    teacherId: number,
    imageUrl?: string
  ): Promise<BehaviorLogWithDetails> {
    return prisma.behaviorLog.create({
      data: { studentId, behaviorId, teacherId, imageUrl },
      include: { 
        behaviorType: true,
        student: true,
        teacher: true
      }
    })
  }

export async function getBehaviorLogsByStudent(studentId: number): Promise<BehaviorLogWithDetails[]> {
  return prisma.behaviorLog.findMany({
    where: { studentId },
    include: { student: true, behaviorType: true, teacher: true },
  })
}

export async function updateBehaviorLogStatus(id: number, status: string): Promise<BehaviorLog> {
  return prisma.behaviorLog.update({
    where: { id },
    data: { status },
  })
}

export async function updateMultipleBehaviorLogStatus(ids: number[], status: string): Promise<number> {
  const result = await prisma.behaviorLog.updateMany({
    where: { id: { in: ids } },
    data: { status },
  })
  return result.count
}

