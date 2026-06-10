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
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      id={`node-container-${id}`}
      className="relative group/section pl-10"
    >
      {/* Drag handle dots */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/section:opacity-100 p-2 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-xl transition-all z-30 text-slate-400 hover:text-slate-600 hidden sm:block"
        title="اسحب لإعادة الترتيب"
      >
        <GripVertical className="w-5 h-5 stroke-[2.5px]" />
      </div>

      {children}
    </div>
  );
}
