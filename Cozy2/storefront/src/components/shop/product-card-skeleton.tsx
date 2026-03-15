import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton({ isOffset = false }: { isOffset?: boolean }) {
    return (
        <div className={`flex flex-col w-full ${isOffset ? 'md:mt-24' : ''}`}>
            <Skeleton className="w-full aspect-square border border-[#18181b]/10 mb-6" />
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16" />
            </div>
        </div>
    );
}
