import Medusa from "@medusajs/js-sdk"
import { Product, CategoryNode } from "../types"

let MEDUSA_BACKEND_URL = "http://127.0.0.1:9000"
if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
    MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export const fetchMedusaProducts = async (filters: any = {}): Promise<{ products: Product[], count: number }> => {
    try {
        const queryParams: any = {
            fields: "id,title,handle,description,thumbnail,images.url,variants.id,variants.title,variants.calculated_price,variants.options.value,variants.options.option.title,categories.name,categories.handle,categories.parent_category_id,metadata",
            limit: 12,
            offset: 0,
            ...filters
        };

        const response = await sdk.store.product.list(queryParams);
        const productsRaw = response.products || [];
        const count = response.count || 0;

        const products = productsRaw.map((p: any) => {
            const categoryHandles = p.categories?.map((c: any) => c.handle) || [];
            const variantWithPrice = p.variants?.find((v: any) => v.calculated_price) || p.variants?.[0];

            const priceRaw = variantWithPrice?.calculated_price?.calculated_amount;
            const price = priceRaw ? (priceRaw / 100) : 0;

            const colors = Array.from(new Set(p.variants?.flatMap((v: any) =>
                v.options?.filter((o: any) => o.option?.title?.toLowerCase() === "color").map((o: any) => o.value)
            ) || [])) as string[];

            const sizes = Array.from(new Set(p.variants?.flatMap((v: any) =>
                v.options?.filter((o: any) => o.option?.title?.toLowerCase() === "size").map((o: any) => o.value)
            ) || [])) as string[];

            const variantMap: Record<string, string> = {};
            p.variants?.forEach((v: any) => {
                const colorOpt = v.options?.find((o: any) => o.option?.title?.toLowerCase() === "color")?.value || "Default";
                const sizeOpt = v.options?.find((o: any) => o.option?.title?.toLowerCase() === "size")?.value || "One Size";
                variantMap[`${colorOpt}-${sizeOpt}`] = v.id;
            });

            const mainCat = p.categories?.find((c: any) => !c.parent_category_id) || p.categories?.[0];
            const subCat = p.categories?.find((c: any) => c.parent_category_id && c.parent_category_id === mainCat?.id) || p.categories?.[1];

            return {
                id: p.id,
                variantId: variantWithPrice?.id,
                variantMap: variantMap,
                name: p.title,
                price: price,
                category: mainCat?.handle || "unbound",
                subcategory: subCat?.handle || "",
                categoryHandles: categoryHandles,
                brand: (p.metadata?.brand as string) || "",
                colors: colors.length > 0 ? colors : ["Default"],
                sizes: sizes.length > 0 ? sizes : ["One Size"],
                image: p.thumbnail || (p.images && p.images[0]?.url) || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
                secondaryImage: (p.images && p.images[1]?.url) || p.thumbnail || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
                description: p.description || "A curated piece for your cozy home.",
                isNew: p.metadata?.isNew === "true" || p.metadata?.isNew === true || false
            }
        });

        return { products, count };
    } catch (error) {
        console.error("[Medusa SDK] Error in fetchMedusaProducts:", error);
        return { products: [], count: 0 };
    }
}

export const fetchMedusaCategories = async (): Promise<CategoryNode[]> => {
    try {
        const response = await sdk.store.category.list({
            fields: "id,name,handle,parent_category_id,category_children.id,category_children.name,category_children.handle"
        })

        const product_categories = response.product_categories || [];

        return product_categories
            .filter((c: any) => !c.parent_category_id)
            .map((c: any) => ({
                id: c.handle,
                label: c.name,
                subcategories: c.category_children?.map((sub: any) => ({
                    id: sub.handle,
                    label: sub.name
                })) || []
            }))
    } catch (error) {
        console.error("[Medusa SDK] Error in fetchMedusaCategories:", error);
        return [];
    }
}
