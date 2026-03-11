"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types";
import { getCustomer } from "@/app/actions/auth";

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    isSyncing: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialization and Merging Logic
    useEffect(() => {
        let mounted = true;

        const initWishlist = async () => {
            let mergedWishlist: Product[] = [];

            // 1. Load Local Storage
            try {
                const saved = localStorage.getItem("cozy_wishlist");
                if (saved) {
                    mergedWishlist = JSON.parse(saved);
                }
            } catch (error) {
                console.error("Failed to load local wishlist", error);
            }

            // 2. Check Auth Status & Merge Backend Metadata
            // OPTIMIZATION: Check for the non-httpOnly cookie to prevent firing server actions for guests
            const hasSession = typeof document !== 'undefined' && document.cookie.includes('has_session=true');

            if (hasSession) {
                try {
                    const customer = await getCustomer();
                    if (customer) {
                        setIsAuthenticated(true);
                        const backendWishlist = customer.metadata?.wishlist as Product[] || [];

                        if (backendWishlist.length > 0) {
                            // Merge strategy: Unique items by ID, backend takes precedence if dup (simpler logic)
                            const seen = new Set(backendWishlist.map((p: Product) => p.id));
                            const newLocals = mergedWishlist.filter((p: Product) => !seen.has(p.id));
                            mergedWishlist = [...backendWishlist, ...newLocals];

                            // If we had local items that weren't in backend, trigger an initial sync
                            if (newLocals.length > 0) {
                                syncToBackend(mergedWishlist);
                            }
                        } else if (mergedWishlist.length > 0) {
                            // Backend empty, but local has items -> Sync up
                            syncToBackend(mergedWishlist);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch customer for wishlist sync", e);
                }
            }

            if (mounted) {
                setWishlist(mergedWishlist);
                setIsMounted(true);
            }
        };

        initWishlist();

        return () => { mounted = false; };
    }, []);

    // Local Storage Persistance (Always run on change)
    useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem("cozy_wishlist", JSON.stringify(wishlist));
            } catch (error) {
                console.error("Failed to save wishlist to localStorage", error);
            }
        }
    }, [wishlist, isMounted]);

    // Backend Sync Function
    const syncToBackend = async (currentWishlist: Product[]) => {
        setIsSyncing(true);
        try {
            await fetch('/api/wishlist/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wishlist: currentWishlist })
            });
        } catch (error) {
            console.error("Failed to sync wishlist to backend", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find((p) => p.id === product.id)) return prev;
            const updatedList = [...prev, product];
            if (isAuthenticated) syncToBackend(updatedList);
            return updatedList;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => {
            const updatedList = prev.filter((p) => p.id !== productId);
            if (isAuthenticated) syncToBackend(updatedList);
            return updatedList;
        });
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p.id === productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
        if (isAuthenticated) syncToBackend([]);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                isSyncing,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
