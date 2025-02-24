import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  bucket?: string;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  onUploadComplete,
  bucket = 'documents',
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFileTypes = ['application/pdf', 'image/*'],
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      if (file.size > maxSize) {
        setError(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        onUploadComplete?.(publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, maxSize, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the file here</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-8 w-8 text-muted-foreground/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-sm text-muted-foreground">
                <p>Drag and drop your file here, or click to select</p>
                <p className="text-xs mt-1">
                  Maximum file size: {maxSize / (1024 * 1024)}MB
                </p>
              </div>
            </div>
            <Button variant="outline" type="button">
              Select File
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-destructive">{error}</div>
      )}
    </div>
  );
} 