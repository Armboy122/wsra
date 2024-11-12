import { useState } from 'react'
import { HomeIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

type Props = {
  onHome: () => void
  onLogout: () => void
  onSelectRoom: (levelId: number, roomId: number) => void
}

export default function MobileMenu({ onHome, onLogout, onSelectRoom }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const getRooms = (level: number) => level <= 3 ? 12 : 8

  return (
    <div className="md:hidden bg-white rounded-b-xl">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <button
          onClick={onHome}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg"
        >
          <HomeIcon className="h-5 w-5 inline mr-2" />
          หน้าหลัก
        </button>

        {selectedLevel === null ? (
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                ม.{level}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedLevel(null)}
              className="block w-full text-left px-4 py-2 text-sm text-orange-600 font-medium mb-2"
            >
              ← กลับ
            </button>
            <div className="grid grid-cols-4 gap-2 p-2">
              {Array.from({ length: getRooms(selectedLevel) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onSelectRoom(selectedLevel, i + 1)}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg border border-gray-200"
                >
                  ม.{selectedLevel}/{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 inline mr-2" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  )
}