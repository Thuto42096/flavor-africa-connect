import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { firestoreBusinessService } from '@/services/firestoreBusinessService';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  image?: string; // Base64 encoded image or Firebase Storage URL
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

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  description: string;
  url: string; // Base64, Firebase Storage URL for photos, or YouTube/Vimeo URL for videos
  thumbnail?: string; // For videos
  uploadedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string; // Base64 encoded image or Firebase Storage URL
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  location: string;
  description: string;
  menu: MenuItem[];
  orders: Order[];
  hours: BusinessHours[];
  notifications: Notification[];
  media: MediaItem[];
  blog: BlogPost[];
  rating: number;
  totalOrders: number;
  createdAt?: string;
}

interface BusinessContextType {
  business: Business | null;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateBusinessHours: (hours: BusinessHours[]) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: () => Notification[];
  addMediaItem: (media: MediaItem) => void;
  deleteMediaItem: (mediaId: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (postId: string, post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load business from Firestore on mount
  useEffect(() => {
    if (!user?.businessId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = firestoreBusinessService.subscribeToBusiness(
      user.businessId,
      (businessData) => {
        setBusiness(businessData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.businessId]);

  const saveBusiness = async (updatedBusiness: Business) => {
    if (!updatedBusiness.id) return;
    try {
      setBusiness(updatedBusiness);
      await firestoreBusinessService.updateBusiness(updatedBusiness.id, updatedBusiness);
    } catch (error) {
      console.error('Error saving business:', error);
    }
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

  const updateBusinessHours = async (hours: BusinessHours[]) => {
    if (!business) {
      throw new Error('No business found');
    }
    const updated = {
      ...business,
      hours,
    };
    await saveBusiness(updated);
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

  // Media Management Functions
  const addMediaItem = (media: MediaItem) => {
    if (!business) return;
    const updated = {
      ...business,
      media: [media, ...business.media],
    };
    saveBusiness(updated);
  };

  const deleteMediaItem = (mediaId: string) => {
    if (!business) return;
    const updated = {
      ...business,
      media: business.media.filter((item) => item.id !== mediaId),
    };
    saveBusiness(updated);
  };

  // Blog Management Functions
  const addBlogPost = (post: BlogPost) => {
    if (!business) return;
    const updated = {
      ...business,
      blog: [post, ...business.blog],
    };
    saveBusiness(updated);
  };

  const updateBlogPost = (postId: string, post: BlogPost) => {
    if (!business) return;
    const updated = {
      ...business,
      blog: business.blog.map((p) => (p.id === postId ? post : p)),
    };
    saveBusiness(updated);
  };

  const deleteBlogPost = (postId: string) => {
    if (!business) return;
    const updated = {
      ...business,
      blog: business.blog.filter((p) => p.id !== postId),
    };
    saveBusiness(updated);
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
    addMediaItem,
    deleteMediaItem,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
  };

  return (
    <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
  );
};

