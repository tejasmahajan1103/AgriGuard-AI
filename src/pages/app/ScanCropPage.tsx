import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, ScanLine, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { scanService } from '../../services/scanService';
import { getMockScanResult } from '../../data/mockResponses';
import type { UploadImageResult } from '../../types';

export default function ScanCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadImageResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadFile = async (f: File) => {
    // 1. Validate format
    const validation = scanService.validateImage(f);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Please select a valid JPEG, PNG, or WebP image.');
      return;
    }

    setUploadError(null);
    setUploadResult(null);
    setIsUploading(true);

    try {
      const result = await scanService.uploadImageToS3(f);
      setUploadResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image. Please check your connection and try again.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = useCallback((f: File) => {
    if (!f) return;

    // Validate format immediately
    const validation = scanService.validateImage(f);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Unsupported image format. Please select a JPEG, PNG, or WebP image.');
      setFile(null);
      setPreview(null);
      setUploadResult(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(f);
    setUploadError(null);
    setUploadResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);

    // Automatically initiate S3 upload with presigned URL
    uploadFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadResult(null);
    setUploadError(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const result = await getMockScanResult();
      // Store result and image in sessionStorage for the result page
      sessionStorage.setItem('lastScanResult', JSON.stringify(result));
      sessionStorage.setItem('lastScanImage', preview || '');
      if (uploadResult) {
        sessionStorage.setItem('lastScanUpload', JSON.stringify(uploadResult));
      }
      navigate('/app/scan/result/new');
    } catch {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Scan Crop</h1>
        <p className="text-slate-500">Upload a photo of your crop to get AI-powered disease analysis.</p>
      </div>

      <Card>
        {!preview ? (
          <div>
            {uploadError && (
              <div className="mb-4 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Image validation failed</p>
                  <p className="text-xs text-red-500 mt-0.5">{uploadError}</p>
                </div>
              </div>
            )}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50 scale-[1.02]'
                  : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {isDragging ? 'Drop your image here' : 'Upload Crop Image'}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Drag & drop an image here, or click to select
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ImageIcon className="w-3.5 h-3.5" />
                JPG, PNG, WEBP — Max 10MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={preview}
                alt="Crop preview"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <button
                onClick={handleRemove}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors cursor-pointer"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File info */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                    {file?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {file ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
              >
                Change
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Uploading Status */}
            {isUploading && (
              <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
                <div>
                  <p className="font-medium">Uploading crop image to AWS S3...</p>
                  <p className="text-xs text-blue-600 mt-0.5">Transferring image bytes to secure storage</p>
                </div>
              </div>
            )}

            {/* Upload Error Alert */}
            {uploadError && (
              <div className="flex items-start justify-between gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Upload Failed</p>
                    <p className="text-xs text-red-500 mt-0.5">{uploadError}</p>
                  </div>
                </div>
                <button
                  onClick={() => file && uploadFile(file)}
                  className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Upload Success State */}
            {uploadResult && (
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-emerald-900">Crop image uploaded successfully to S3.</p>
                  <p className="text-xs text-emerald-700 mt-0.5 truncate">
                    S3 Object Key: <span className="font-mono font-medium text-emerald-800">{uploadResult.key}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Analyze button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAnalyze}
              disabled={isUploading}
              isLoading={isAnalyzing}
              icon={
                isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ScanLine className="w-5 h-5" />
                )
              }
            >
              {isAnalyzing
                ? 'Analyzing...'
                : isUploading
                ? 'Uploading to S3...'
                : 'Start AI Analysis'}
            </Button>

            {isAnalyzing && (
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  AI is analyzing your crop image...
                </div>
                <p className="text-xs text-slate-400 mt-1">This may take a few seconds</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card>
        <h3 className="text-sm font-bold text-slate-800 mb-3">📷 Tips for Best Results</h3>
        <div className="space-y-2">
          {[
            'Take a clear, close-up photo of the affected area',
            'Ensure good lighting — avoid shadows',
            'Include both healthy and affected parts if possible',
            'Hold the camera steady for a sharp image',
          ].map((tip, i) => (
            <p key={i} className="text-sm text-slate-500 flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              {tip}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
