import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
}

export default function SortableSection({ id, children }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`node-container-${id}`}
      className={`relative group/section pl-10 ${
        isDragging
          ? 'opacity-40 ring-2 ring-blue-400 ring-dashed rounded-3xl bg-blue-50/30 z-50'
          : ''
      }`}
    >
      {/* Drag handle — always visible as a faint icon, bright on hover */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-xl transition-all z-30 text-slate-300 hover:text-slate-600 group-hover/section:text-slate-400"
        title="اسحب لإعادة الترتيب"
      >
        <GripVertical className="w-5 h-5 stroke-[2.5px]" />
      </div>

      {children}
    </div>
  );
}
