export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string; // Optional description of the product
}

export interface Order {
    id: string;
    userId: string;
    productIds: string[]; // Array of Product IDs included in the order
    total: number;        // Total amount for the order
    status: string;       // Status of the order (e.g., "pending", "shipped", "delivered")
}

export interface User {
    _id: string;
    name: string;
    email: string;
    order_ids: string[]; // Array of Order IDs associated with the user
}