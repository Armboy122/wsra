import {
  Teacher,
  Classroom,
  Student,
  BehaviorLog,
  BehaviorLogBehavior,
} from "@prisma/client";

export type {
  Teacher,
  Classroom,
  Student,
  BehaviorLog,
  BehaviorLogBehavior,
};

export type BehaviorCategory = "positive" | "negative";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface StudentWithClassroom {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  behaviorScore: number;
  classroom: {
    id: number;
    name: string;
    department?: string;
  };
}

export interface BehaviorType {
  id: number;
  name: string;
  category: string;
  score: number;
}

export interface BehaviorLogWithDetails {
  id: number;
  studentId: number;
  teacherId: number;
  description?: string;
  imageUrl?: string;
  status: string;
  createdAt: Date;
  behaviorTypes: {
    behaviorType: BehaviorType;
  }[];
  student: StudentWithClassroom;
  teacher: {
    id: number;
    name: string;
  };
}

// เพิ่ม interface สำหรับการสร้าง BehaviorLog ใหม่ (optional)
export interface CreateBehaviorLogInput {
  studentId: number;
  behaviorTypeIds: number[];
  teacherId: number;
  description?: string;
  imageUrl?: string;
}
// เพิ่ม interface สำหรับการสร้าง BehaviorLog ใหม่ (optional)
export interface RequestTeacher {
  id: number;
  name: string;
  role: string;
}

export interface StudentSearchResult {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  behaviorScore: number;
  classroom: {
    name: string;
  };
}