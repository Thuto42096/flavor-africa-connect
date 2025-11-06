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
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateBusinessHours: (hours: BusinessHours[]) => Promise<void>;
  addNotification: (notification: Notification) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  getUnreadNotifications: () => Notification[];
  addMediaItem: (media: MediaItem) => Promise<void>;
  deleteMediaItem: (mediaId: string) => Promise<void>;
  addBlogPost: (post: BlogPost) => Promise<void>;
  updateBlogPost: (postId: string, post: BlogPost) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;
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
      // Update Firebase first, then update local state on success
      await firestoreBusinessService.updateBusiness(updatedBusiness.id, updatedBusiness);
      setBusiness(updatedBusiness);
    } catch (error) {
      console.error('Error saving business:', error);
      // Revert to previous state on error
      if (business) {
        setBusiness(business);
      }
      throw error;
    }
  };

  const addMenuItem = async (item: MenuItem) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      menu: [...business.menu, item],
    };
    await saveBusiness(updated);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      menu: business.menu.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    };
    await saveBusiness(updated);
  };

  const deleteMenuItem = async (id: string) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      menu: business.menu.filter((item) => item.id !== id),
    };
    await saveBusiness(updated);
  };

  const addOrder = async (order: Order) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      orders: [order, ...business.orders],
      totalOrders: business.totalOrders + 1,
    };
    await saveBusiness(updated);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      orders: business.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    };
    await saveBusiness(updated);
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

  const addNotification = async (notification: Notification) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      notifications: [notification, ...business.notifications],
    };
    await saveBusiness(updated);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      notifications: business.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    };
    await saveBusiness(updated);
  };

  const getUnreadNotifications = () => {
    return business?.notifications.filter((n) => !n.read) || [];
  };

  // Media Management Functions
  const addMediaItem = async (media: MediaItem) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      media: [media, ...business.media],
    };
    await saveBusiness(updated);
  };

  const deleteMediaItem = async (mediaId: string) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      media: business.media.filter((item) => item.id !== mediaId),
    };
    await saveBusiness(updated);
  };

  // Blog Management Functions
  const addBlogPost = async (post: BlogPost) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      blog: [post, ...business.blog],
    };
    await saveBusiness(updated);
  };

  const updateBlogPost = async (postId: string, post: BlogPost) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      blog: business.blog.map((p) => (p.id === postId ? post : p)),
    };
    await saveBusiness(updated);
  };

  const deleteBlogPost = async (postId: string) => {
    if (!business) throw new Error('No business found');
    const updated = {
      ...business,
      blog: business.blog.filter((p) => p.id !== postId),
    };
    await saveBusiness(updated);
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

