import { ChartBarIcon } from '@heroicons/react/24/outline'

type Props = {
  onSelectRoom: (levelId: number, roomId: number) => void
}

export default function ClassroomDropdown({ onSelectRoom }: Props) {
  const getRooms = (level: number) => level <= 3 ? 12 : 8

  return (
    <div className="relative group">
      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 rounded-lg transition-all duration-200 hover:shadow-md">
        <ChartBarIcon className="h-5 w-5 mr-2" />
        คะแนนนักเรียน
      </button>

      <div className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div key={level} className="relative group/room">
              <button className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors items-center justify-between">
                <span>ม.{level}</span>
                <ChartBarIcon className="h-4 w-4 ml-2" />
              </button>

              <div className="absolute left-full top-0 w-48 ml-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover/room:opacity-100 group-hover/room:visible transition-all duration-200">
                <div className="py-2 grid grid-cols-3 gap-1 p-2">
                  {Array.from({ length: getRooms(level) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => onSelectRoom(level, i + 1)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-md transition-colors text-center"
                    >
                      ม.{level}/{i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}