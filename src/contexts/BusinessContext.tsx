import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string[];
  totalPrice: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  notes?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface Notification {
  id: string;
  type: 'order' | 'review' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Business {
  id: string;
  name: string;
  phone: string;
  location: string;
  description: string;
  menu: MenuItem[];
  orders: Order[];
  hours: BusinessHours[];
  notifications: Notification[];
  rating: number;
  totalOrders: number;
}

interface BusinessContextType {
  business: Business | null;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateBusinessHours: (hours: BusinessHours[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);

  // Load business from localStorage on mount
  useEffect(() => {
    const storedBusiness = localStorage.getItem('tastelocal_business');
    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
    }
  }, []);

  const saveBusiness = (updatedBusiness: Business) => {
    setBusiness(updatedBusiness);
    localStorage.setItem('tastelocal_business', JSON.stringify(updatedBusiness));
  };

  const addMenuItem = (item: MenuItem) => {
    if (!business) return;
    const updated = {
      ...business,
      menu: [...business.menu, item],
    };
    saveBusiness(updated);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    if (!business) return;
    const updated = {
      ...business,
      menu: business.menu.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    };
    saveBusiness(updated);
  };

  const deleteMenuItem = (id: string) => {
    if (!business) return;
    const updated = {
      ...business,
      menu: business.menu.filter((item) => item.id !== id),
    };
    saveBusiness(updated);
  };

  const addOrder = (order: Order) => {
    if (!business) return;
    const updated = {
      ...business,
      orders: [order, ...business.orders],
      totalOrders: business.totalOrders + 1,
    };
    saveBusiness(updated);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!business) return;
    const updated = {
      ...business,
      orders: business.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    };
    saveBusiness(updated);
  };

  const updateBusinessHours = (hours: BusinessHours[]) => {
    if (!business) return;
    const updated = {
      ...business,
      hours,
    };
    saveBusiness(updated);
  };

  const addNotification = (notification: Notification) => {
    if (!business) return;
    const updated = {
      ...business,
      notifications: [notification, ...business.notifications],
    };
    saveBusiness(updated);
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (!business) return;
    const updated = {
      ...business,
      notifications: business.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    };
    saveBusiness(updated);
  };

  const getUnreadNotifications = () => {
    return business?.notifications.filter((n) => !n.read) || [];
  };

  const value = {
    business,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addOrder,
    updateOrderStatus,
    updateBusinessHours,
    addNotification,
    markNotificationAsRead,
    getUnreadNotifications,
  };

  return (
    <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
  );
};

