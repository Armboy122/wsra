import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BehaviorLogsFiltersProps {
  onStatusChange: (status: string) => void;
  onDateSort: (direction: 'asc' | 'desc') => void;
}

export function BehaviorLogsFilters({
  onStatusChange,
  onDateSort,
}: BehaviorLogsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="กรองตามสถานะ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          <SelectItem value="pending">รออนุมัติ</SelectItem>
          <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
          <SelectItem value="rejected">ปฏิเสธ</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={onDateSort as (value: string) => void}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="เรียงตามวันที่" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">ล่าสุด - เก่าสุด</SelectItem>
          <SelectItem value="asc">เก่าสุด - ล่าสุด</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
