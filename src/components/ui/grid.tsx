import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 2 | 4 | 6 | 8;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, ...props }, ref) => {
    return (
      <div
        className={cn(
          'grid',
          `grid-cols-1`,
          `gap-${gap}`,
          {
            'sm:grid-cols-2': cols >= 2,
            'sm:grid-cols-3': cols >= 3,
            'sm:grid-cols-4': cols >= 4,
            'sm:grid-cols-6': cols >= 6,
            'sm:grid-cols-12': cols >= 12,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
); 