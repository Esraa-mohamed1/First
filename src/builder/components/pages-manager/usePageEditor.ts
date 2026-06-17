import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { CreatePagePayload } from '@/services/pages';
import { AcademyPage, PageEditorProps } from '../../interfaces';

export function usePageEditor({ page, isCreating, onSave }: PageEditorProps) {
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const localPreviewUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize values
  useEffect(() => {
    if (page && !isCreating) {
      setPageName(page.name);
      setPageSlug(page.slug);
      setCoverUrl(page.coverImage || null);
    } else {
      setPageName('');
      setPageSlug('');
      setCoverUrl(null);
    }

    // Cleanup: revoke any remaining generated object URLs when unmounting
    return () => {
      if (localPreviewUrlRef.current) {
        URL.revokeObjectURL(localPreviewUrlRef.current);
        localPreviewUrlRef.current = null;
      }
    };
  }, [page, isCreating]);

  // Garbage Collector callback for image uploads
  const handleImageChange = (file: File) => {
    // Revoke previous temp object URL to prevent memory leaks
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }

    // Create a new memory URL and cache it
    const objectUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = objectUrl;
    setCoverUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
    setCoverUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageName.trim()) {
      toast.error('الرجاء إدخال اسم الصفحة');
      return;
    }

    const calculatedSlug = pageSlug.trim() || pageName.trim().toLowerCase().replace(/\s+/g, '-');
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const updatedPage: AcademyPage = {
      id: page?.id || String(Date.now()),
      name: pageName.trim(),
      slug: calculatedSlug,
      createdAt: page?.createdAt || formattedDate,
      status: page?.status || 'draft',
      coverImage: coverUrl || undefined
    };

    // For new pages, also build the API payload so the parent can open the template picker
    if (isCreating) {
      const apiPayload: CreatePagePayload = {
        title: pageName.trim(),
        slug: calculatedSlug,
        status: updatedPage.status,
      };
      onSave(updatedPage, apiPayload);
      return;
    }

    onSave(updatedPage);
  };

  return {
    pageName,
    setPageName,
    pageSlug,
    setPageSlug,
    coverUrl,
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    handleFormSubmit
  };
}
