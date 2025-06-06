import { useState, useEffect } from 'react';
import type { Photo } from '../types/photo';
import { photoService } from '../services/photoService';

export const usePhotoDetails = (id: number) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await photoService.getPhotoById(id);
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        setPhoto(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPhoto();
    }
  }, [id]);

  return { photo, loading, error };
};