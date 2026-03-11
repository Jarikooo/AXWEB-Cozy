export interface Product {
    id: string;
    variantId?: string;
    variantMap?: Record<string, string>; // Mapping of "Color-Size" to variantId
    name: string;
    price: number;
    category: string;
    subcategory: string;
    categoryHandles?: string[];
    brand?: string;
    colors: string[];
    sizes: string[];
    image: string;
    secondaryImage: string;
    description: string;
    isNew?: boolean;
    handle?: string;
    variants?: any[];
}

export interface CategoryNode {
    id: string;
    label: string;
    subcategories?: { id: string; label: string }[];
}
