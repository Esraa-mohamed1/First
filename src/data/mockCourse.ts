import { Course } from "@/types/course";

export const MOCK_COURSE: Course = {
  id: "course-1",
  title: "Mastering Premium Web Design with Next.js 15",
  instructor: "Alex Rivers",
  progress: 65,
  lessons: [
    {
      id: "lesson-1",
      title: "Introduction to Modern Aesthetics",
      description: "In this lesson, we'll explore the principles of premium UI/UX design, focusing on glassmorphism, cinematic gradients, and depth.",
      videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      duration: "12:45",
      isCompleted: true,
      isLocked: false,
      resources: [
        { id: "res-1", title: "Design Principles PDF", url: "#", type: "pdf" }
      ],
      notes: "Focus on the spacing and typography hierarchy."
    },
    {
      id: "lesson-2",
      title: "Advanced Framer Motion Animations",
      description: "Learn how to create smooth micro-interactions and page transitions that wow your users.",
      videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      duration: "18:20",
      isCompleted: true,
      isLocked: false,
    },
    {
      id: "lesson-3",
      title: "Building Secure Video Players",
      description: "Deep dive into HLS streaming, watermarking, and content protection strategies for online courses.",
      videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      duration: "25:10",
      isCompleted: false,
      isLocked: false,
      resources: [
        { id: "res-2", title: "Secure Player Hook", url: "#", type: "zip" }
      ]
    },
    {
      id: "lesson-4",
      title: "Optimizing Performance for Production",
      description: "Strategies for faster load times and better core web vitals in large scale Next.js applications.",
      videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      duration: "15:30",
      isCompleted: false,
      isLocked: true,
    }
  ]
};
