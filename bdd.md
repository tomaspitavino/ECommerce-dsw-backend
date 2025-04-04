// Modelo de Producto
interface Product {
id: string;
name: string;
price: number;
category: "Sillas" | "Mesas" | "Sofás";
description: string;
images: string[]; // URLs de Cloudinary
stock: number;
seller?: string; // Si es marketplace
}

// Modelo de Orden
interface Order {
id: string;
userId: string;
products: { productId: string; quantity: number }[];
total: number;
status: "pending" | "shipped" | "delivered";
}
