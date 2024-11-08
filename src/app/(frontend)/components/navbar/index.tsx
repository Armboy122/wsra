// components/navbar/index.tsx
'use client'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { HomeIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import NavLogo from './NavLogo'
import NavButton from './NavButton'
import ClassroomDropdown from './ClassroomDropdown'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  const handleSelectRoom = (level: number, room: number) => {
    const classroomId = getClassroomId(level, room)
    router.push(`/classroom/${classroomId}`)
  }

  const getClassroomId = (level: number, room: number) => {
    let id = 0
    for (let i = 1; i < level; i++) {
      id += i <= 3 ? 12 : 8
    }
    return id + room
  }

  return (
    <nav className="bg-orange-600 rounded-xl shadow-lg mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <NavLogo />

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavButton
              icon={<HomeIcon className="h-5 w-5" />}
              text="หน้าหลัก"
              onClick={() => router.push('/')}
            />
            
            <ClassroomDropdown onSelectRoom={handleSelectRoom} />

            <NavButton
              icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
              text="ออกจากระบบ"
              onClick={handleLogout}
              variant="danger"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-orange-500"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <MobileMenu
          onHome={() => router.push('/')}
          onLogout={handleLogout}
          onSelectRoom={handleSelectRoom}
        />
      )}
    </nav>
  )
}