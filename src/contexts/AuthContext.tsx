import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { emailVerificationService } from '@/services/emailVerificationService';
import { userProfileService } from '@/services/userProfileService';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  joinedDate: string;
  role?: 'customer' | 'business_owner';
  businessId?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'customer' | 'business_owner') => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<User, 'id' | 'email' | 'joinedDate' | 'role' | 'businessId' | 'emailVerified'>>) => Promise<void>;
  resendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
  isBusinessOwner: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes and real-time user profile updates
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Subscribe to real-time user profile updates
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const unsubscribeProfile = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUser({
                id: firebaseUser.uid,
                name: userData.name || firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                phone: userData.phone,
                location: userData.location,
                avatar: userData.avatar,
                joinedDate: userData.joinedDate,
                role: userData.role,
                businessId: userData.businessId,
                emailVerified: firebaseUser.emailVerified,
              });
            } else {
              // User exists in Firebase Auth but not in Firestore (shouldn't happen)
              setUser({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                joinedDate: new Date().toISOString(),
                role: 'customer',
                emailVerified: firebaseUser.emailVerified,
              });
            }
            setIsLoading(false);
          });

          return () => unsubscribeProfile();
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role: 'customer' | 'business_owner' = 'customer'
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Create user profile in Firestore
      const businessId = role === 'business_owner' ? `business_${Date.now()}` : undefined;
      const userProfileData = {
        name,
        email,
        phone: phone || '',
        location: '',
        avatar: '',
        joinedDate: new Date().toISOString(),
        role,
        emailVerified: false,
        verificationEmailSentAt: new Date().toISOString(),
        ...(businessId && { businessId }),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfileData);

      // Send verification email
      try {
        await emailVerificationService.sendVerificationEmail(firebaseUser);
      } catch (emailError) {
        console.warn('Email verification failed:', emailError);
      }

      // If business owner, create initial business profile
      if (role === 'business_owner' && businessId) {
        await setDoc(doc(db, 'businesses', businessId), {
          id: businessId,
          ownerId: firebaseUser.uid,
          name: '',
          phone: '',
          location: '',
          description: '',
          menu: [],
          orders: [],
          hours: [],
          notifications: [],
          media: [],
          blog: [],
          rating: 0,
          totalOrders: 0,
          createdAt: new Date().toISOString(),
        });
      }

      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (
    updates: Partial<Omit<User, 'id' | 'email' | 'joinedDate' | 'role' | 'businessId' | 'emailVerified'>>
  ): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setIsLoading(true);
      await userProfileService.updateUserProfile(user.id, updates);
      // The onSnapshot listener will automatically update the user state
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
    if (!user || !auth.currentUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return emailVerificationService.resendVerificationEmail(auth.currentUser);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserProfile,
    resendVerificationEmail,
    isAuthenticated: !!user,
    isBusinessOwner: user?.role === 'business_owner',
    isLoading,
    isEmailVerified: user?.emailVerified ?? false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

