// User types
export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
  }
  
  export type UserRole = 'admin' | 'manager' | 'staff' | 'estoquista';
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // Product types
  export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    supplier: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductFormData {
    name: string;
    sku: string;
    description: string;
    category: string;
    price: number;
    costPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    supplier: string;
  }
  
  // Inventory types
  export interface InventoryTransaction {
    id: string;
    productId: string;
    productName: string;
    type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reason: string;
    performedBy: string;
    timestamp: string;
  }
  
  // Dashboard types
  export interface DashboardStats {
    totalProducts: number;
    lowStockItems: number;
    totalValue: number;
    recentTransactions: number;
  }
  
  export interface ChartData {
    name: string;
    value: number;
  }
  
  // Filters
  export interface ProductFilter {
    search: string;
    category: string;
    stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
    sortBy: 'name' | 'sku' | 'stock' | 'price';
    sortDirection: 'asc' | 'desc';
  }