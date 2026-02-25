export interface Package {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[]; // Assuming features come as an array or need parsing
  is_popular?: boolean;
}

export interface CreateAccountPayload {
  name: string;
  email: string;
  phone: string;
  academy_name: string;
  password?: string;
  package_id?: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
