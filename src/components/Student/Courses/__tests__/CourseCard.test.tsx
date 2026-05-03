import React from 'react';
import { render, screen } from '@testing-library/react';
import { CourseCard } from '../CourseCard';
import { Course } from '@/types/student';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href} data-testid="course-link">{children}</a>;
  };
});

describe('CourseCard Navigation', () => {
  const mockCourse: Course = {
    id: '123',
    title: 'Test Course',
    description: 'Test Description',
    progress: 50,
    image: '',
    instructor: 'John Doe',
    category: 'Development',
    status: 'in-progress',
  };

  it('should navigate to the correct student course url when progress is less than 100', () => {
    render(<CourseCard course={mockCourse} />);
    
    const link = screen.getByTestId('course-link');
    expect(link).toHaveAttribute('href', '/user/courses/123');
    expect(link).toHaveTextContent('دخول الدورة');
  });

  it('should navigate to the certificate url when progress is 100', () => {
    const completedCourse: Course = { ...mockCourse, progress: 100 };
    render(<CourseCard course={completedCourse} />);
    
    const link = screen.getByTestId('course-link');
    // Note: Certificate URL is still pointing to /student/courses/{id}/certificate
    // Certificate URL should point to /user/courses/{id}/certificate
    expect(link).toHaveAttribute('href', '/user/courses/123/certificate');
    expect(link).toHaveTextContent('عرض الشهادة');
  });
});
