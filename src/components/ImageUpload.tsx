'use client';

import { useState, useRef, useCallback } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'يُسمح فقط بملفات JPG و PNG و WEBP';
    if (file.size > MAX_SIZE) return 'حجم الملف يجب أن لا يتجاوز 10 ميجابايت';
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل رفع الملف');
      }

      const data = await res.json();

      if (preview && preview.startsWith('/uploads/')) {
        const oldFilename = preview.split('/').pop();
        if (oldFilename) {
          fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: oldFilename }),
          }).catch(() => {});
        }
      }

      setPreview(data.url);
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل رفع الملف');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [preview]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    if (preview && preview.startsWith('/uploads/')) {
      const filename = preview.split('/').pop();
      if (filename) {
        fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename }),
        }).catch(() => {});
      }
    }
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1.5">صورة المنتج</label>

      {preview ? (
        <div className="relative bg-ivory-dark rounded-lg overflow-hidden border border-cream">
          <img
            src={preview}
            alt="صورة المنتج"
            className="w-full h-48 md:h-56 object-contain"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white/90 rounded-lg shadow hover:bg-white transition-colors"
              title="تغيير الصورة"
            >
              <FiImage className="w-4 h-4 text-rich-black" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white/90 rounded-lg shadow hover:bg-white transition-colors"
              title="حذف الصورة"
            >
              <FiX className="w-4 h-4 text-error" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-gold bg-gold/5'
              : 'border-light-gray hover:border-gold hover:bg-ivory'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`p-3 rounded-full ${isDragging ? 'bg-gold/10' : 'bg-ivory-dark'}`}>
              {uploading ? (
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiUpload className="w-8 h-8 text-warm-gray" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm text-rich-black">
                {uploading ? 'جاري الرفع...' : 'اضغط لاختيار صورة'}
              </p>
              <p className="text-xs text-warm-gray mt-1">
                أو اسحب وأفلت الصورة هنا
              </p>
            </div>
            <p className="text-[10px] text-warm-gray">JPG, PNG, WEBP - حد أقصى 10 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-error flex items-center gap-1 mt-1">{error}</p>
      )}
    </div>
  );
}
