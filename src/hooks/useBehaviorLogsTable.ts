import { useState, useEffect, useCallback } from 'react'; // เพิ่ม useCallback
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
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Default values
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const status = params?.status || 'all';
  const sortOrder = params?.sortOrder || 'desc';

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        sortOrder
      });

      const response = await fetch(`/api/behavior-logs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setTotalItems(data.total);
      
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, sortOrder]); // dependencies ที่ใช้ใน fetchLogs

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);

  return {
    logs,
    totalItems,
    loading,
    error,
    selectedIds,
    toggleSelection,
    clearSelection,
    refetch: fetchLogs
  };
}