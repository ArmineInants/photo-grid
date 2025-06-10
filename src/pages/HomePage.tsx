import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types/photo';
import { usePhotos } from '../hooks/usePhotos';
import { MasonryGrid, LoadingState, ErrorState, SearchBar, EmptyState } from '../components';
import styled from 'styled-components';

const PageContainer = styled.div`
  text-align: center;
  height: 100vh;
  overflow: hidden;
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('nature');

  const searchParams = useMemo(
    () => ({
      page: 1,
      per_page: 20,
      query: searchQuery,
    }),
    [searchQuery]
  );

  const {
    photos,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  } = usePhotos(searchParams);

  const handlePhotoClick = useCallback(
    (photo: Photo) => {
      navigate(`/photo/${photo.id}`);
    },
    [navigate]
  );

  const renderContent = () => {
    if (error) {
      return <ErrorState message={error} onRetry={loadMore} />;
    }
    if (loading) {
      return <LoadingState count={3} />;
    }
    if (photos.length === 0) {
      return <EmptyState message="No photos found" />;
    }
    return (
      <MasonryGrid
        photos={photos}
        onPhotoClick={handlePhotoClick}
        isLoadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    );
  };

  return (
    <PageContainer>
      <SearchBar onSearch={setSearchQuery} isLoading={loading} defaultQuery={searchQuery} />
      {renderContent()}
    </PageContainer>
  );
};