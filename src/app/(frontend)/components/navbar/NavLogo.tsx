import { AcademicCapIcon } from '@heroicons/react/24/outline'

export default function NavLogo() {
  return (
    <div className="flex items-center">
      <AcademicCapIcon className="h-7 w-7 text-white" />
      <span className="ml-3 font-semibold text-white text-lg">
        ระบบบันทึกพฤติกรรมนักเรียน
      </span>
    </div>
  )
}