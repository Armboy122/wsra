import prisma from "@/lib/prisma";
import {
  BehaviorLogWithDetails,
  CreateBehaviorLogInput,
} from "@/types";


export async function getBehaviorTypes(category: string) {
  try {
    const behaviors = await prisma.behaviorType.findMany({
      where: {
        category: category,
      },
      select: {
        id: true,
        name: true,
        category: true,
        score: true,
      },
      orderBy: {
        score: "desc",
      },
    });

    return behaviors;
  } catch (error) {
    console.error("Error in getBehaviorTypes:", error);
    return [];
  }
}


interface GetBehaviorLogsParams {
  page: number;
  limit: number;
  status: string;
  sortOrder: 'asc' | 'desc';
}
export async function getBehavior_logs({ 
  page, 
  limit, 
  status, 
  sortOrder 
}: GetBehaviorLogsParams) {
  try {
    const where = status !== 'all' ? { status } : {};

    const [behaviors, total] = await Promise.all([
      prisma.behaviorLog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where,
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              studentNumber: true,
              classroom: {
                select: {
                  name: true
                }
              }
            }
          },
          teacher: {
            select: {
              id: true,
              name: true
            }
          },
          behaviorTypes: {
            include: {
              behaviorType: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  score: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: sortOrder
        }
      }),
      prisma.behaviorLog.count({ where })
    ]);

    return { behaviors, total };
    
  } catch (error) {
    console.error("Error in getBehaviorLogs:", error);
    throw error; // ส่ง error ไปให้ API route จัดการ
  }
}

// สร้างบันทึกพฤติกรรมใหม่
export async function createBehaviorLog({
  studentId,
  behaviorTypeIds,
  teacherId,
  description,
  imageUrl,
}: CreateBehaviorLogInput): Promise<BehaviorLogWithDetails> {
  return prisma.behaviorLog.create({
    data: {
      studentId,
      teacherId,
      description,
      imageUrl,
      status: "pending", // กำหนดค่าเริ่มต้น
      behaviorTypes: {
        create: behaviorTypeIds.map((id) => ({
          behaviorType: {
            connect: { id },
          },
        })),
      },
    },
    include: {
      behaviorTypes: {
        include: {
          behaviorType: {
            select: {
              id: true,
              name: true,
              category: true,
              score: true,
            },
          },
        },
      },
      student: {
        include: {
          classroom: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

// ดึงประวัติพฤติกรรมของนักเรียน

export async function getBehaviorLogsByStudent(
  studentId: number
): Promise<BehaviorLogWithDetails[]> {
  return prisma.behaviorLog.findMany({
    where: { studentId },
    include: {
      behaviorTypes: {
        include: {
          behaviorType: {
            select: {
              id: true,
              name: true,
              category: true,
              score: true,
            },
          },
        },
      },
      student: {
        include: {
          classroom: true,
        },
      },
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// อัพเดทสถานะบันทึกพฤติกรรมเดี่ยว
// export async function updateBehaviorLogStatus(
//   id: number,
//   status: string
// ): Promise<BehaviorLog> {
//   return prisma.behaviorLog.update({
//     where: { id },
//     data: { status },
//   });
// }

// อัพเดทสถานะบันทึกพฤติกรรมหลายรายการ
export async function updateMultipleBehaviorLogStatus(
  ids: number[],
  status: string
): Promise<number> {
  const result = await prisma.behaviorLog.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  return result.count;
}
