"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import ExportExcelButton from "../../components/ExportExcelButton";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

interface Student {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  behaviorScore: number;
  classroom: {
    id: number;
    name: string;
    department: string;
  };
}

interface BehaviorType {
  id: number;
  name: string;
  score: number;
}

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [behaviors, setBehaviors] = useState<BehaviorType[]>([]);
  const [selectedBehavior, setSelectedBehavior] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // ฟังก์ชันสำหรับเรียงลำดับ
  const sortedStudents = [...students].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.behaviorScore - b.behaviorScore;
    } else if (sortOrder === "desc") {
      return b.behaviorScore - a.behaviorScore;
    }
    return 0;
  });

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ฟังก์ชันสลับการเรียงลำดับ
  const toggleSort = () => {
    if (sortOrder === null) {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder(null);
    }
    // Reset หน้าเมื่อมีการเรียงลำดับใหม่
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/students?classroomId=${params.classroomid}`
        );
        const data = await res.json();

        // แปลงข้อมูลให้เป็น array เสมอ
        const studentsArray = data.error
          ? []
          : Array.isArray(data)
          ? data
          : [data];

        setStudents(studentsArray);
        if (studentsArray.length > 0) {
          setClassroom(studentsArray[0].classroom.name);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [params.classroomid]);

  // เพิ่มฟังก์ชันดึงข้อมูลพฤติกรรม
  const fetchBehaviors = async () => {
    try {
      const res = await fetch("/api/behaviors?category=positive");
      const data = await res.json();
      setBehaviors(data);
    } catch (error) {
      console.error("Error fetching behaviors:", error);
    }
  };

  // เพิ่มฟังก์ชันอัพเดตคะแนน
  const handleUpdateScores = async () => {
    if (!selectedBehavior) {
      toast.error("กรุณาเลือกพฤติกรรม");
      return;
    }

    try {
      setIsUpdating(true);
      const behavior = behaviors.find(
        (b) => b.id.toString() === selectedBehavior
      );

      const response = await fetch("/api/students", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classroomId: parseInt(params.classroomid as string),
          scoreChange: behavior?.score || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to update scores");

      // รีเฟรชข้อมูลนักเรียน
      const updatedStudentsRes = await fetch(
        `/api/students?classroomId=${params.classroomid}`
      );
      const updatedStudents = await updatedStudentsRes.json();
      setStudents(
        Array.isArray(updatedStudents) ? updatedStudents : [updatedStudents]
      );

      toast.success("อัพเดตคะแนนสำเร็จ");
      setSelectedBehavior("");
    } catch (error) {
      console.error("Error updating scores:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดตคะแนน");
    } finally {
      setIsUpdating(false);
    }
  };

  // เพิ่ม useEffect สำหรับดึงข้อมูลพฤติกรรม
  useEffect(() => {
    fetchBehaviors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-gray-500 mb-4">
          ไม่พบข้อมูลนักเรียนในห้องเรียนนี้
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          ย้อนกลับ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">
            ห้องเรียน{classroom}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <ExportExcelButton students={students} classroom={classroom} />
          {session?.user?.role === "Admin" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className=" bg-blue-600 hover:bg-blue-700"
                >
                  เพิ่มคะแนนทั้งห้อง
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มคะแนนทั้งห้อง</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">เลือกพฤติกรรม</label>
                    <Select
                      value={selectedBehavior}
                      onValueChange={setSelectedBehavior}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกพฤติกรรม" />
                      </SelectTrigger>
                      <SelectContent>
                        {behaviors.map((behavior) => (
                          <SelectItem
                            key={behavior.id}
                            value={behavior.id.toString()}
                          >
                            {behavior.name} (+{behavior.score})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBehavior("")}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      onClick={handleUpdateScores}
                      disabled={isUpdating || !selectedBehavior}
                    >
                      {isUpdating ? "กำลังอัพเดต..." : "บันทึก"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <div className="bg-orange-100 px-4 py-2 rounded-lg text-center">
            <span className="text-orange-600 font-medium text-sm sm:text-base">
              จำนวนนักเรียน: {students.length} คน
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 sm:py-4 text-center text-sm sm:text-md font-medium text-gray-500 whitespace-nowrap">
                  ลำดับ
                </th>
                <th className="px-3 py-3 sm:py-4 text-center text-sm sm:text-md font-medium text-gray-500 whitespace-nowrap">
                  รหัสประจำตัว
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-md font-medium text-gray-500">
                  ชื่อ-สกุล
                </th>
                <th
                  onClick={toggleSort}
                  className="px-3 py-3 sm:py-4 text-center text-sm sm:text-md font-medium text-gray-500 cursor-pointer group whitespace-nowrap"
                >
                  <div className="inline-flex items-center gap-1 sm:gap-2">
                    คะแนน
                    {sortOrder === null ? (
                      <div className="opacity-0 group-hover:opacity-100">
                        <ArrowUpIcon className="h-4 w-4" />
                      </div>
                    ) : sortOrder === "desc" ? (
                      <ArrowDownIcon className="h-4 w-4" />
                    ) : (
                      <ArrowUpIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-3 sm:py-4 text-center text-sm sm:text-md text-gray-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-3 text-center py-3 sm:py-4 text-sm sm:text-md text-gray-900">
                    {student.studentNumber}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-md text-gray-900">
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <span className="font-medium">{student.firstName}</span>
                      <span>{student.lastName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 sm:py-4 text-center">
                    <span
                      className={`
                        inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm sm:text-md font-medium
                        ${
                          student.behaviorScore >= 100
                            ? "bg-green-100 text-green-700"
                            : student.behaviorScore >= 80
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {student.behaviorScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง{" "}
              {Math.min(currentPage * itemsPerPage, students.length)} จากทั้งหมด{" "}
              {students.length} รายการ
            </div>

            <nav className="inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {/* แสดงเฉพาะหน้าที่อยู่ใกล้หน้าปัจจุบัน */}
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                const showPage =
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  Math.abs(pageNumber - currentPage) <= 1;

                if (!showPage) {
                  if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNumber
                        ? "z-10 bg-orange-600 text-white"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
