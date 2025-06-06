import { jest } from '@jest/globals';
import { photoService } from '../photoService';
import api from '../api';

jest.mock('../api');

describe('PhotoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error
    api.get = jest.fn();
  });

  it('should fetch photos successfully', async () => {
    const mockResponse = {
      data: {
        photos: [],
        total_results: 0,
        page: 1,
        per_page: 10
      },
      status: 200
    };

    // @ts-expect-error
    (api.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await photoService.getPhotos({ query: 'nature' });

    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockResponse.data);
    expect(api.get).toHaveBeenCalledWith('/search', {
      params: { query: 'nature' }
    });
  });

  it('should handle errors when fetching photos', async () => {
    const mockError = {
      response: { status: 404 },
      message: 'Not found'
    };

    // @ts-expect-error
    (api.get as jest.Mock).mockRejectedValueOnce(mockError);

    const result = await photoService.getPhotos({ query: 'nature' });

    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(404);
    expect(result.error?.message).toBe('Not found');
  });
});