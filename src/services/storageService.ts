import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const storageService = {
  /**
   * Upload image to Firebase Storage
   * @param file - Image file to upload
   * @param path - Storage path (e.g., 'businesses/business_id/menu')
   * @param onProgress - Callback for upload progress
   */
  async uploadImage(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { success: false, error: 'File size must be less than 5MB' };
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
      }

      // Create unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      };
    }
  },

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: File[],
    path: string
  ): Promise<UploadResult[]> {
    const results = await Promise.all(
      files.map((file) => this.uploadImage(file, path))
    );
    return results;
  },

  /**
   * Delete image from Firebase Storage
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract path from URL
      const urlParts = imageUrl.split('/o/')[1];
      if (!urlParts) {
        console.error('Invalid image URL');
        return false;
      }

      const decodedPath = decodeURIComponent(urlParts.split('?')[0]);
      const imageRef = ref(storage, decodedPath);

      await deleteObject(imageRef);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },

  /**
   * Get all images in a folder
   */
  async listImages(path: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, path);
      const result = await listAll(folderRef);

      const urls = await Promise.all(
        result.items.map((item) => getDownloadURL(item))
      );

      return urls;
    } catch (error) {
      console.error('Error listing images:', error);
      return [];
    }
  },

  /**
   * Convert file to base64 (for preview)
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  /**
   * Validate image file
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
    }

    return { valid: true };
  },

  /**
   * Get file size in MB
   */
  getFileSizeInMB(file: File): number {
    return file.size / (1024 * 1024);
  },

  /**
   * Compress image before upload (optional)
   */
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
      };
    });
  },
};

