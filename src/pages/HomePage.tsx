import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types/photo';
import { MasonryGrid } from '../components/MasonryGrid';
import { usePhotos } from '../hooks/usePhotos';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import styled from 'styled-components';

const PageContainer = styled.div`
  text-align: center;
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    photos,
    loading,
    loadingMore,
    error,
    totalResults,
    loadMore,
  } = usePhotos({
    page: 1,
    per_page: 20,
    query: 'nature',
  });

  const handlePhotoClick = (photo: Photo) => {
    navigate(`/photo/${photo.id}`);
  };

  return (
    <PageContainer>
      {error ? (
        <ErrorState message={error} onRetry={loadMore} />
      ) : loading ? (
        <LoadingState count={3} />
      ) : (
        <MasonryGrid
          photos={photos}
          onPhotoClick={handlePhotoClick}
          isLoadingMore={loadingMore}
          hasMore={photos.length < totalResults}
          onLoadMore={loadMore}
        />
      )}
    </PageContainer>
  );
};