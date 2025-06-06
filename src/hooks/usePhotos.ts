import { useState, useEffect, useCallback } from 'react';
import type { Photo } from '../types/photo';
import type { SearchParams } from '../types/api';
import { photoService } from '../services/photoService';

export const usePhotos = (initialParams: SearchParams) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const fetchPhotos = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await photoService.getPhotos(params);
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setPhotos(response.data.photos);
      setTotalResults(response.data.total_results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(initialParams);
  }, [fetchPhotos, initialParams]);

  return {
    photos,
    loading,
    error,
    totalResults,
    refetch: fetchPhotos
  };
};