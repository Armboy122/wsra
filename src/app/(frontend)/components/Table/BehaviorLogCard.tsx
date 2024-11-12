import { BehaviorLogTable } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface BehaviorLogCardProps {
  log: BehaviorLogTable;
  selected: boolean;
  onToggleSelection: (id: number) => void;
  isAdmin: boolean;
}

export function BehaviorLogCard({
  log,
  selected,
  onToggleSelection,
  isAdmin,
}: BehaviorLogCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        {isAdmin && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelection(log.id)}
          />
        )}
        <div className="flex-1 ml-3">
          <h3 className="font-medium">
            {log.student.firstName} {log.student.lastName}
          </h3>
          <p className="text-sm text-gray-500">{log.student.studentNumber}</p>
        </div>
        <Badge className={getStatusColor(log.status)}>
          {log.status === "approved"
            ? "อนุมัติแล้ว"
            : log.status === "rejected"
            ? "ปฏิเสธ"
            : "รออนุมัติ"}
        </Badge>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-500">ครูผู้บันทึก:</span>
          <span className="ml-2">{log.teacher.name}</span>
        </div>

        <div>
          <span className="text-sm text-gray-500">ประเภทพฤติกรรม:</span>
          <div className="mt-1 space-x-1">
            {log.behaviorTypes.map((bt) => (
              <Badge
                key={bt.behaviorType.id}
                variant={
                  bt.behaviorType.category === "positive"
                    ? "success"
                    : "destructive"
                }
              >
                {bt.behaviorType.name} ({bt.behaviorType.score})
              </Badge>
            ))}
          </div>
        </div>

        {log.description && (
          <div>
            <span className="text-sm text-gray-500">รายละเอียด:</span>
            <p className="mt-1">{log.description}</p>
          </div>
        )}

        {/* <div>
          <span className="text-sm text-gray-500">วันที่:</span>
          <span className="ml-2">
            {format(new Date(log.createdAt), "d MMM yyyy HH:mm", {
              locale: th,
            })}
          </span>
        </div> */}
      </div>
    </div>
  );
}