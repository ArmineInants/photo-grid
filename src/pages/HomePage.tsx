import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types/photo';
import { MasonryGrid } from '../components/MasonryGrid/MasonryGrid';
import { usePhotos } from '../hooks/usePhotos';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { photos, loading, error } = usePhotos({ 
    query: 'nature',
    per_page: 20 
  });

  const handlePhotoClick = (photo: Photo) => {
    navigate(`/photo/${photo.id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <MasonryGrid 
        photos={photos} 
        onPhotoClick={handlePhotoClick}
      />
    </div>
  );
};