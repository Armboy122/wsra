// hooks/useBehaviors.ts
import { useState, useEffect } from "react";
import type { BehaviorType } from "@/types";
import { toast } from "react-hot-toast";

export function useBehaviors() {
  //เก็บค่าของพฤติกรรม
  const [behaviors, setBehaviors] = useState<{
    positive: BehaviorType[];
    negative: BehaviorType[];
  }>({
    positive: [],
    negative: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBehaviors = async () => {
    setLoading(true);
    setError(null);

    try {
      const [positiveRes, negativeRes] = await Promise.all([
        fetch("/api/behaviors?category=positive"),
        fetch("/api/behaviors?category=negative"),
      ]);

      // เช็ค response status
      if (!positiveRes.ok || !negativeRes.ok) {
        throw new Error("Failed to fetch behaviors");
      }

      const positive = await positiveRes.json();
      const negative = await negativeRes.json();

      setBehaviors({
        positive,
        negative,
      });
    } catch (error) {
      setBehaviors({ positive: [], negative: [] });
      toast.error("ไม่สามารถดึงข้อมูลพฤติกรรมได้",error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBehaviors();
  }, []);


  return {
    behaviors,
    loading,
    error,
    refetch: fetchBehaviors,
  };
}
