import { getCourses } from '../courses';
import academyApi from '@/lib/academy-api';

// Mock the academyApi
jest.mock('@/lib/academy-api', () => ({
  get: jest.fn(),
}));

describe('courses service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should fetch courses successfully', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', progress: 0 },
        { id: 2, title: 'Course 2', progress: 50 },
      ];

      (academyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: mockCourses },
      });

      const courses = await getCourses(undefined, 'student');
      
      expect(academyApi.get).toHaveBeenCalledWith('courses?type=student');
      expect(courses).toEqual(mockCourses);
    });

    it('should return empty array on failure', async () => {
      (academyApi.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const courses = await getCourses(undefined, 'student');
      
      expect(courses).toEqual([]);
    });
  });
});
