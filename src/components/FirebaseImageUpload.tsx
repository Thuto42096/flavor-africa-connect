import { useState, useRef } from 'react';
import { Upload, X, Loader, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { storageService } from '@/services/storageService';

interface FirebaseImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImage?: string;
  label?: string;
  storagePath: string; // e.g., 'businesses/business_id/menu'
  maxSizeMB?: number;
}

const FirebaseImageUpload = ({
  onImageSelect,
  currentImage,
  label = 'Upload Image',
  storagePath,
  maxSizeMB = 5,
}: FirebaseImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = storageService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const previewUrl = e.target?.result as string;
        setPreview(previewUrl);

        // Upload to Firebase Storage
        const result = await storageService.uploadImage(file, storagePath);

        if (result.success && result.url) {
          onImageSelect(result.url);
          toast.success('Image uploaded successfully! 📸');
          setUploadProgress(100);
        } else {
          toast.error(result.error || 'Failed to upload image');
          setPreview(undefined);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload image');
      setPreview(undefined);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    if (currentImage && currentImage.includes('firebasestorage')) {
      try {
        await storageService.deleteImage(currentImage);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setPreview(undefined);
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Image removed');
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-2">
        {label}
        <Cloud className="h-4 w-4 text-blue-500" />
      </label>

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-primary/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {currentImage?.includes('firebasestorage') && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Cloud className="h-3 w-3" />
                Stored in Firebase Storage
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30 ${
            isLoading
              ? 'border-muted-foreground/20 opacity-50'
              : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="h-8 w-8 text-primary mb-2 animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Uploading to Firebase...
              </p>
              {uploadProgress > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{uploadProgress}%</p>
              )}
            </>
          ) : (
            <>
              <Cloud className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max {maxSizeMB}MB (JPEG, PNG, WebP, GIF)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isLoading}
        className="hidden"
      />
    </div>
  );
};

export default FirebaseImageUpload;

