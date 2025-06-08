import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../types/photo';
import type { SearchParams } from '../types/api';
import { photoService } from '../services/photoService';

export const usePhotos = (initialParams: SearchParams) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);

  const fetchPhotos = useCallback(
    async (params: SearchParams, append: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await photoService.getPhotos(params);
        if (response.error) {
          setError(response.error.message);
          return;
        }

        if (append) {
          setPhotos((prev) => [...prev, ...response.data.photos]);
        } else {
          setPhotos(response.data.photos);
        }
        setTotalResults(response.data.total_results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchPhotos({ ...initialParams, page: nextPage }, true);
  }, [currentPage, loadingMore, fetchPhotos, initialParams]);

  useEffect(() => {
    fetchPhotos(initialParams);
  }, [fetchPhotos, initialParams.query, initialParams.per_page]);

  return {
    photos,
    loading,
    loadingMore,
    error,
    totalResults,
    hasMore: photos.length < totalResults,
    loadMore,
  };
};