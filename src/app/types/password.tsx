export interface Password {
  id: string;
  user_id: string;
  title: string;
  username?: string;
  password: string;
  url?: string;
  created_at: string;
  // Encrypted data fields
  password_iv?: string;
  password_tag?: string;
  category_id?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
}
