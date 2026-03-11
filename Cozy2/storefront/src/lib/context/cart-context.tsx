"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { sdk } from "@/lib/medusa";
import { StoreCart, StoreCartLineItem } from "@medusajs/types";

interface CartContextType {
    cart: StoreCart | null;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    refreshCart: () => Promise<void>;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<StoreCart | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartId, setCartId] = useState<string | null>(null);

    useEffect(() => {
        const initializeCart = async () => {
            let storedCartId = localStorage.getItem("cart_id");
            const hasSession = document.cookie.includes("has_session=true");

            if (hasSession) {
                try {
                    const res = await fetch("/api/cart/sync");
                    const data = await res.json();
                    if (data.success && data.cart_id) {
                        storedCartId = data.cart_id;
                        localStorage.setItem("cart_id", storedCartId as string);
                    }
                } catch (err) {
                    console.error("Failed to sync cart from backend:", err);
                }
            }

            if (storedCartId) {
                setCartId(storedCartId);
            }
        };

        initializeCart();
    }, []);

    const refreshCart = async () => {
        if (!cartId) return;
        try {
            const { cart: fetchedCart } = await sdk.store.cart.retrieve(cartId as string, {
                fields: "*items,*items.variant,*items.variant.product",
            });
            setCart(fetchedCart);
        } catch (e) {
            console.error(e);
            // Cart might be invalid/completed
            localStorage.removeItem("cart_id");
            setCartId(null);
            setCart(null);
        }
    };

    useEffect(() => {
        if (cartId) {
            refreshCart();
        }
    }, [cartId]);

    const addItem = async (variantId: string, quantity: number) => {
        try {
            let currentCartId = cartId;
            if (!currentCartId) {
                const { regions } = await sdk.store.region.list();
                const regionId = regions[0]?.id;
                const { cart: newCart } = await sdk.store.cart.create({ region_id: regionId });
                currentCartId = newCart.id;
                setCartId(currentCartId);
                localStorage.setItem("cart_id", currentCartId);
            }

            const { cart: updatedCart } = await sdk.store.cart.createLineItem(currentCartId, {
                variant_id: variantId,
                quantity,
            });

            setCart(updatedCart);
            setIsCartOpen(true); // Auto-open cart on add
        } catch (e) {
            console.error("Error adding item to cart:", e);
        }
    };

    const removeItem = async (lineId: string) => {
        if (!cartId) return;
        try {
            await sdk.store.cart.deleteLineItem(cartId, lineId);
            await refreshCart();
        } catch (e) {
            console.error("Error removing item:", e);
        }
    };

    const updateItem = async (lineId: string, quantity: number) => {
        if (!cartId) return;
        try {
            await sdk.store.cart.updateLineItem(cartId, lineId, { quantity });
            await refreshCart();
        } catch (e) {
            console.error("Error updating item:", e);
        }
    };

    // Safe item counting across versions
    const itemCount = cart?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0;

    return (
        <CartContext.Provider
            value={{ cart, isCartOpen, setIsCartOpen, addItem, removeItem, updateItem, refreshCart, itemCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
