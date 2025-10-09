import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import type { ChangelogImage } from '../queries/changelog';

interface ChangelogImagesProps {
  images: ChangelogImage[];
}

const ChangelogImages: React.FC<ChangelogImagesProps> = ({ images }) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const imageArray = images.map((image) => [image.title, image.url]);

  const handleImageClick = (src: string) => {
    setEnlargedImage(src);
  };

  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
  };

  const handleNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      if (!enlargedImage) return;
      const currentIndex = imageArray.findIndex(
        ([_, src]) => src === enlargedImage,
      );
      let newIndex;
      if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : imageArray.length - 1;
      } else {
        newIndex = currentIndex < imageArray.length - 1 ? currentIndex + 1 : 0;
      }
      setEnlargedImage(imageArray[newIndex][1]);
    },
    [enlargedImage, imageArray],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseEnlarged();
      } else if (event.key === 'ArrowLeft') {
        handleNavigation('prev');
      } else if (event.key === 'ArrowRight') {
        handleNavigation('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigation]);

  return (
    <>
      <div className="flex gap-3 px-6 pb-1">
        {imageArray.map(([title, src]) => (
          <div
            key={title}
            className="group relative cursor-pointer overflow-hidden rounded-lg transition hover:scale-105"
            onClick={() => handleImageClick(src)}
          >
            <img
              src={src}
              alt={title}
              className="h-[120px] w-full object-cover object-left-top"
            />
            <span className="absolute inset-0 bg-linear-to-b from-transparent to-black/40 group-hover:opacity-0" />

            <div className="absolute inset-x-0 top-full flex cursor-pointer items-center justify-center bg-black/50 px-2 py-0.5 text-center text-xs font-medium text-white opacity-0 group-hover:inset-y-0 group-hover:opacity-100">
              <span className="rounded-sm bg-black px-1 py-0.5">{title}</span>
            </div>
          </div>
        ))}
      </div>
      {enlargedImage && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/75"
          onClick={handleCloseEnlarged}
        >
          <img
            src={enlargedImage}
            alt="Enlarged view"
            className="max-h-[90%] max-w-[90%] rounded-xl object-contain"
          />
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-white/50 p-2 hover:bg-white/100"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('prev');
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-white/50 p-2 hover:bg-white/100"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('next');
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default ChangelogImages;
