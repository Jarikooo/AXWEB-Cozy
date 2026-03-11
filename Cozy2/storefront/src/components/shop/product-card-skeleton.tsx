import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton({ isOffset = false }: { isOffset?: boolean }) {
    return (
        <div className={`flex flex-col w-full ${isOffset ? 'md:mt-24' : ''}`}>
            {/* The main image placeholder (3:4 aspect ratio to match real cards) */}
            <Skeleton className="w-full aspect-[3/4] rounded-[2rem] mb-6" />

            {/* The text/details area */}
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                </div>
                <div className="text-right">
                    <Skeleton className="h-8 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}
