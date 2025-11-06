import { useState, useRef } from 'react';
import { X, Loader, Cloud } from 'lucide-react';
import { toast } from 'sonner';
import { storageService } from '@/services/storageService';

interface FirebaseImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImage?: string;
  label?: string;
  storagePath?: string; // e.g., 'businesses/business_id/menu' (kept for backwards compatibility)
  maxSizeMB?: number;
}

const FirebaseImageUpload = ({
  onImageSelect,
  currentImage,
  label = 'Upload Image',
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
      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Url = e.target?.result as string;
        setPreview(base64Url);

        // Use base64 directly instead of uploading to Firebase Storage
        // This avoids CORS issues
        onImageSelect(base64Url);
        toast.success('Image selected! 📸');
        setUploadProgress(100);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to process image');
      setPreview(undefined);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
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

          {currentImage && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                <Cloud className="h-3 w-3" />
                Image stored locally
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
                Processing image...
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

