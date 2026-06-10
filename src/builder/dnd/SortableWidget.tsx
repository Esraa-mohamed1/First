import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableWidgetProps {
  id: string;
  children: React.ReactNode;
}

export default function SortableWidget({ id, children }: SortableWidgetProps) {
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
      className="relative group/widget pl-8"
    >
      {/* Mini drag handle for nested widgets */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover/widget:opacity-100 p-1.5 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-lg transition-all z-30 text-slate-400 hover:text-slate-600"
        title="اسحب العنصر الفرعي"
      >
        <GripVertical className="w-4 h-4 stroke-[2px]" />
      </div>

      {children}
    </div>
  );
}
