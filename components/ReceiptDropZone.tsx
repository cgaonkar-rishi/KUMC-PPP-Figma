import { useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
}

interface ReceiptDropZoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  itemId: string;
}

export function ReceiptDropZone({ files, onFilesChange, itemId }: ReceiptDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString()
    }));

    onFilesChange([...files, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    onFilesChange(files.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-2">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
          isDragging 
            ? 'border-ku-blue bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="text-center">
            <Upload className={`h-6 w-6 mx-auto mb-2 ${isDragging ? 'text-ku-blue' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600">
              {isDragging ? (
                <span className="font-medium text-ku-blue">Drop files here</span>
              ) : (
                <>
                  <span className="font-medium text-ku-blue">Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG, GIF (multiple files allowed)</p>
          </div>
        </label>
      </div>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">{files.length} file(s) uploaded:</p>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-xs group hover:bg-gray-100"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(file.name)}
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-gray-500 text-xs whitespace-nowrap">({formatFileSize(file.size)})</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove file"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
