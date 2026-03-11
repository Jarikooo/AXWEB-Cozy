import { ProductCardSkeleton } from "@/components/shop/product-card-skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen w-full relative bg-background-light text-zinc-950 font-sans pt-32">
            {/* Shop Header Skeleton */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-16">
                <div className="h-20 md:h-28 w-3/4 bg-zinc-950/5 rounded-2xl animate-pulse mb-6" />
                <div className="h-4 w-1/3 bg-zinc-950/5 rounded-md animate-pulse mt-6" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-16 mt-24">
                    {[1, 2, 3, 4, 5, 6].map((i, index) => {
                        const isOffset = index % 3 === 1;
                        return <ProductCardSkeleton key={i} isOffset={isOffset} />;
                    })}
                </div>
            </div>
        </main>
    );
}
