'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'يُسمح فقط بملفات JPG و PNG و WEBP';
    if (file.size > MAX_SIZE) return 'حجم الملف يجب أن لا يتجاوز 10 ميجابايت';
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setSelectedFile(file);
    onChange(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
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
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(value || null);
    setSelectedFile(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="ora-label">صورة المنتج</label>

      {preview ? (
        <div className="ora-upload-preview">
          <img src={preview} alt="صورة المنتج" />
          <div className="ora-upload-preview-actions">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="ora-upload-preview-btn"
              title="تغيير الصورة"
            >
              <FiImage className="w-4 h-4 text-rich-black" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="ora-upload-preview-btn"
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
          className={`ora-file-upload ${isDragging ? 'dragging' : ''}`}
        >
          <div className="flex flex-col items-center gap-3">
            <div>
              <FiUpload className="ora-file-upload-icon" />
            </div>
            <p className="ora-file-upload-text">اضغط لاختيار صورة</p>
            <p className="ora-file-upload-hint">أو اسحب وأفلت الصورة هنا</p>
            <p className="ora-file-upload-formats">JPG, PNG, WEBP - حد أقصى 10 MB</p>
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
