export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    category: string;
    material: string;
    description: string;
    stock: number;
    image: string;
    rating: number;
    tags?: string[];
}