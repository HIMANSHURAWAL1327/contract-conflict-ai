import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from './utils';

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, file, onFileSelect, className }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Removed strict accept to allow "all files" as requested by user
    multiple: false
  } as any);

  if (file) {
    return (
      <div className={cn("relative p-6 border-2 border-primary/30 rounded-2xl bg-black/20 backdrop-blur-md flex items-center gap-4 shadow-lg shadow-primary/5 group transition-all hover:bg-black/40", className)}>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate text-primary">{file.name}</p>
          <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button 
          onClick={() => onFileSelect(null)}
          className="p-2 hover:bg-destructive/10 rounded-xl text-destructive transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative p-10 border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-center group overflow-hidden",
        isDragActive 
          ? "border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/20" 
          : "border-primary/20 hover:border-primary/50 hover:bg-black/20 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <input {...getInputProps()} />
      <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform relative z-10">
        <Upload className="w-8 h-8" />
      </div>
      <div className="relative z-10">
        <p className="text-base font-bold text-primary">{label}</p>
        <p className="text-xs text-muted-foreground mt-2 font-medium">
          {isDragActive ? "Release to analyze" : "Drag & drop or click to upload"}
        </p>
      </div>
    </div>
  );
};
