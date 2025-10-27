import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
  },

  async getById(id: string): Promise<Business | null> {
    const docRef = doc(db, 'businesses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Business : null;
  },

  async create(business: Omit<Business, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'businesses'), business);
    return docRef.id;
  }
};