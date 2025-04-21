import axios from 'axios';
import { 
  LoginCredentials, 
  User, 
  Product, 
  ProductFormData, 
  InventoryTransaction,
  DashboardStats,
  ProductFilter,
  ChartData
} from '../types';

// Extend ImportMeta interface to include env property
interface ImportMeta {
  env: {
    VITE_API_URL: string;
  };
}

// Create an axios instance with defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stockzy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // This would be replaced with a real API call
    console.log('Login attempt:', credentials);
    
    // Mock implementation for frontend demo
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock successful login for users
        if (credentials.username === 'admin' && credentials.password === 'password') {
          const user: User = {
            id: '1',
            username: credentials.username,
            name: 'Admin User',
            email: 'admin@stockzy.com',
            role: 'admin',
          };
          const token = `mock-jwt-token-${credentials.username}`;
          resolve({ user, token });
        } else if (credentials.username === 'dioney' && credentials.password === '123456') {
          const user: User = {
            id: '2',
            username: credentials.username,
            name: 'Dioney User',
            email: 'dioney@stockzy.com',
            role: 'admin',
          };
          const token = `mock-jwt-token-${credentials.username}`;
          resolve({ user, token });
        } else if (credentials.username === 'estoquista' && credentials.password === '123456') {
          const user: User = {
            id: '3',
            username: credentials.username,
            name: 'Estoquista User',
            email: 'estoquista@stockzy.com',
            role: 'estoquista',
          };
          const token = `mock-jwt-token-${credentials.username}`;
          resolve({ user, token });
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 800);
    });
  },

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('stockzy_token');
    localStorage.removeItem('stockzy_user');
    
    // In a real app, you would also call the backend to invalidate the token
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User> {
    // This would fetch the current user data from the API
    // For now, we'll retrieve from localStorage
    const userStr = localStorage.getItem('stockzy_user');
    if (!userStr) {
      throw new Error('User not found');
    }
    return JSON.parse(userStr);
  },
};

