import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { compressImage, formatFileSize, CompressionOptions } from '@/utils/imageCompression';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage?: string;
  label?: string;
  maxSizeMB?: number;
  compressionOptions?: CompressionOptions;
}

const ImageUpload = ({
  onImageSelect,
  currentImage,
  label = 'Upload Image',
  maxSizeMB = 5,
  compressionOptions,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isLoading, setIsLoading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;

          // Compress the image
          const result = await compressImage(base64String, {
            maxSizeMB,
            ...compressionOptions,
          });

          setPreview(result.base64);
          setCompressionInfo({
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            ratio: result.compressionRatio,
          });

          onImageSelect(result.base64);

          toast.success(
            `Image compressed! 📸\n${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (${result.compressionRatio.toFixed(1)}% smaller)`
          );
        } catch (error) {
          toast.error('Failed to compress image');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    setCompressionInfo(null);
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Image removed');
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

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
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {compressionInfo && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-2">
                ✨ Image Compressed Successfully!
              </p>
              <div className="space-y-1 text-xs text-green-800 dark:text-green-200">
                <p>
                  <span className="font-medium">Original:</span> {formatFileSize(compressionInfo.originalSize)}
                </p>
                <p>
                  <span className="font-medium">Compressed:</span> {formatFileSize(compressionInfo.compressedSize)}
                </p>
                <p>
                  <span className="font-medium">Saved:</span> {compressionInfo.ratio.toFixed(1)}%
                </p>
              </div>
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
              <p className="text-sm font-medium text-muted-foreground">Compressing image...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Click to upload image</p>
              <p className="text-xs text-muted-foreground mt-1">Max {maxSizeMB}MB (auto-compressed)</p>
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

export default ImageUpload;

