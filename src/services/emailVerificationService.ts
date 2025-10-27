import {
  sendEmailVerification,
  User as FirebaseUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface EmailVerificationStatus {
  isVerified: boolean;
  verificationSentAt?: string;
  lastVerificationEmail?: string;
}

export const emailVerificationService = {
  /**
   * Send email verification to user
   */
  async sendVerificationEmail(user: FirebaseUser): Promise<boolean> {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      };

      await sendEmailVerification(user, actionCodeSettings);

      // Update user profile in Firestore with verification email sent timestamp
      await updateDoc(doc(db, 'users', user.uid), {
        verificationEmailSentAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  },

  /**
   * Check if user's email is verified
   */
  isEmailVerified(user: FirebaseUser | null): boolean {
    return user?.emailVerified ?? false;
  },

  /**
   * Get email verification status from Firestore
   */
  async getVerificationStatus(userId: string): Promise<EmailVerificationStatus> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        return { isVerified: false };
      }

      const data = userDoc.data();
      return {
        isVerified: data.emailVerified || false,
        verificationSentAt: data.verificationEmailSentAt,
        lastVerificationEmail: data.lastVerificationEmail,
      };
    } catch (error) {
      console.error('Error getting verification status:', error);
      return { isVerified: false };
    }
  },

  /**
   * Update verification status in Firestore
   */
  async updateVerificationStatus(userId: string, isVerified: boolean): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        emailVerified: isVerified,
        emailVerifiedAt: isVerified ? new Date().toISOString() : null,
      });
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw error;
    }
  },

  /**
   * Resend verification email with rate limiting
   */
  async resendVerificationEmail(user: FirebaseUser): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already verified
      if (user.emailVerified) {
        return {
          success: false,
          message: 'Email is already verified',
        };
      }

      // Get verification status from Firestore
      const status = await this.getVerificationStatus(user.uid);

      // Check if verification email was sent recently (within 1 minute)
      if (status.verificationSentAt) {
        const lastSentTime = new Date(status.verificationSentAt).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - lastSentTime) / 1000 / 60; // in minutes

        if (timeDifference < 1) {
          return {
            success: false,
            message: `Please wait ${Math.ceil(1 - timeDifference)} minute(s) before requesting another verification email`,
          };
        }
      }

      // Send verification email
      const sent = await this.sendVerificationEmail(user);
      if (sent) {
        return {
          success: true,
          message: 'Verification email sent successfully',
        };
      } else {
        return {
          success: false,
          message: 'Failed to send verification email',
        };
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      return {
        success: false,
        message: 'An error occurred while sending verification email',
      };
    }
  },

  /**
   * Check if email verification is required
   */
  shouldRequireEmailVerification(): boolean {
    // You can make this configurable based on environment or user role
    return true;
  },

  /**
   * Get verification email message
   */
  getVerificationMessage(email: string): string {
    return `A verification email has been sent to ${email}. Please check your inbox and click the verification link to complete your registration.`;
  },
};

