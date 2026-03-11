import React from "react";
import Image from "next/image";
import Link from "next/link";

export function CuratedCollections() {
    return (
        <section className="bg-background-light border-b border-zinc-950">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full border-t border-zinc-950">

                {/* Trending */}
                <Link href="/shop" className="group block relative border-b md:border-b-0 md:border-r border-zinc-950 overflow-hidden">
                    <div className="aspect-square md:aspect-[4/5] relative w-full h-full p-8 md:p-12 flex flex-col justify-between z-10">
                        <h2 className="text-zinc-950 text-3xl md:text-5xl font-extrabold leading-[0.9] tracking-tighter uppercase italic drop-shadow-md bg-white/40 backdrop-blur-sm self-start p-2 border border-zinc-950">
                            Trending
                        </h2>
                        <div className="self-end mt-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <div className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs px-6 py-3 border border-zinc-950 shadow-[4px_4px_0px_#09090b]">
                                Shop Now
                            </div>
                        </div>
                    </div>
                    {/* Placeholder image that fits the store aesthetic */}
                    <Image
                        alt="Trending products"
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop"
                        fill
                        className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                </Link>

                {/* Sharon's Favorites */}
                <Link href="/shop" className="group block relative border-zinc-950 overflow-hidden">
                    <div className="aspect-square md:aspect-[4/5] relative w-full h-full p-8 md:p-12 flex flex-col justify-between z-10">
                        <h2 className="text-zinc-950 text-3xl md:text-5xl font-extrabold leading-[0.9] tracking-tighter uppercase italic drop-shadow-md bg-white/40 backdrop-blur-sm self-start p-2 border border-zinc-950">
                            Sharon's Favorites
                        </h2>
                        <div className="self-end mt-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <div className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs px-6 py-3 border border-zinc-950 shadow-[4px_4px_0px_#09090b]">
                                Shop Now
                            </div>
                        </div>
                    </div>
                    {/* Placeholder image that fits the store aesthetic */}
                    <Image
                        alt="Sharon's Favorites"
                        src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1000&auto=format&fit=crop"
                        fill
                        className="object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                </Link>

            </div>
        </section>
    );
}
