import { useState, useEffect, useMemo } from 'react';
import { BehaviorLogTable } from '@/types';

interface UseBehaviorLogsParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useBehaviorLogs(params?: UseBehaviorLogsParams) {
  const [logs, setLogs] = useState<BehaviorLogTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Default values
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const status = params?.status || 'all';
  const sortOrder = params?.sortOrder || 'desc';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/behavior-logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError('Failed to fetch logs');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  // Filter and sort logs
  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];

    // Filter by status
    if (status !== 'all') {
      result = result.filter(log => log.status === status);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [logs, status, sortOrder]);

  // Calculate pagination
  const totalItems = filteredAndSortedLogs.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredAndSortedLogs.slice(startIndex, endIndex);

  return {
    logs: paginatedLogs,
    totalItems,
    loading,
    error,
    selectedIds,
    toggleSelection,
    clearSelection,
    refetch: fetchLogs
  };
}