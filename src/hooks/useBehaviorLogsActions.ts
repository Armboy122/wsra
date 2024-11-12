export function useBehaviorLogsActions() {
    const updateStatus = async (ids: number[], status: string) => {
      try {
        const response = await fetch('/api/behavior-logs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, status })
        });
        
        if (!response.ok) throw new Error('Update failed');
        return await response.json();
      } catch (error) {
        throw error;
      }
    };
  
    return { updateStatus };
  }