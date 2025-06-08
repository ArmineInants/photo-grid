import { useState, useEffect } from 'react';
import type { Photo } from '../types/photo';
import { photoService } from '../services/photoService';

export const usePhotoDetails = (id: number | undefined) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPhoto = async () => {
      setLoading(true);
      setError(null);

      try {
        if (typeof id !== 'number' || isNaN(id)) {
          setPhoto(null);
          setError('Invalid photo ID');
          return;
        }
        const response = await photoService.getPhotoById(id);
        if (response.error) {
          setError(response.error.message);
          setPhoto(null);
          return;
        }
        if (isMounted) {
          setPhoto(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch photo');
          setPhoto(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchPhoto();
    } else {
      setPhoto(null);
      setLoading(false);
      setError('No photo ID provided');
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { photo, loading, error };
};