import { getCourses } from '../courses';
import academyApi from '@/lib/academy-api';
import studentApi from '@/lib/student-api';

// Mock the API clients
jest.mock('@/lib/academy-api', () => ({
  get: jest.fn(),
}));

jest.mock('@/lib/student-api', () => ({
  get: jest.fn(),
}));

describe('courses service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should fetch courses successfully using studentApi for student role', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', progress: 0 },
        { id: 2, title: 'Course 2', progress: 50 },
      ];

      (studentApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: mockCourses },
      });

      const courses = await getCourses(undefined, 'student');
      
      expect(studentApi.get).toHaveBeenCalledWith('courses');
      expect(courses).toEqual(mockCourses);
    });

    it('should fetch courses successfully using academyApi for academy role', async () => {
      const mockCourses = [
        { id: 1, title: 'Course 1', progress: 0 },
      ];

      (academyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { data: mockCourses },
      });

      const courses = await getCourses(123, 'academy');
      
      expect(academyApi.get).toHaveBeenCalledWith('courses?user_id=123');
      expect(courses).toEqual(mockCourses);
    });

    it('should return empty array on failure', async () => {
      (studentApi.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const courses = await getCourses(undefined, 'student');
      
      expect(courses).toEqual([]);
    });
  });
});
