import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { BehaviorLogsActionType } from "@/types";
import { se } from "date-fns/locale";

export function BehaviorLogsActions({ 
  selectedIds, 
  onUpdateStatus,
  onSuccess 
}: BehaviorLogsActionType & { onSuccess?: () => void }) {
  
  const handleStatusUpdate = async (status: string) => {
    try {
      await onUpdateStatus(selectedIds,status);
      toast.success(`อัพเดตสถานะสำเร็จ ${selectedIds.length} รายการ`);
      onSuccess?.();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัพเดตสถานะ");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          เลือกการกระทำ ({selectedIds.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleStatusUpdate("approved")}>
          อนุมัติที่เลือก
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate("rejected")}>
          ปฏิเสธที่เลือก
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
