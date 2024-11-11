import { Button } from '@/components/ui/button';
import type { BehaviorType } from '@/types';

interface Props {
  behaviors: BehaviorType[];
  onRemove: (behaviorId: number) => void;
}

export function SelectedBehaviors({ behaviors, onRemove }: Props) {
  if (behaviors.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="font-medium mb-2">พฤติกรรมที่เลือก:</h4>
      <div className="space-y-2">
        {behaviors.map((behavior) => (
          <div
            key={behavior.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span>
              {behavior.name} 
              ({behavior.category === 'positive' ? '+' : ''}{behavior.score})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(behavior.id)}
            >
              ลบ
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}