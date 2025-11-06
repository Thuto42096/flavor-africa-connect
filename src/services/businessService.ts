import { collection, getDocs, addDoc, doc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Business {
  id?: string;
  name: string;
  image: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  distance: string;
}

export const businessService = {
  async getAll(): Promise<Business[]> {
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
  },

  // Subscribe to real-time updates of all businesses
  subscribeToAllBusinesses(callback: (businesses: Business[]) => void): Unsubscribe {
    return onSnapshot(collection(db, 'businesses'), (snapshot) => {
      // Filter out invalid documents (documents without a name or with id 'Businesses')
      const businesses = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Business))
        .filter(business => {
          // Filter out documents that don't have a name or have invalid IDs
          const hasValidName = business.name && business.name.trim() !== '';
          const hasValidId = business.id !== 'Businesses' && business.id !== 'businesses';
          return hasValidName && hasValidId;
        });
      callback(businesses);
    });
  },

  async getById(id: string): Promise<Business | null> {
    const docRef = doc(db, 'businesses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Business : null;
  },

  // Subscribe to real-time updates of a single business
  subscribeToBusinessById(id: string, callback: (business: Business | null) => void): Unsubscribe {
    const docRef = doc(db, 'businesses', id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Business);
      } else {
        callback(null);
      }
    });
  },

  async create(business: Omit<Business, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'businesses'), business);
    return docRef.id;
  }
};