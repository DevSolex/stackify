import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className = '', value, ...props }, ref) => {
        const percentage = Math.min(100, Math.max(0, value || 0));

        return (
            <div
                ref={ref}
                className={`relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}
                {...props}
            >
                <div
                    className="h-full w-full flex-1 bg-blue-600 transition-all dark:bg-blue-500"
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        );
    }
);
Progress.displayName = "Progress";
