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
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BehaviorLogTable } from "@/types";
import { BehaviorLogsFilters } from "./BehaviorLogsFilters";
import { BehaviorLogCard } from "./BehaviorLogCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BehaviorLogsTableProps {
  logs: BehaviorLogTable[];
  selectedIds: number[];
  onToggleSelection: (id: number) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  onDateSort: (direction: "asc" | "desc") => void;
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
    const endPage = Math.min(startPage + showPages - 1, totalPages);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(endPage - showPages + 1, 1);
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push("ellipsis");
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push("ellipsis");
      items.push(totalPages);
    }

    return items;
  };

  const TablePagination = () => (
    <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile: ข้อความแสดงจำนวนรายการอยู่บน, Desktop: อยู่ซ้าย */}
      <div className="text-center text-sm text-gray-700 sm:text-left">
        แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} จากทั้งหมด{" "}
        {totalItems} รายการ
      </div>
  
      {/* Pagination Controls */}
      <Pagination className="self-center sm:self-auto">
        <PaginationContent className="flex-wrap gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={`h-9 px-2 sm:px-4 ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>
  
          {/* Hide some page numbers on mobile */}
          {getPaginationItems().map((item, index) => (
            <PaginationItem key={index} className="hidden sm:list-item">
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(item as number);
                  }}
                  isActive={currentPage === item}
                  className="h-9 w-9"
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
  
          {/* Show simplified version on mobile */}
          <PaginationItem className="sm:hidden">
            <span className="flex h-9 items-center justify-center px-2 text-sm">
              {currentPage} / {totalPages}
            </span>
          </PaginationItem>
  
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={`h-9 px-2 sm:px-4 ${
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-6">
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
                  <TableHead className="w-[5%]">
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
                <TableHead className="w-[25%] font-medium text-gray-700">
                  นักเรียน
                </TableHead>
                <TableHead className="w-[20%] font-medium text-gray-700">
                  ครูผู้บันทึก
                </TableHead>
                <TableHead className="w-[20%] font-medium text-gray-700">
                  พฤติกรรม
                </TableHead>
                <TableHead className="w-[15%] font-medium text-gray-700">
                  รายละเอียด
                </TableHead>
                <TableHead className="w-[15%] font-medium text-gray-700">
                  สถานะ
                </TableHead>
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
                  <TableCell className="text-gray-700">
                    {log.teacher.name}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex flex-wrap gap-1 cursor-pointer">
                          {log.behaviorTypes.slice(0, 1).map((bt) => (
                            <Badge
                              key={bt.behaviorType.id}
                              variant={
                                bt.behaviorType.category === "positive"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {bt.behaviorType.name}
                            </Badge>
                          ))}
                          {log.behaviorTypes.length > 1 && (
                            <Badge variant="outline">
                              ดูทั้งหมด ({log.behaviorTypes.length})
                            </Badge>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายการพฤติกรรมทั้งหมด</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          {log.behaviorTypes.map((bt) => (
                            <div
                              key={bt.behaviorType.id}
                              className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50"
                            >
                              <span>{bt.behaviorType.name}</span>
                              <Badge
                                variant={
                                  bt.behaviorType.category === "positive"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {bt.behaviorType.score}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-xs">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer truncate">
                          {log.description}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>รายละเอียด</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 p-4">{log.description}</div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "approved"
                          ? "success"
                          : log.status === "rejected"
                          ? "destructive"
                          : log.status === "pending"  // เพิ่มเงื่อนไขสำหรับ pending
                          ? "secondary"
                          : "secondary"  // default fallback
                      }
                    >
                      {log.status === "approved"
                        ? "อนุมัติแล้ว"
                        : log.status === "rejected"
                        ? "ปฏิเสธ"
                        : log.status === "pending" // เพิ่มเงื่อนไขสำหรับ pending
                        ? "รออนุมัติ"
                        : "รออนุมัติ"}{" "}
                    </Badge>
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
