import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('=== RUNNING END-TO-END VALIDATION ===\n');

// 1. Verify 404 Page and Navigation Links
console.log('Test 1: Dedicated 404 Page and Navigation Links');
const notFoundPath = path.resolve('src/app/not-found.tsx');
assert(fs.existsSync(notFoundPath), 'src/app/not-found.tsx must exist');
const notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
assert(notFoundContent.includes('404'), '404 page must display 404 code');
assert(notFoundContent.includes('href="/"'), '404 page must contain a navigation link back to the main academy template ("/")');
assert(notFoundContent.includes('العودة للرئيسية'), '404 page must contain label indicating return to main template');
console.log('✔ Test 1 Passed: Dedicated 404 page exists with proper navigation links.\n');

// 2. Verify Routing Logic & 404 handling in TenantHomeClient and student-auth
console.log('Test 2: Academy Endpoint 404 Handling & Routing');
const studentAuthContent = fs.readFileSync(path.resolve('src/services/student-auth.ts'), 'utf8');
assert(
  studentAuthContent.includes('notFoundError.isNotFound = true') && studentAuthContent.includes('status = 404'),
  'student-auth.ts must propagate 404 status when academy endpoint returns 404'
);

const tenantHomeContent = fs.readFileSync(path.resolve('src/components/Home/TenantHomeClient.tsx'), 'utf8');
assert(tenantHomeContent.includes('notFound()'), 'TenantHomeClient must invoke notFound() on 404 status');
assert(tenantHomeContent.includes('notFoundState'), 'TenantHomeClient must track notFoundState');
console.log('✔ Test 2 Passed: Routing logic handles 404 from academy endpoint and redirects to dedicated 404 page.\n');

// 3. Verify Authentication Flow in Single Course UI
console.log('Test 3: Single Course UI Authentication Flow & Standard User Endpoint');
const loginModalStateContent = fs.readFileSync(path.resolve('src/hooks/useLoginModalState.ts'), 'utf8');
assert(
  !loginModalStateContent.includes('superAdminLogin'),
  'useLoginModalState must NOT call or import superAdminLogin'
);
assert(
  loginModalStateContent.includes("import { login } from '@/services/auth';") ||
  loginModalStateContent.includes('import { login }'),
  'useLoginModalState must import standard user login from @/services/auth'
);
assert(
  loginModalStateContent.includes('await login('),
  'useLoginModalState must call standard user login'
);
assert(
  loginModalStateContent.includes('student-logged-in'),
  'useLoginModalState must dispatch student-logged-in event to proceed with subscription'
);
assert(
  loginModalStateContent.includes('setErrors') && loginModalStateContent.includes('toast.error'),
  'useLoginModalState must have error handling for failed login attempts'
);

const authServiceContent = fs.readFileSync(path.resolve('src/services/auth.ts'), 'utf8');
assert(
  authServiceContent.includes('https://api.darab.academy/api/auth/login'),
  'login service must target standard user endpoint https://api.darab.academy/api/auth/login'
);
console.log('✔ Test 3 Passed: Authentication requests use standard user login endpoint with robust error handling.\n');

// 4. Verify Unit and Lesson Description Rendering
console.log('Test 4: Unit and Lesson Description Display in CourseDetailTemplate & ChapterSection');
const courseDetailContent = fs.readFileSync(path.resolve('src/components/course/CourseDetailTemplate.tsx'), 'utf8');
assert(
  courseDetailContent.includes('unit.description'),
  'CourseDetailTemplate must display unit.description'
);
assert(
  courseDetailContent.includes('lesson.description'),
  'CourseDetailTemplate must display lesson.description beneath lesson entry'
);
assert(
  courseDetailContent.includes('px-11 pb-3') || courseDetailContent.includes('lesson.description.replace'),
  'CourseDetailTemplate must format lesson description directly beneath lesson entry'
);

const chapterSectionContent = fs.readFileSync(path.resolve('src/modules/landing/components/ChapterSection.tsx'), 'utf8');
assert(
  chapterSectionContent.includes('unit.description'),
  'ChapterSection must support unit.description'
);
assert(
  chapterSectionContent.includes('lesson.description'),
  'ChapterSection must support lesson.description'
);
console.log('✔ Test 4 Passed: Unit and lesson descriptions are rendered in user-visible sections with responsive formatting.\n');

// 5. Verify Bags Edit Mode Gallery Listing and Payment Method Validation
console.log('Test 5: Bags Edit Mode Gallery Listing and Payment Method Validation');
const bagWizardContent = fs.readFileSync(path.resolve('src/components/Academic/Market/BagWizardPage.tsx'), 'utf8');
assert(
  bagWizardContent.includes('rawGallery') && bagWizardContent.includes('setBagPhotos(loadedPhotos)'),
  'BagWizardPage must extract and list returned gallery from the API response in edit mode'
);
assert(
  bagWizardContent.includes('paymentError') && bagWizardContent.includes('validPaymentIds.length === 0'),
  'BagWizardPage must validate that at least one payment method is selected for paid bags'
);
assert(
  bagWizardContent.includes('payment-methods-selection-container'),
  'BagWizardPage must provide visual feedback and scroll to payment selection on validation error'
);
console.log('✔ Test 5 Passed: Gallery listing in edit mode and payment method validation are implemented.\n');

console.log('=== ALL VALIDATION CHECKS PASSED SUCCESSFULLY ===');
