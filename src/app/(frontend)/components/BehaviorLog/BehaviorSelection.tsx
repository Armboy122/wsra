// components/BehaviorLog/BehaviorSelection.tsx
'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BehaviorType } from '@/types';

interface Props {
  behaviors: BehaviorType[];
  onSelect: (behavior: BehaviorType) => void;
  loading: boolean;
}

export function BehaviorSelection({ behaviors, onSelect ,loading}: Props) {
  return (
    <Select onValueChange={(value) => {
      const behavior = behaviors.find(b => b.id === parseInt(value));
      if (behavior) onSelect(behavior);
    }}>
      <SelectTrigger>
        <SelectValue placeholder="เลือกพฤติกรรม" />
      </SelectTrigger>
      <SelectContent>
        {behaviors.map((behavior) => (
          <SelectItem key={behavior.id} value={behavior.id.toString()}>
            {behavior.name} ({behavior.category === 'positive' ? '+' : ''}{behavior.score})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}