export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    category: string;
    material: string;
    description: string;
    stock: number;
    images: string[];
    rating: number;
    tags?: string[];
}