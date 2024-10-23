import { Teacher, Classroom, Student, BehaviorType, BehaviorLog, BehaviorLogBehavior } from '@prisma/client';

export type { Teacher, Classroom, Student, BehaviorType, BehaviorLog, BehaviorLogBehavior };

export type BehaviorCategory = 'positive' | 'negative';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface StudentWithClassroom extends Student {
 classroom: Classroom;
}

export interface BehaviorLogWithDetails extends BehaviorLog {
 student: Student;
 teacher: Teacher;
 behaviorTypes: (BehaviorLogBehavior & {
   behaviorType: BehaviorType;
 })[];
}

// เพิ่ม interface สำหรับการสร้าง BehaviorLog ใหม่ (optional)
export interface CreateBehaviorLogInput {
 studentId: number;
 behaviorTypeIds: number[];
 teacherId: number;
 description?: string;
 imageUrl?: string;
}