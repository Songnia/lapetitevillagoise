import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { menuItems as defaultMenuItems } from '@/lib/menu-data';
import type { MenuItem } from '@/lib/menu-data';

export type OrderStatus = 'NEW' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    whatsapp: string;
  };
  delivery: {
    neighborhood: string;
    landmark: string;
    monnaie: string;
    fee: number;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentRef?: string;
  paymentMethod: 'cod' | 'momo';
}

export interface AdminSettings {
  shopName: string;
  whatsappNumber: string;
  deliveryFeeDefault: number;
  isOpen: boolean;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  isGeniusPayEnabled: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'admin';
}

interface AdminState {
  orders: Order[];
  outOfStockItems: string[]; // item names
  menuItems: MenuItem[];
  settings: AdminSettings;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleStockStatus: (itemName: string) => void;
  deleteOrder: (orderId: string) => void;

  // Menu CRUD
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (oldName: string, updatedItem: MenuItem) => void;
  deleteMenuItem: (itemName: string) => void;

  // Settings
  updateSettings: (settings: Partial<AdminSettings>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      orders: [],
      outOfStockItems: [],
      menuItems: defaultMenuItems,
      settings: {
        shopName: 'La Petite Villagoise',
        whatsappNumber: '+237 6 56 12 34 56',
        deliveryFeeDefault: 1000,
        isOpen: true,
        instagramUrl: 'https://instagram.com/lapetitevillagoise',
        facebookUrl: 'https://facebook.com/lapetitevillagoise',
        address: 'Bonamoussadi, Douala, Cameroun',
        isGeniusPayEnabled: true,
      },

      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        // Test user check
        if (username === 'admin' && password === 'villagoise2024') {
          const user: User = { id: '1', username: 'admin', role: 'admin' };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      addOrder: (orderData) => set((state) => ({
        orders: [
          {
            ...orderData,
            id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            createdAt: new Date().toISOString(),
            status: 'NEW',
          },
          ...state.orders,
        ],
      })),

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        ),
      })),

      toggleStockStatus: (itemName) => set((state) => ({
        outOfStockItems: state.outOfStockItems.includes(itemName)
          ? state.outOfStockItems.filter((i) => i !== itemName)
          : [...state.outOfStockItems, itemName],
      })),

      deleteOrder: (orderId) => set((state) => ({
        orders: state.orders.filter((o) => o.id !== orderId),
      })),

      addMenuItem: (item) => set((state) => ({
        menuItems: [...state.menuItems, item]
      })),

      updateMenuItem: (oldName, updatedItem) => set((state) => ({
        menuItems: state.menuItems.map((item) => item.name === oldName ? updatedItem : item),
        outOfStockItems: state.outOfStockItems.map((name) => name === oldName ? updatedItem.name : name)
      })),

      deleteMenuItem: (itemName) => set((state) => ({
        menuItems: state.menuItems.filter((item) => item.name !== itemName),
        outOfStockItems: state.outOfStockItems.filter((name) => name !== itemName)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'lavillagoise-admin-storage',
    }
  )
);
