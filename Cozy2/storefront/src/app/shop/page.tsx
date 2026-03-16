import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/product-grid";

export default function ShopPage() {
    return (
        <main className="w-full flex flex-col font-sans bg-white">
            <Suspense fallback={<div className="p-8 text-center text-[#18181b] font-bold uppercase tracking-widest text-xs">Loading Shop...</div>}>
                <ProductGrid />
            </Suspense>
        </main>
    );
}
