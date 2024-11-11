import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BehaviorSelection } from "./BehaviorSelection";
import { SelectedBehaviors } from "./SelectedBehaviors";
import { StudentSearch } from "./StudentSearch";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useBehaviors } from "@/hooks/useBehaviorLog";

interface StudentSearchResult {
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

interface BehaviorType {
  id: number;
  name: string;
  category: "positive" | "negative";
  score: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BehaviorLogModal({ isOpen, onClose }: Props) {
  const { data: session } = useSession();

  // เรียกใช้ useBehaviors เพื่อดึงข้อมูลพฤติกรรม
  const { behaviors, loading, error, refetch } = useBehaviors();
  const [selectedStudent, setSelectedStudent] =
    useState<StudentSearchResult | null>(null);
  const [selectedBehaviors, setSelectedBehaviors] = useState<BehaviorType[]>(
    []
  );
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // คำนวณคะแนนที่อาจเปลี่ยนแปลง
  const calculatePreviewScore = () => {
    if (!selectedStudent || !Array.isArray(selectedBehaviors)) return 0;

    const scoreChange = selectedBehaviors.reduce((total, behavior) => {
      return (
        total +behavior.score
      );
    }, 0);

    return selectedStudent.behaviorScore + scoreChange;
  };

  // บันทึกข้อมูล
  const handleSubmit = async () => {
    if (!selectedStudent || selectedBehaviors.length === 0) return;

    if (!session || !session.user?.id) {
      toast.error("ไม่พบข้อมูลผู้ใช้งาน");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/behavior-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          behaviorTypeIds: selectedBehaviors.map((b) => b.id),
          teacherId: parseInt(session.user.id),
          description,
        }),
      });

      if (!response.ok) throw new Error("บันทึกข้อมูลไม่สำเร็จ");

      toast.success("บันทึกข้อมูลสำเร็จ");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  // ฟังก์ชันเลือกและลบพฤติกรรม
  const handleSelectBehavior = (behavior: BehaviorType) => {
    if (!selectedBehaviors.some((b) => b.id === behavior.id)) {
      setSelectedBehaviors([...selectedBehaviors, behavior]);
    }
  };

  const handleRemoveBehavior = (behaviorId: number) => {
    setSelectedBehaviors(selectedBehaviors.filter((b) => b.id !== behaviorId));
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setSelectedStudent(null);
    setSelectedBehaviors([]);
    setDescription("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        resetForm();
        onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {!selectedStudent ? "เลือกนักเรียน" : "บันทึกพฤติกรรม"}
          </DialogTitle>
        </DialogHeader>

        {!selectedStudent ? (
          <StudentSearch onSelect={(student) => setSelectedStudent(student)} />
        ) : (
          <div className="space-y-4">
            {/* ข้อมูลนักเรียน */}
            <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  เลขประจำตัว: {selectedStudent.studentNumber} | ห้อง:{" "}
                  {selectedStudent.classroom.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">คะแนนพฤติกรรม</div>
                <div
                  className={`font-bold ${
                    calculatePreviewScore() >= 80
                      ? "text-green-600"
                      : calculatePreviewScore() >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {calculatePreviewScore()}
                </div>
              </div>
            </div>

            {/* เลือกพฤติกรรม */}
            <BehaviorSelection
              behaviors={[...behaviors.positive, ...behaviors.negative]}
              loading={loading}
              onSelect={handleSelectBehavior}
            />

            {/* แสดงพฤติกรรมที่เลือก */}
            <SelectedBehaviors
              behaviors={selectedBehaviors}
              onRemove={handleRemoveBehavior}
            />

            {/* รายละเอียดเพิ่มเติม */}
            <div>
              <label className="block text-sm font-medium mb-1">
                รายละเอียดเพิ่มเติม
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
              />
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={saving}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedBehaviors.length === 0 || saving}
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
