import React, { useState } from 'react';
import { UploadCloud, CheckCircle, FileText, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const FileUpload = ({
  label,
  description,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  initialFile = null,
  onFileChange,
  required = false
}) => {
  const [file, setFile] = useState(initialFile);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setUploading(true);
      // Simulate mock upload
      setTimeout(() => {
        const mockFileData = {
          name: selected.name,
          size: `${(selected.size / (1024 * 1024)).toFixed(1)} MB`,
          type: selected.type,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'VERIFIED'
        };
        setFile(mockFileData);
        setUploading(false);
        if (onFileChange) onFileChange(mockFileData);
      }, 600);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (onFileChange) onFileChange(null);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-slate-800">
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        {file && (
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3" /> Ready
          </Badge>
        )}
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/30 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
          <UploadCloud className="w-7 h-7 text-slate-400 mb-1.5" />
          <span className="text-xs font-semibold text-blue-700">
            {uploading ? 'Processing file...' : 'Click to upload document'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Supported formats: PDF, JPG, PNG (Max {maxSizeMB}MB)
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                {file.name}
              </p>
              <p className="text-[11px] text-slate-500">
                {file.size} • Uploaded today (Demo Mode)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
