import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

export const PhotosApp: React.FC<{ args?: Record<string, any> }> = ({ args }) => {
  const { updateSettings, addNotification } = useOS();
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const loadPhotos = () => {
    const defaultPhotos = [
      {
        id: 'photo-bloom-dark',
        title: 'Windows 11 Cyan Bloom (Dark)',
        url: '/src/assets/images/win_cloud_wallpaper_dark_1792204784138.jpg',
        category: 'Wallpaper',
      },
      {
        id: 'photo-bloom-light',
        title: 'Windows 11 Silk Ribbon (Light)',
        url: '/src/assets/images/win_cloud_wallpaper_light_1792204784260.jpg',
        category: 'Wallpaper',
      },
    ];

    const pictureFiles = cloudStorage.getFilesByParent('folder-pictures');
    const customPhotos = pictureFiles.map((f) => ({
      id: f.id,
      title: f.name,
      url: f.content || '',
      category: 'Cloud Storage',
    }));

    setPhotos([...defaultPhotos, ...customPhotos]);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const currentPhoto = photos[selectedPhotoIndex] || photos[0];

  const handleSetWallpaper = () => {
    if (currentPhoto) {
      updateSettings({ wallpaper: currentPhoto.url });
      addNotification('Wallpaper Changed', `Set "${currentPhoto.title}" as desktop background.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none text-xs">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Icon name="photos" size={16} className="text-sky-400" />
          <span className="font-semibold text-slate-200 truncate max-w-[200px]">
            {currentPhoto?.title || 'Photos'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
            title="Zoom Out"
          >
            <Icon name="minimize" size={14} />
          </button>
          <span className="text-[11px] font-mono text-slate-400 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
            title="Zoom In"
          >
            <Icon name="maximize" size={14} />
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
            title="Rotate"
          >
            <Icon name="refresh" size={14} />
          </button>
          <button
            onClick={handleSetWallpaper}
            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded text-[11px] font-medium transition-colors"
          >
            Set as Wallpaper
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-black/40">
        {currentPhoto && (
          <img
            src={currentPhoto.url}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 border-t border-slate-800 overflow-x-auto">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setSelectedPhotoIndex(i);
              setZoom(1);
              setRotation(0);
            }}
            className={`w-14 h-10 rounded border overflow-hidden shrink-0 transition-transform ${
              selectedPhotoIndex === i ? 'ring-2 ring-sky-500 border-white scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
