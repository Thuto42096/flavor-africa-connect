import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { User } from '@/contexts/AuthContext';

/**
 * Service for managing user profile updates
 */
export const userProfileService = {
  /**
   * Update user profile in both Firebase Auth and Firestore
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<Omit<User, 'id' | 'email' | 'joinedDate' | 'role' | 'businessId' | 'emailVerified'>>
  ): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update Firebase Auth display name if name is being updated
      if (updates.name) {
        await updateProfile(currentUser, {
          displayName: updates.name,
        });
      }

      // Clean updates to remove undefined values
      const cleanedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      // Update Firestore user document
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, cleanedUpdates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Update user avatar
   */
  async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { avatar: avatarUrl });
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw error;
    }
  },

  /**
   * Update user phone number
   */
  async updateUserPhone(userId: string, phone: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { phone });
    } catch (error) {
      console.error('Error updating user phone:', error);
      throw error;
    }
  },

  /**
   * Update user location
   */
  async updateUserLocation(userId: string, location: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { location });
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  },
};

