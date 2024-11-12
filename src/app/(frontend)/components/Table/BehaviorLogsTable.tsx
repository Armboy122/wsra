import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BehaviorLogTable } from "@/types";
import { BehaviorLogsFilters } from "./BehaviorLogsFilters";
import { BehaviorLogCard } from "./BehaviorLogCard";

interface BehaviorLogsTableProps {
  logs: BehaviorLogTable[];
  selectedIds: number[];
  onToggleSelection: (id: number) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onDateSort: (direction: 'asc' | 'desc') => void;
}

export function BehaviorLogsTable({
  logs,
  selectedIds,
  onToggleSelection,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onStatusChange,
  onDateSort,
}: BehaviorLogsTableProps) {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // สร้างarray ของหน้าที่จะแสดงใน pagination
  const getPaginationItems = () => {
    const items = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(currentPage - halfShow, 1);
    let endPage = Math.min(startPage + showPages - 1, totalPages);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(endPage - showPages + 1, 1);
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push('ellipsis');
      items.push(totalPages);
    }

    return items;
  };

  const TablePagination = () => (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-700">
        แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{' '}
        {Math.min(currentPage * itemsPerPage, totalItems)} จากทั้งหมด {totalItems} รายการ
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {getPaginationItems().map((item, index) => (
            <PaginationItem key={index}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item as number);
                  }}
                  isActive={currentPage === item}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">รายการทั้งหมด</div>
            <div className="text-2xl font-semibold text-gray-800">{totalItems}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-sm text-gray-500">อนุมัติแล้ว</div>
            <div className="text-2xl font-semibold text-gray-800">
              {logs.filter(log => log.status === 'approved').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-sm text-gray-500">รออนุมัติ</div>
            <div className="text-2xl font-semibold text-gray-800">
              {logs.filter(log => log.status === 'pending').length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50/50 p-4">
            <BehaviorLogsFilters
              onStatusChange={onStatusChange}
              onDateSort={onDateSort}
            />
          </div>
          
          <div className="p-4 space-y-4">
            {logs.map((log) => (
              <BehaviorLogCard
                key={log.id}
                log={log}
                selected={selectedIds.includes(log.id)}
                onToggleSelection={onToggleSelection}
                isAdmin={session?.user?.role === "Admin"}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 bg-gray-50/50 p-4">
            <TablePagination />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Filters & Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50/50 p-4">
          <BehaviorLogsFilters
            onStatusChange={onStatusChange}
            onDateSort={onDateSort}
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                {session?.user?.role === "Admin" && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        logs.length > 0 &&
                        logs.every((log) => selectedIds.includes(log.id))
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          logs.forEach((log) => onToggleSelection(log.id));
                        } else {
                          selectedIds.forEach((id) => onToggleSelection(id));
                        }
                      }}
                    />
                  </TableHead>
                )}
                <TableHead className="font-medium text-gray-700">นักเรียน</TableHead>
                <TableHead className="font-medium text-gray-700">ครูผู้บันทึก</TableHead>
                <TableHead className="font-medium text-gray-700">พฤติกรรม</TableHead>
                <TableHead className="font-medium text-gray-700">สถานะ</TableHead>
                <TableHead className="font-medium text-gray-700">วันที่</TableHead>
                <TableHead className="font-medium text-gray-700">รายละเอียด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow 
                  key={log.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  {session?.user?.role === "Admin" && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={selectedIds.includes(log.id)}
                        onCheckedChange={() => onToggleSelection(log.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {log.student.firstName} {log.student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.student.studentNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{log.teacher.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
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
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "approved"
                          ? "success"
                          : log.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {log.status === "approved"
                        ? "อนุมัติแล้ว"
                        : log.status === "rejected"
                        ? "ปฏิเสธ"
                        : "รออนุมัติ"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {format(new Date(log.createdAt), "d MMM yyyy HH:mm", {
                      locale: th,
                    })}
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {log.description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="border-t border-gray-200 bg-gray-50/50 p-4">
          <TablePagination />
        </div>
      </div>
    </div>
  );
}