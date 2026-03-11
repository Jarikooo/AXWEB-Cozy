import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function PDPSkeleton() {
    return (
        <div className="min-h-[100dvh] bg-[#f9fafb] text-zinc-950 font-sans p-4 md:p-8 lg:p-16 flex flex-col items-center justify-center pt-32 pb-32">
            <div className="max-w-6xl w-full mx-auto mb-8">
                <div className="flex items-center gap-2 text-zinc-300 font-sans text-sm font-medium w-fit">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Terug
                </div>
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
                {/* Left: Aspect 4/5 Image Skeleton */}
                <Skeleton className="relative w-full aspect-[4/5] rounded-[2.5rem]" />

                {/* Right: Details Skeleton */}
                <div className="flex flex-col flex-1 pl-4 md:pl-0 md:py-8 sticky top-32">
                    {/* Tags */}
                    <div className="flex gap-2 mb-6 mt-4">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>

                    {/* Title */}
                    <Skeleton className="h-12 md:h-16 w-3/4 mb-4 rounded-xl" />

                    {/* Price */}
                    <Skeleton className="h-8 w-24 mb-8 rounded-lg" />

                    {/* Description Paragraph */}
                    <div className="flex flex-col gap-2 mb-12 max-w-lg">
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-5/6 rounded-md" />
                        <Skeleton className="h-4 w-4/6 rounded-md" />
                    </div>

                    {/* Selectors and Quantity block */}
                    <div className="flex flex-col gap-8 mb-12">
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-12 rounded-sm" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-20 rounded-2xl" />
                                <Skeleton className="h-10 w-20 rounded-2xl" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-16 rounded-sm" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-16 rounded-2xl" />
                                <Skeleton className="h-10 w-16 rounded-2xl" />
                                <Skeleton className="h-10 w-16 rounded-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <Skeleton className="flex-1 h-14 rounded-[1.2rem]" />
                        <Skeleton className="w-[60px] h-[60px] rounded-[1.2rem] shrink-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
