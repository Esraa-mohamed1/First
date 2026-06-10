import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useBuilderStore } from '../store/builderStore';
import { BuilderNode } from '../types';

interface DndWrapperProps {
  children: React.ReactNode;
}

export default function DndWrapper({ children }: DndWrapperProps) {
  const { currentTemplate, reorderSections, moveWidget } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires moving 5px before drag triggers to prevent blocking clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentTemplate) return <>{children}</>;

  const sections = currentTemplate.sections;
  const sectionIds = sections.map((s) => s.id);

  // Helper to find the parent section containing a widget ID
  const findParentSectionId = (nodes: BuilderNode[], widgetId: string): string | null => {
    for (const node of nodes) {
      if (node.children && node.children.some((c) => c.id === widgetId)) {
        return node.id;
      }
      if (node.children && node.children.length > 0) {
        const parentId = findParentSectionId(node.children, widgetId);
        if (parentId) return parentId;
      }
    }
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    // Check if dragging top-level sections
    const isActiveSection = sectionIds.includes(activeId);
    const isOverSection = sectionIds.includes(overId);

    if (isActiveSection && isOverSection) {
      reorderSections(activeId, overId);
    } else {
      // It's a widget drag
      const activeParentId = findParentSectionId(sections, activeId);
      const overParentId = findParentSectionId(sections, overId);

      if (activeParentId && overParentId) {
        moveWidget(activeId, overId, activeParentId, overParentId);
      }
    }
  };

  // List of all items that are sortable (sections + all widgets in tabs children)
  const allSortableIds = [...sectionIds];
  sections.forEach((s) => {
    if (s.children) {
      s.children.forEach((c) => allSortableIds.push(c.id));
    }
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext items={allSortableIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
