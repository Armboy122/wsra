import * as XLSX from 'xlsx';

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

interface ExportExcelButtonProps {
  students: Student[];
  classroom: string;
}

export default function ExportExcelButton({ students, classroom }: ExportExcelButtonProps) {
  const exportToExcel = () => {
    // สร้างข้อมูลสำหรับ Excel
    const excelData = students.map((student) => ({
      'รหัสประจำตัว': student.studentNumber,
      'ชื่อ': student.firstName,
      'นามสกุล': student.lastName,
      'คะแนนความประพฤติ': student.behaviorScore,
    }));

    // สร้าง workbook และ worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // กำหนดความกว้างคอลัมน์
    const columnWidths = [
      { wch: 15 }, // รหัสประจำตัว
      { wch: 20 }, // ชื่อ
      { wch: 20 }, // นามสกุล
      { wch: 20 }, // คะแนนความประพฤติ
    ];
    worksheet['!cols'] = columnWidths;

    // แทนที่เครื่องหมาย / ด้วยคำว่า "ห้อง" และลบตัวอักษรพิเศษอื่นๆ
    const cleanClassroom = classroom.replace('/', 'ห้อง').replace(/[:\\\?*\[\]]/g, '');
    const safeSheetName = `Room${cleanClassroom}`;
    const safeFileName = `${cleanClassroom}.xlsx`;

    // เพิ่ม worksheet ลงใน workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);

    // บันทึกไฟล์
    XLSX.writeFile(workbook, safeFileName);
  };

  return (
    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-5 h-5"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" 
        />
      </svg>
      ดาวน์โหลดรายชื่อนักเรียน
    </button>
  );
}