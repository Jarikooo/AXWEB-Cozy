import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PDPSkeleton() {
    return (
        <div className="flex flex-col w-full bg-white min-h-screen">
            {/* Breadcrumb skeleton */}
            <div className="w-full border-b border-zinc-950 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <span className="text-zinc-950/20">/</span>
                    <Skeleton className="h-4 w-12" />
                    <span className="text-zinc-950/20">/</span>
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            {/* Main content */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
                    {/* Left: Image skeleton */}
                    <div className="flex flex-col gap-4">
                        <Skeleton className="relative w-full aspect-[4/5] border border-zinc-950/10" />
                        <div className="flex gap-3">
                            <Skeleton className="w-20 h-20 border border-zinc-950/10" />
                            <Skeleton className="w-20 h-20 border border-zinc-950/10" />
                            <Skeleton className="w-20 h-20 border border-zinc-950/10" />
                        </div>
                    </div>

                    {/* Right: Details skeleton */}
                    <div className="flex flex-col md:sticky md:top-28">
                        {/* Category tag */}
                        <Skeleton className="h-6 w-40 mb-4" />

                        {/* Title */}
                        <Skeleton className="h-12 md:h-14 w-4/5 mb-2" />
                        <Skeleton className="h-12 md:h-14 w-3/5 mb-4" />

                        {/* Price */}
                        <Skeleton className="h-8 w-28 mb-8" />

                        {/* Description */}
                        <div className="flex flex-col gap-2 mb-10 max-w-lg">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>

                        {/* Selectors */}
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex flex-col gap-3">
                                <Skeleton className="h-4 w-12" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 w-20 border border-zinc-950/10" />
                                    <Skeleton className="h-10 w-20 border border-zinc-950/10" />
                                    <Skeleton className="h-10 w-20 border border-zinc-950/10" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Skeleton className="h-4 w-14" />
                                <Skeleton className="h-12 w-40 border border-zinc-950/10" />
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <Skeleton className="w-full h-[60px] border border-zinc-950/10 mb-10" />

                        {/* Accordions */}
                        <div className="border-t border-zinc-950/10 flex flex-col">
                            <Skeleton className="h-14 w-full border-b border-zinc-950/10" />
                            <Skeleton className="h-14 w-full border-b border-zinc-950/10" />
                            <Skeleton className="h-14 w-full border-b border-zinc-950/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