// Product services
export const productService = {
  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock products
        const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
          id: `p${i + 1}`,
          name: `Product ${i + 1}`,
          sku: `SKU-${1000 + i}`,
          description: `Description for product ${i + 1}`,
          category: i % 3 === 0 ? 'Electronics' : i % 3 === 1 ? 'Office Supplies' : 'Furniture',
          price: Math.round(50 + Math.random() * 950),
          costPrice: Math.round(30 + Math.random() * 500),
          stockQuantity: Math.round(Math.random() * 100),
          minStockLevel: 10,
          supplier: `Supplier ${(i % 5) + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        }));
        
        let filteredProducts = [...mockProducts];
        
        // Apply filters if provided
        if (filters) {
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
              p.name.toLowerCase().includes(searchLower) || 
              p.sku.toLowerCase().includes(searchLower) ||
              p.description.toLowerCase().includes(searchLower)
            );
          }
          
          if (filters.category) {
            filteredProducts = filteredProducts.filter(p => 
              p.category === filters.category
            );
          }
          
          if (filters.stockStatus !== 'all') {
            filteredProducts = filteredProducts.filter(p => {
              if (filters.stockStatus === 'out-of-stock') return p.stockQuantity === 0;
              if (filters.stockStatus === 'low-stock') return p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel;
              if (filters.stockStatus === 'in-stock') return p.stockQuantity > p.minStockLevel;
              return true;
            });
          }
          
          // Sorting
          filteredProducts.sort((a, b) => {
            const sortOrder = filters.sortDirection === 'asc' ? 1 : -1;
            
            switch (filters.sortBy) {
              case 'name':
                return sortOrder * a.name.localeCompare(b.name);
              case 'sku':
                return sortOrder * a.sku.localeCompare(b.sku);
              case 'stock':
                return sortOrder * (a.stockQuantity - b.stockQuantity);
              case 'price':
                return sortOrder * (a.price - b.price);
              default:
                return 0;
            }
          });
        }
        
        resolve(filteredProducts);
      }, 500);
    });
  },

  async getProductById(id: string): Promise<Product> {
    // This would be replaced with a real API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Generate a mock product
        if (!id) {
          reject(new Error('Product ID is required'));
          return;
        }
        
        const mockProduct: Product = {
          id,
          name: `Product ${id}`,
          sku: `SKU-${id}`,
          description: `Detailed description for product ${id}`,
          category: 'Electronics',
          price: Math.round(50 + Math.random() * 950),
          costPrice: Math.round(30 + Math.random() * 500),
          stockQuantity: Math.round(Math.random() * 100),
          minStockLevel: 10,
          supplier: `Supplier ABC`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        };
        
        resolve(mockProduct);
      }, 300);
    });
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    // This would be replaced with a real API call
    console.log('Creating product:', data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          ...data,
          id: `new-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(newProduct);
      }, 500);
    });
  },

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    // This would be replaced with a real API call
    console.log(`Updating product ${id}:`, data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedProduct: Product = {
          ...data as any,
          id,
          name: data.name || `Product ${id}`,
          sku: data.sku || `SKU-${id}`,
          description: data.description || `Description for product ${id}`,
          category: data.category || 'Electronics',
          price: data.price || 100,
          costPrice: data.costPrice || 50,
          stockQuantity: data.stockQuantity !== undefined ? data.stockQuantity : 25,
          minStockLevel: data.minStockLevel || 10,
          supplier: data.supplier || 'Supplier XYZ',
          createdAt: new Date(Date.now() - 10000000000).toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(updatedProduct);
      }, 500);
    });
  },

  async deleteProduct(id: string): Promise<boolean> {
    // This would be replaced with a real API call
    console.log(`Deleting product ${id}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },
};

// Inventory services
export const inventoryService = {
  async getTransactions(): Promise<InventoryTransaction[]> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock transactions
        const mockTransactions: InventoryTransaction[] = Array.from({ length: 15 }, (_, i) => ({
          id: `t${i + 1}`,
          productId: `p${Math.round(Math.random() * 20)}`,
          productName: `Product ${Math.round(Math.random() * 20)}`,
          type: i % 3 === 0 ? 'in' : i % 3 === 1 ? 'out' : 'adjustment',
          quantity: Math.round(Math.random() * 30) * (i % 3 === 1 ? -1 : 1),
          reason: i % 3 === 0 ? 'Purchase' : i % 3 === 1 ? 'Sale' : 'Inventory count adjustment',
          performedBy: 'Admin User',
          timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        }));
        
        // Sort by most recent first
        mockTransactions.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        resolve(mockTransactions);
      }, 500);
    });
  },

  async createTransaction(data: Omit<InventoryTransaction, 'id' | 'timestamp'>): Promise<InventoryTransaction> {
    // This would be replaced with a real API call
    console.log('Creating transaction:', data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction: InventoryTransaction = {
          ...data,
          id: `new-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        resolve(newTransaction);
      }, 500);
    });
  },
};

// Dashboard services
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalProducts: 256,
          lowStockItems: 12,
          totalValue: 187250,
          recentTransactions: 42,
        });
      }, 500);
    });
  },

  async getTopProducts(): Promise<ChartData[]> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Laptops', value: 12000 },
          { name: 'Smartphones', value: 8000 },
          { name: 'Monitors', value: 5000 },
          { name: 'Printers', value: 3000 },
          { name: 'Headphones', value: 2000 },
        ]);
      }, 500);
    });
  },

  async getStockDistribution(): Promise<ChartData[]> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: 'Electronics', value: 45 },
          { name: 'Office Supplies', value: 30 },
          { name: 'Furniture', value: 25 },
        ]);
      }, 500);
    });
  },

  async getInventoryHistory(): Promise<{date: string; in: number; out: number}[]> {
    // Mock implementation for frontend demo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate data for the last 7 days
        const data: { date: string; in: number; out: number }[] = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          data.push({
            date: date.toISOString().split('T')[0],
            in: Math.round(Math.random() * 50) + 10,
            out: Math.round(Math.random() * 40) + 5,
          });
        }
        
        resolve(data);
      }, 500);
    });
  },
};

export default api;