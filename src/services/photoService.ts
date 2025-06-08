import api from './api';
import type { Photo, PhotosResponse } from '../types/photo';
import type { SearchParams, ApiResponse } from '../types/api';

class PhotoService {
  async getPhotos(params: SearchParams): Promise<ApiResponse<PhotosResponse>> {
    try {
      const response = await api.get('/search', { params });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        data: {} as PhotosResponse,
        error: {
          status: error.response?.status || 500,
          message: error.message,
        },
        status: error.response?.status || 500,
      };
    }
  }

  async getPhotoById(id: number): Promise<ApiResponse<Photo>> {
    try {
      const response = await api.get(`/photos/${id}`);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        data: {} as Photo,
        error: {
          status: error.response?.status || 500,
          message: error.message,
        },
        status: error.response?.status || 500,
      };
    }
  }
}

export const photoService = new PhotoService();