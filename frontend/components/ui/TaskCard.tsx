
import { Task } from "../../lib/contracts"; // Modified import path as we moved file
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Clock, ArrowRight } from "lucide-react";

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const isExpired = Date.now() > task.deadline * 1000;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'open': return 'success';
            case 'in-progress': return 'warning';
            case 'completed': return 'default';
            default: return 'outline';
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-1 text-lg">{task.title}</CardTitle>
                    <Badge variant={getStatusVariant(task.status)} className="capitalize shrink-0">
                        {task.status}
                    </Badge>
                </div>
                <div className="text-xs text-slate-500 font-mono">ID: #{task.id}</div>
            </CardHeader>

            <CardContent className="flex-grow py-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {task.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-100">
                        <span className="text-blue-600 dark:text-blue-400">{task.amount}</span>
                        <span>STX</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 border-t border-slate-100 dark:border-slate-800/50 mt-auto flex flex-col gap-3">
                <div className="w-full flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={`${isExpired ? 'text-red-500' : ''}`}>
                            {new Date(task.deadline * 1000).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <Link href={`/tasks/${task.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
