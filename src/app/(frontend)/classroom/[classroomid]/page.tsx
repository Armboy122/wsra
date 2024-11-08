"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

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

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            ห้องเรียน{classroom}
          </h1>
        </div>
        <div className="bg-orange-100 px-4 py-2 rounded-lg">
          <span className="text-orange-600 font-medium">
            จำนวนนักเรียน: {students.length} คน
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y table-fixed divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[5%] px-3 py-4 text-center text-md font-medium text-gray-500">
                  ลำดับ
                </th>
                <th className="w-[15%] py-4 text-center text-md font-medium text-gray-500">
                  รหัสประจำตัว
                </th>
                <th className="w-[50%] px-6 py-4 text-left text-md font-medium text-gray-500">
                  ชื่อ-สกุล
                </th>
                <th className="w-[20%] py-4 text-center text-md font-medium text-gray-500">
                  คะแนนความประพฤติ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="w-[5%] px-3 py-4 text-center text-md text-gray-500 font-medium">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="w-[15%] px-6 text-center py-4 text-md text-gray-900">
                    {student.studentNumber}
                  </td>
                  <td className="w-[50%] px-6  py-4 text-md text-gray-900">
                    <div className="grid grid-cols-12 gap-4">
                      <span className="col-span-6">{student.firstName}</span>
                      <span className="col-span-6">{student.lastName}</span>
                    </div>
                  </td>
                  <td className="w-[20%] py-4 text-center">
                    <span
                      className={`
                      inline-flex items-center px-3 py-1 rounded-full text-md font-medium
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

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                ก่อนหน้า
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center px-4 py-2 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                ถัดไป
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-md text-gray-700">
                  แสดง{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  ถึง{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, students.length)}
                  </span>{" "}
                  จากทั้งหมด{" "}
                  <span className="font-medium">{students.length}</span> รายการ
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-md font-semibold ${
                        currentPage === i + 1
                          ? "z-10 bg-orange-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
