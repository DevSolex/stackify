import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto p-8 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-[200px] w-full" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-[150px]" />
                <Skeleton className="h-[150px]" />
                <Skeleton className="h-[150px]" />
            </div>
        </div>
    );
}
