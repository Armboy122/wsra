import prisma from '@/lib/prisma'
import { StudentWithClassroom } from '@/types'

export async function getStudentsByClassroom(classroomId: number): Promise<StudentWithClassroom[]> {
  return prisma.student.findMany({
    where: { classroomId },
    include: { classroom: true },
  })
}

export async function getStudentById(id: number): Promise<StudentWithClassroom | null> {
  return prisma.student.findUnique({
    where: { id },
    include: { classroom: true },
  })
}

export async function updateStudentBehaviorScore(studentId: number, scoreChange: number): Promise<void> {
  await prisma.student.update({
    where: { id: studentId },
    data: { behaviorScore: { increment: scoreChange } },
  })
}

export async function updateClassroomBehaviorScores(classroomId: number, scoreChange: number): Promise<void> {
  await prisma.student.updateMany({
    where: { classroomId },
    data: { behaviorScore: { increment: scoreChange } },
  })
}