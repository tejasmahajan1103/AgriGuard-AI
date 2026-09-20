import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, ScanLine, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getMockScanResult } from '../../data/mockResponses';

export default function ScanCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = useCallback((f: File) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const result = await getMockScanResult();
      // Store result in sessionStorage for the result page
      sessionStorage.setItem('lastScanResult', JSON.stringify(result));
      sessionStorage.setItem('lastScanImage', preview || '');
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
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
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
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Analyze button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              icon={
                isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ScanLine className="w-5 h-5" />
                )
              }
            >
              {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
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
