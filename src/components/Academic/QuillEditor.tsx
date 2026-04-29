'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor = ({ value, onChange, placeholder, className }: QuillEditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-32 bg-gray-50 animate-pulse rounded-xl" />
  }), []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'direction': 'rtl' }],
      ['link', 'clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'direction',
    'link', 'color', 'background', 'align'
  ];

  return (
    <div className={className} dir="rtl">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-xl overflow-hidden"
      />
      <style jsx global>{`
        .ql-container {
          min-height: 150px;
          font-family: inherit;
          font-size: 14px;
        }
        .ql-editor {
          text-align: right;
          direction: rtl;
        }
        .ql-tooltip {
          left: 0 !important;
        }
        .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
          right: 0;
          left: auto;
        }
        /* Fix for potential React 19 / Quill issues */
        .ql-editor.ql-blank::before {
            right: 15px;
            left: auto;
            text-align: right;
            font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;
