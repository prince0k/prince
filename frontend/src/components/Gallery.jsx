import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Lightbox for selected image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-screen">
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="flex items-center justify-between absolute inset-0 z-40">
              <button
                onClick={() => navigateImage('prev')}
                className="w-12 h-12 ml-4 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="w-12 h-12 mr-4 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center h-full">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                className="max-w-full max-h-[80vh] object-contain"
              />
              {selectedImage.title && (
                <h3 className="text-white text-xl font-semibold mt-4">
                  {selectedImage.title}
                </h3>
              )}
              {selectedImage.description && (
                <p className="text-gray-300 text-center mt-2 max-w-lg">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => openImage(image, index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-medium">{image.title || image.alt}</h3>
                {image.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back to home link */}
      <div className="mt-12 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Gallery;