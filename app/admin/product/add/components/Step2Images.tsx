import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductImage } from './types';
import { ImagePlus, CloudUpload, X } from 'lucide-react';

interface Step2ImagesProps {
  data: ProductImage[];
  onChange: (updates: ProductImage[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function Step2Images({ data, onChange }: Step2ImagesProps) {
  const primaryImage = data.find(img => img.type === 'Primary');
  const galleryImages = data.filter(img => img.type === 'Gallery');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'Primary' | 'Gallery', existingId?: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      
      let newData = [...data];
      
      if (type === 'Primary') {
        const existingPrimaryIndex = newData.findIndex(img => img.type === 'Primary');
        if (existingPrimaryIndex >= 0) {
          newData[existingPrimaryIndex] = { ...newData[existingPrimaryIndex], url, file };
        } else {
          newData.push({ id: generateId(), url, file, type: 'Primary' });
        }
      } else {
        if (existingId) {
          const index = newData.findIndex(img => img.id === existingId);
          if (index >= 0) newData[index] = { ...newData[index], url, file };
        } else {
          if (galleryImages.length < 10) {
            newData.push({ id: generateId(), url, file, type: 'Gallery' });
          }
        }
      }
      
      onChange(newData);
    }
  };

  const removeImage = (id: string) => {
    onChange(data.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Official Product Images (Model Level)</CardTitle>
          <CardDescription>
            Upload the primary default images for this product model. 
            <br/><span className="text-blue-600 font-medium">Inheritance:</span> These images will be automatically inherited by all variants and inventory units unless overridden specifically in later steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer group bg-slate-50 hover:bg-slate-100 border-slate-300">
              {primaryImage ? (
                <>
                  <img src={primaryImage.url} alt="Primary" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <span className="text-white text-sm font-medium flex items-center gap-2"><ImagePlus className="w-5 h-5" /> Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CloudUpload className="w-8 h-8 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Upload Primary Image</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'Primary')} />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>Upload up to 10 additional views (Front, Back, Side, Ports, etc.).</CardDescription>
            </div>
            <span className="text-sm font-medium text-slate-500">{galleryImages.length} / 10</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryImages.map(img => (
              <div key={img.id} className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-white">
                <img src={img.url} alt="Gallery" className="w-full h-full object-contain p-2" />
                <button 
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {galleryImages.length < 10 && (
              <label className="relative flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer group bg-slate-50 hover:bg-slate-100 border-slate-300">
                <div className="flex flex-col items-center gap-2">
                  <CloudUpload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">Add Image</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'Gallery')} />
              </label>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
