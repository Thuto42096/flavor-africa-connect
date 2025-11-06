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

// Helper function to recursively remove undefined values
const removeUndefinedValues = (obj: any): any => {
  if (obj === null) {
    return null; // Keep null values, only remove undefined
  }

  if (obj === undefined) {
    return undefined;
  }

  if (Array.isArray(obj)) {
    // Map each item and remove undefined items, but keep null items
    return obj
      .map(item => removeUndefinedValues(item))
      .filter(item => item !== undefined);
  }

  if (typeof obj === 'object' && obj !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeUndefinedValues(value);
      // Only add the key if the value is not undefined
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }

  return obj;
};

export const firestoreBusinessService = {
  // Get all businesses
  async getAllBusinesses(): Promise<Business[]> {
    try {
      const snapshot = await getDocs(collection(db, 'businesses'));
      // Filter out invalid documents (documents without a name or with id 'Businesses')
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Business))
        .filter(business => {
          // Filter out documents that don't have a name or have invalid IDs
          const hasValidName = business.name && business.name.trim() !== '';
          const hasValidId = business.id !== 'Businesses' && business.id !== 'businesses';
          return hasValidName && hasValidId;
        });
    } catch (error) {
      console.error('Error getting all businesses:', error);
      return [];
    }
  },

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
      // Recursively remove undefined values to prevent Firebase errors
      const cleanedUpdates = removeUndefinedValues(updates);

      // Log the cleaned updates for debugging
      console.log('Cleaned updates:', cleanedUpdates);

      // Verify no undefined values remain
      const hasUndefined = JSON.stringify(cleanedUpdates).includes('undefined');
      if (hasUndefined) {
        console.warn('Warning: Cleaned updates still contain undefined values');
      }

      await updateDoc(docRef, cleanedUpdates);
    } catch (error) {
      console.error('Error updating business:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
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

