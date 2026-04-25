export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'customer';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  stock_quantity: number;
  cover_image_url?: string;
  category_id?: string;
  average_rating: number;
  created_at: string;
}

export interface CartItem {
  id: string; // Same as book id
  title: string;
  price: number;
  quantity: number;
  cover_image_url?: string;
}
