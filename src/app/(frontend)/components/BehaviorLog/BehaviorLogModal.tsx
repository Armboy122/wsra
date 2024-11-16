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
  onSuccess?: () => Promise<void>;
}

export default function BehaviorLogModal({ isOpen, onClose , onSuccess }: Props) {
  const { data: session } = useSession();

  // เรียกใช้ useBehaviors เพื่อดึงข้อมูลพฤติกรรม
  const { behaviors, loading } = useBehaviors();
  const [selectedStudent, setSelectedStudent] = useState<StudentSearchResult | null>(null);
  const [selectedBehaviors, setSelectedBehaviors] = useState<BehaviorType[]>([]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // คำนวณคะแนนที่อาจเปลี่ยนแปลง
  const calculatePreviewScore = () => {
    if (!selectedStudent || !Array.isArray(selectedBehaviors)) return 0;

    const scoreChange = selectedBehaviors.reduce((total, behavior) => {
      return total + behavior.score;
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
      await onSuccess?.();
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800">
            {!selectedStudent ? "เลือกนักเรียน" : "บันทึกพฤติกรรม"}
          </DialogTitle>
        </DialogHeader>

        {!selectedStudent ? (
          <div className="p-4 bg-orange-50 rounded-lg">
            <StudentSearch onSelect={(student) => setSelectedStudent(student)} />
          </div>
        ) : (
          <div className="flex-1">
            {/* ข้อมูลนักเรียน */}
            <div className="p-4 bg-orange-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <p className="text-sm text-gray-600">
                    เลขประจำตัว: {selectedStudent.studentNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    ห้อง: {selectedStudent.classroom.name}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600">คะแนนพฤติกรรม</div>
                <div
                  className={`text-xl font-bold ${
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
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">เลือกพฤติกรรม</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <BehaviorSelection
                  behaviors={[...behaviors.positive, ...behaviors.negative]}
                  loading={loading}
                  onSelect={handleSelectBehavior}
                />
              </div>
            </div>

            {/* แสดงพฤติกรรมที่เลือก */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">พฤติกรรมที่เลือก</h4>
              <div className="min-h-[100px] bg-gray-50 p-4 rounded-lg">
                <SelectedBehaviors
                  behaviors={selectedBehaviors}
                  onRemove={handleRemoveBehavior}
                />
              </div>
            </div>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                รายละเอียดเพิ่มเติม
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)"
              />
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                disabled={saving}
                className="w-24"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedBehaviors.length === 0 || saving}
                className="w-24 bg-orange-500 hover:bg-orange-600"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>บันทึก</span>
                  </div>
                ) : (
                  "บันทึก"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
