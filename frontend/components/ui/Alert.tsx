import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    title?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className = '', variant = 'default', title, children, ...props }, ref) => {
        const baseStyles = "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11";

        const variants = {
            default: "bg-background text-foreground border-slate-200 dark:border-slate-800",
            destructive: "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 dark:text-red-500 dark:[&>svg]:text-red-500",
            success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 dark:text-green-500 dark:[&>svg]:text-green-500",
            warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600 dark:text-yellow-500 dark:[&>svg]:text-yellow-500",
        };

        const Icon = {
            default: Info,
            destructive: XCircle,
            success: CheckCircle,
            warning: AlertCircle,
        }[variant];

        const classes = `${baseStyles} ${variants[variant]} ${className}`;

        return (
            <div
                ref={ref}
                role="alert"
                className={classes}
                {...props}
            >
                <Icon className="h-4 w-4" />
                <div className="text-sm">
                    {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
                    <div className="opacity-90">{children}</div>
                </div>
            </div>
        );
    }
);
Alert.displayName = "Alert";
