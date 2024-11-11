// hooks/useBehaviors.ts
import { useState, useEffect } from 'react';
import type { BehaviorType } from '@/types';
import { toast } from 'react-hot-toast';

export function useBehaviors() {
  const [behaviors, setBehaviors] = useState<{ positive: BehaviorType[], negative: BehaviorType[] }>({
    positive: [],
    negative: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBehaviors = async () => {
    console.log('1. Starting fetchBehaviors in hook');
    setLoading(true);
    setError(null);

    try {
      console.log('2. Fetching data...');
      const [positiveRes, negativeRes] = await Promise.all([
        fetch('/api/behaviors?category=positive'),
        fetch('/api/behaviors?category=negative')
      ]);

      console.log('3. Response status:', {
        positive: positiveRes.status,
        negative: negativeRes.status
      });

      // เช็ค response status
      if (!positiveRes.ok || !negativeRes.ok) {
        throw new Error('Failed to fetch behaviors');
      }

      const positive = await positiveRes.json();
      const negative = await negativeRes.json();

      console.log('4. Received data:', {
        positive,
        negative
      });

      // เช็คว่าข้อมูลเป็น array หรือไม่
      if (!Array.isArray(positive) || !Array.isArray(negative)) {
        console.error('Invalid data format:', { positive, negative });
        throw new Error('Invalid data format received');
      }

      setBehaviors({
        positive,
        negative
      });

      console.log('5. State updated successfully');

    } catch (error) {
      console.error('Error in fetchBehaviors:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setBehaviors({ positive: [], negative: [] });
      toast.error('ไม่สามารถดึงข้อมูลพฤติกรรมได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('6. useEffect triggered');
    fetchBehaviors();
  }, []);

  // เพิ่ม debug log เมื่อ behaviors เปลี่ยน
  useEffect(() => {
    console.log('7. Current behaviors state:', behaviors);
  }, [behaviors]);

  return { 
    behaviors, 
    loading, 
    error,
    refetch: fetchBehaviors 
  };
}