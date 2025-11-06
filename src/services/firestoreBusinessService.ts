import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Business,
  MenuItem,
  Order,
  BusinessHours,
  Notification,
  MediaItem,
  BlogPost,
} from '@/contexts/BusinessContext';

export const firestoreBusinessService = {
  // Get business by ID
  async getBusiness(businessId: string): Promise<Business | null> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as Business) : null;
    } catch (error) {
      console.error('Error getting business:', error);
      return null;
    }
  },

  // Get business by owner ID
  async getBusinessByOwnerId(ownerId: string): Promise<Business | null> {
    try {
      const q = query(collection(db, 'businesses'), where('ownerId', '==', ownerId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      return querySnapshot.docs[0].data() as Business;
    } catch (error) {
      console.error('Error getting business by owner:', error);
      return null;
    }
  },

  // Subscribe to real-time business updates
  subscribeToBusiness(businessId: string, callback: (business: Business | null) => void): Unsubscribe {
    const docRef = doc(db, 'businesses', businessId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Business);
      } else {
        callback(null);
      }
    });
  },

  // Update business
  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      // Filter out undefined values to prevent Firebase errors
      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value !== undefined)
      );
      await updateDoc(docRef, cleanedUpdates);
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },

  // Update menu items
  async updateMenuItems(businessId: string, menu: MenuItem[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { menu });
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  },

  // Update orders
  async updateOrders(businessId: string, orders: Order[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { orders });
    } catch (error) {
      console.error('Error updating orders:', error);
      throw error;
    }
  },

  // Update business hours
  async updateBusinessHours(businessId: string, hours: BusinessHours[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { hours });
    } catch (error) {
      console.error('Error updating hours:', error);
      throw error;
    }
  },

  // Update notifications
  async updateNotifications(businessId: string, notifications: Notification[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { notifications });
    } catch (error) {
      console.error('Error updating notifications:', error);
      throw error;
    }
  },

  // Update media items
  async updateMediaItems(businessId: string, media: MediaItem[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { media });
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  },

  // Update blog posts
  async updateBlogPosts(businessId: string, blog: BlogPost[]): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { blog });
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Update total orders count
  async updateTotalOrders(businessId: string, totalOrders: number): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { totalOrders });
    } catch (error) {
      console.error('Error updating total orders:', error);
      throw error;
    }
  },

  // Update rating
  async updateRating(businessId: string, rating: number): Promise<void> {
    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, { rating });
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  },
};

