import prisma from "@/lib/prisma";
import { RequestTeacher } from "@/types";

export async function getTeacher(): Promise<RequestTeacher[]> {
  return prisma.teacher.findMany({
    select: {
      id: true,
      name: true,
      role: true
    }
  });
}
