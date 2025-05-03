export interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  receiver_id: string;
  ad_id: string;  // Removido o '?' para tornar obrigatório
}

export interface AdInfo {
  id: string;
  title: string;
  user_id: string;
}

export interface UserInfo {
  id: string;
  name: string;
  avatar_url?: string;
  building?: string;
  apartment?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  phone?: string;
  building?: string;
  apartment?: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at?: string;
  user1_id: string;
  user2_id: string;
  ad_id?: string;
  last_message?: string;
  unread_count?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  user_id: string;
  category: string;
  created_at: string;
  updated_at?: string;
  type?: string;
  availability?: string;
  delivery?: boolean;
  delivery_fee?: number;
  payment_methods?: string[];
  images?: string[];
  location?: string;
  condition?: string;
  negotiable?: boolean;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  query?: string;
}

export enum LoadingStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
