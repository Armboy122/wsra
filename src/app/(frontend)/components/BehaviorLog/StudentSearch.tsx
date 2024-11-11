// components/BehaviorLog/StudentSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StudentSearchResult {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  behaviorScore: number;
  classroom: {
    name: string;
  };
}

interface Props {
  onSelect: (student: StudentSearchResult) => void;
}

export function StudentSearch({ onSelect }: Props) {
  const [items, setItems] = useState<StudentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    inputValue,
    reset
  } = useCombobox({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelect(selectedItem);
        reset();
      }
    },
  });

  useEffect(() => {
    const searchStudents = async () => {
      if (!inputValue.trim()) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/students/search?query=${encodeURIComponent(inputValue)}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error searching students:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchStudents, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <div className="relative">
      <Input
        {...getInputProps()}
        placeholder="ค้นหาด้วยเลขประจำตัว หรือ ชื่อนักเรียน"
        className="w-full"
      />

      <div
        {...getMenuProps()}
        className={`absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg ${
          !isOpen || items.length === 0 ? 'hidden' : ''
        }`}
      >
        <ScrollArea className="max-h-[300px]">
          {loading ? (
            <div className="p-2 text-center text-gray-500">กำลังค้นหา...</div>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.id}
                {...getItemProps({ item, index })}
                className={`p-2 cursor-pointer ${
                  highlightedIndex === index ? 'bg-gray-100' : ''
                }`}
              >
                <div className="font-medium">
                  {item.firstName} {item.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  เลขประจำตัว: {item.studentNumber} | 
                  ห้อง: {item.classroom.name}
                </div>
              </div>
            ))
          ) : inputValue.trim() ? (
            <div className="p-2 text-center text-gray-500">
              ไม่พบนักเรียน
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </div>
  );
}