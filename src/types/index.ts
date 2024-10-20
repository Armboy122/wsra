import { Teacher, Classroom, Student, BehaviorType, BehaviorLog } from '@prisma/client';

export type { Teacher, Classroom, Student, BehaviorType, BehaviorLog };

export type BehaviorCategory = 'positive' | 'negative';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface StudentWithClassroom extends Student {
  classroom: Classroom;
}

export interface BehaviorLogWithDetails extends BehaviorLog {
  student: Student;
  behaviorType: BehaviorType;
  teacher: Teacher;
}