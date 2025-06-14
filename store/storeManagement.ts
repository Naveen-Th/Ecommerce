import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '../components/stores/ProductCard';
import {
    createProduct,
    createStore,
    deleteProduct,
    getProductsByStoreId,
    getStoreByOwnerId,
    getStoreOrders,
    toggleProductStatus,
    updateOrderStatus,
    updateProduct,
    updateStore,
} from '../utils/supabase';

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  category: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  rating: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  store_id: string;
  delivery_partner_id?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    phone?: string;
  };
  order_items?: {
    id: string;
    quantity: number;
    price: number;
    total: number;
    products: {
      name: string;
      price: number;
    };
  }[];
}

interface StoreState {
  // Store data
  currentStore: Store | null;
  isLoadingStore: boolean;
  storeError: string | null;

  // Products data
  products: Product[];
  isLoadingProducts: boolean;
  productsError: string | null;

  // Orders data
  orders: Order[];
  isLoadingOrders: boolean;
  ordersError: string | null;

  // UI state
  selectedProduct: Product | null;
  isProductModalVisible: boolean;

  // Store actions
  setCurrentStore: (store: Store | null) => void;
  fetchStore: (ownerId: string) => Promise<void>;
  createNewStore: (storeData: Omit<Store, 'id' | 'owner_id' | 'is_active' | 'rating' | 'total_orders' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateCurrentStore: (updates: Partial<Store>) => Promise<boolean>;

  // Product actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setProductModalVisible: (visible: boolean) => void;
  fetchProducts: (storeId: string) => Promise<void>;
  addProduct: (storeId: string, productData: Omit<Product, 'id' | 'store_id' | 'is_active' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  editProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  removeProduct: (productId: string) => Promise<boolean>;
  toggleProductActive: (productId: string, isActive: boolean) => Promise<boolean>;

  // Order actions
  setOrders: (orders: Order[]) => void;
  fetchOrders: (storeId: string) => Promise<void>;
  updateOrderStatusAction: (orderId: string, status: string) => Promise<boolean>;

  // Clear functions
  clearStore: () => void;
  clearProducts: () => void;
  clearOrders: () => void;
  clearAll: () => void;
}

export const useStoreManagement = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStore: null,
      isLoadingStore: false,
      storeError: null,

      products: [],
      isLoadingProducts: false,
      productsError: null,

      orders: [],
      isLoadingOrders: false,
      ordersError: null,

      selectedProduct: null,
      isProductModalVisible: false,

      // Store actions
      setCurrentStore: (store) => set({ currentStore: store }),

      fetchStore: async (ownerId: string) => {
        set({ isLoadingStore: true, storeError: null });
        try {
          const { data, error } = await getStoreByOwnerId(ownerId);
          if (error) throw error;
          set({ currentStore: data, isLoadingStore: false });
        } catch (error) {
          set({ 
            storeError: error instanceof Error ? error.message : 'Failed to fetch store',
            isLoadingStore: false 
          });
        }
      },

      createNewStore: async (storeData) => {
        set({ isLoadingStore: true, storeError: null });
        try {
          const { data, error } = await createStore(storeData);
          if (error) throw error;
          if (data && data[0]) {
            set({ currentStore: data[0], isLoadingStore: false });
            return true;
          }
          throw new Error('No store data returned');
        } catch (error) {
          set({ 
            storeError: error instanceof Error ? error.message : 'Failed to create store',
            isLoadingStore: false 
          });
          return false;
        }
      },

      updateCurrentStore: async (updates) => {
        const { currentStore } = get();
        if (!currentStore) return false;

        set({ isLoadingStore: true, storeError: null });
        try {
          const { data, error } = await updateStore(currentStore.id, updates);
          if (error) throw error;
          if (data && data[0]) {
            set({ currentStore: data[0], isLoadingStore: false });
            return true;
          }
          throw new Error('No store data returned');
        } catch (error) {
          set({ 
            storeError: error instanceof Error ? error.message : 'Failed to update store',
            isLoadingStore: false 
          });
          return false;
        }
      },

      // Product actions
      setProducts: (products) => set({ products }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setProductModalVisible: (visible) => set({ isProductModalVisible: visible }),

      fetchProducts: async (storeId: string) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
          const { data, error } = await getProductsByStoreId(storeId);
          if (error) throw error;
          set({ products: data || [], isLoadingProducts: false });
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to fetch products',
            isLoadingProducts: false 
          });
        }
      },

      addProduct: async (storeId: string, productData) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
          const { data, error } = await createProduct(storeId, productData);
          if (error) throw error;
          if (data && data[0]) {
            const { products } = get();
            set({ 
              products: [data[0], ...products],
              isLoadingProducts: false 
            });
            return true;
          }
          throw new Error('No product data returned');
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to add product',
            isLoadingProducts: false 
          });
          return false;
        }
      },

      editProduct: async (productId: string, updates) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
          const { data, error } = await updateProduct(productId, updates);
          if (error) throw error;
          if (data && data[0]) {
            const { products } = get();
            const updatedProducts = products.map(product => 
              product.id === productId ? data[0] : product
            );
            set({ 
              products: updatedProducts,
              isLoadingProducts: false 
            });
            return true;
          }
          throw new Error('No product data returned');
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to update product',
            isLoadingProducts: false 
          });
          return false;
        }
      },

      removeProduct: async (productId: string) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
          const { error } = await deleteProduct(productId);
          if (error) throw error;
          const { products } = get();
          const filteredProducts = products.filter(product => product.id !== productId);
          set({ 
            products: filteredProducts,
            isLoadingProducts: false 
          });
          return true;
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to delete product',
            isLoadingProducts: false 
          });
          return false;
        }
      },

      toggleProductActive: async (productId: string, isActive: boolean) => {
        set({ isLoadingProducts: true, productsError: null });
        try {
          const { data, error } = await toggleProductStatus(productId, isActive);
          if (error) throw error;
          if (data && data[0]) {
            const { products } = get();
            const updatedProducts = products.map(product => 
              product.id === productId ? data[0] : product
            );
            set({ 
              products: updatedProducts,
              isLoadingProducts: false 
            });
            return true;
          }
          throw new Error('No product data returned');
        } catch (error) {
          set({ 
            productsError: error instanceof Error ? error.message : 'Failed to toggle product status',
            isLoadingProducts: false 
          });
          return false;
        }
      },

      // Order actions
      setOrders: (orders) => set({ orders }),

      fetchOrders: async (storeId: string) => {
        set({ isLoadingOrders: true, ordersError: null });
        try {
          const { data, error } = await getStoreOrders(storeId);
          if (error) throw error;
          set({ orders: data || [], isLoadingOrders: false });
        } catch (error) {
          set({ 
            ordersError: error instanceof Error ? error.message : 'Failed to fetch orders',
            isLoadingOrders: false 
          });
        }
      },

      updateOrderStatusAction: async (orderId: string, status: string) => {
        set({ isLoadingOrders: true, ordersError: null });
        try {
          const { data, error } = await updateOrderStatus(orderId, status);
          if (error) throw error;
          if (data && data[0]) {
            const { orders } = get();
            const updatedOrders = orders.map(order => 
              order.id === orderId ? { ...order, status: status as any } : order
            );
            set({ 
              orders: updatedOrders,
              isLoadingOrders: false 
            });
            return true;
          }
          throw new Error('No order data returned');
        } catch (error) {
          set({ 
            ordersError: error instanceof Error ? error.message : 'Failed to update order status',
            isLoadingOrders: false 
          });
          return false;
        }
      },

      // Clear functions
      clearStore: () => set({ 
        currentStore: null, 
        isLoadingStore: false, 
        storeError: null 
      }),
      
      clearProducts: () => set({ 
        products: [], 
        isLoadingProducts: false, 
        productsError: null,
        selectedProduct: null,
        isProductModalVisible: false
      }),
      
      clearOrders: () => set({ 
        orders: [], 
        isLoadingOrders: false, 
        ordersError: null 
      }),
      
      clearAll: () => set({
        currentStore: null,
        isLoadingStore: false,
        storeError: null,
        products: [],
        isLoadingProducts: false,
        productsError: null,
        orders: [],
        isLoadingOrders: false,
        ordersError: null,
        selectedProduct: null,
        isProductModalVisible: false,
      }),
    }),
    {
      name: 'store-management-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        currentStore: state.currentStore,
        products: state.products,
      }),
    }
  )
);
