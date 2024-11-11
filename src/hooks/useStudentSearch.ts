'use client';
// hooks/useStudentSearch.ts
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { StudentSearchResult } from '@/types';

export function useStudentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {

    const searchStudents = async () => {
      if (!debouncedQuery) {
        setStudents([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/students/search?query=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error('Error searching students:', error);
      } finally {
        setLoading(false);
      }
    };

    searchStudents();
  }, [debouncedQuery]);

  return { searchQuery, setSearchQuery, students, loading };
}
