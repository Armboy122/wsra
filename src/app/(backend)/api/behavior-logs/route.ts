import { NextResponse } from "next/server";
import {
  createBehaviorLog,
  getBehavior_logs,
  updateMultipleBehaviorLogStatus,
} from "@/services/behaviorService";
import { approveAndUpdateScores } from "@/services/studentService";
import { CreateBehaviorLogInput } from "@/types";

// บันทึกพฤติกรรมใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, behaviorTypeIds, teacherId, description, imageUrl } =
      body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!studentId || !behaviorTypeIds?.length || !teacherId) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const input: CreateBehaviorLogInput = {
      studentId,
      behaviorTypeIds,
      teacherId,
      description,
      imageUrl,
    };

    const behaviorLog = await createBehaviorLog(input);

    return NextResponse.json(behaviorLog);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการบันทึกพฤติกรรม:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

// อัพเดตสถานะของบันทึกพฤติกรรมหลายรายการ
export async function PATCH(req: Request) {
  const body = await req.json();
  const { ids, status } = body;

  if (!Array.isArray(ids) || ids.length === 0 || !status) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  try {
    const updatedCount = await updateMultipleBehaviorLogStatus(ids, status);

    // ถ้าสถานะเป็น approved ให้อัพเดตคะแนน
    if (status === "approved") {
      await approveAndUpdateScores(ids);
    }

    return NextResponse.json({
      message: `อัพเดตสถานะสำเร็จ ${updatedCount} รายการ`,
      updatedCount,
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัพเดตสถานะบันทึกพฤติกรรม:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const behaviors_logs = await getBehavior_logs();

    return NextResponse.json(behaviors_logs);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทพฤติกรรม:", error);
    return NextResponse.json([], { status: 500 }); // ส่ง empty array แทน error object
  }
}
