import { useRef, useState } from 'react';
import { Upload, X, File as FileIcon } from 'lucide-react';
import { isValidLogFile, formatFileSize } from '../utils/logDetection';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

export const FileUpload = ({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10 MB
  disabled = false
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndAddFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;

    setError(null);
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach(file => {
      // Check file count
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Check file type
      if (!isValidLogFile(file)) {
        errors.push(`${file.name}: Invalid file type. Use .log, .txt, .out, or .err`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max ${formatFileSize(maxSize)})`);
        return;
      }

      // Check for duplicates
      if (files.some(f => f.name === file.name && f.size === file.size)) {
        errors.push(`${file.name}: Already attached`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors[0]); // Show first error
      setTimeout(() => setError(null), 5000);
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndAddFiles(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {/* Drag and drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-3 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!disabled ? handleBrowse : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".log,.txt,.out,.err"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-1">
          <Upload className={`w-5 h-5 ${isDragging ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {isDragging ? (
              <span className="text-blue-600 dark:text-blue-400 font-medium">Drop log files here</span>
            ) : (
              <>
                Drop log files or <span className="text-blue-600 dark:text-blue-400 font-medium">browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Supports .log, .txt, .out, .err (max {formatFileSize(maxSize)})
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2">
          <p className="text-xs text-red-600 dark:text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Attached files list */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2 group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors flex-shrink-0"
                title="Remove file"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
