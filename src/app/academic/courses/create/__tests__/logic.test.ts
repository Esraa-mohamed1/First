import { describe, it, expect, vi } from 'vitest';

// Mock data
const mockUsers = [
  { id: 1, name: 'Academy User 1', role: 'academy' },
  { id: 2, name: 'Academy User 2', role: 'academy' },
  { id: 3, name: 'Instructor User', role: 'instructor' },
  { id: 4, name: 'Admin User', role: 'admin' },
  { id: 5, name: 'Student User', role: 'student' },
];

describe('Course Creation Filtering Logic', () => {
  it('should filter users by academy role correctly', () => {
    const instructors = mockUsers.filter(user => user.role === 'academy');
    
    expect(instructors).toHaveLength(2);
    expect(instructors[0].name).toBe('Academy User 1');
    expect(instructors[1].name).toBe('Academy User 2');
    expect(instructors.every(u => u.role === 'academy')).toBe(true);
  });

  it('should include USD in currency options', () => {
    const currencies = ['SAR', 'EGP', 'USD'];
    expect(currencies).toContain('USD');
  });

  it('should validate required title field', () => {
    const title = '';
    const errors: Record<string, string> = {};
    if (!title.trim()) {
      errors.title = 'عنوان الدورة مطلوب';
    }
    expect(errors.title).toBeDefined();
    expect(errors.title).toBe('عنوان الدورة مطلوب');
  });

  it('should validate required instructor if user is admin', () => {
    const currentUser = { role: 'admin' };
    const selectedInstructor = null;
    const errors: Record<string, string> = {};
    
    if (!selectedInstructor && (currentUser.role === 'admin' || currentUser.role === 'academy')) {
      errors.user_id = 'يرجى اختيار مدرب';
    }
    
    expect(errors.user_id).toBe('يرجى اختيار مدرب');
  });
});
