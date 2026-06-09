import React from 'react';
import { useBuilderStore } from '../store/builderStore';
import { BuilderNode } from '../types';
import HeroBanner from '../components/HeroBanner';
import KpiCards from '../components/KpiCards';
import ChartsBlock from '../components/ChartsBlock';
import TableBlock from '../components/TableBlock';
import StudentFeed from '../components/StudentFeed';
import CourseCards from '../components/CourseCards';
import SidebarBlock from '../components/SidebarBlock';
import NavbarBlock from '../components/NavbarBlock';
import TabsBlock from '../components/TabsBlock';
import MetricsCards from '../components/MetricsCards';
import SortableSection from '@/builder/dnd/SortableSection';
import SortableWidget from '@/builder/dnd/SortableWidget';


interface RecursiveRendererProps {
  nodes: BuilderNode[];
  isNested?: boolean;
}

export default function RecursiveRenderer({ nodes, isNested = false }: RecursiveRendererProps) {
  const { 
    isEditing, 
    selectedNodeId, 
    hoveredNodeId, 
    setSelectedNodeId, 
    setHoveredNodeId,
    deleteNode,
    duplicateNode,
    moveNodeUp,
    moveNodeDown
  } = useBuilderStore();

  // Scroll to selected element automatically
  React.useEffect(() => {
    if (selectedNodeId) {
      const element = document.getElementById(`node-container-${selectedNodeId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedNodeId]);

  const renderComponent = (node: BuilderNode) => {
    const props = node.props || {};
    
    switch (node.type) {
      case 'hero':
        return <HeroBanner {...props} />;
      case 'kpi-cards':
        return <KpiCards {...props} />;
      case 'charts':
        return <ChartsBlock {...props} />;
      case 'tables':
        return <TableBlock {...props} />;
      case 'student-feed':
        return <StudentFeed {...props} />;
      case 'course-cards':
        return <CourseCards {...props} />;
      case 'sidebar':
        return <SidebarBlock {...props} />;
      case 'navbar':
        return <NavbarBlock {...props} />;
      case 'tabs':
        return <TabsBlock {...props} />;
      case 'metrics':
        return <MetricsCards {...props} />;
      default:
        return (
          <div className="p-4 border border-dashed border-red-200 text-center text-xs text-red-500 font-bold bg-red-50/50 rounded-xl">
            نوع مكون غير معروف: {node.type}
          </div>
        );
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="py-10 border border-dashed border-slate-200 rounded-3xl text-center text-xs text-slate-400 font-bold bg-slate-50/40 select-none">
        اسحب وأفلت العناصر والمكونات هنا للبدء في تشكيل الصفحة
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {nodes.map((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const hasChildren = node.children && node.children.length > 0;

        // In active visual edit mode, wrap them with sortable frames and click/hover events
        if (isEditing) {
          if (!isNested) {
            // Root elements behave as sections
            return (
              <SortableSection key={node.id} id={node.id}>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredNodeId(node.id);
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`relative rounded-3xl transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-4' 
                      : isHovered 
                        ? 'ring-2 ring-blue-300 ring-offset-2' 
                        : ''
                  }`}
                >
                  {/* Floating edit actions block */}
                  {isSelected && (
                    <div className="absolute -top-3.5 left-4 z-40 flex items-center gap-1 bg-blue-600 text-white rounded-lg px-2.5 py-1 text-[9px] font-black shadow-md border border-blue-500 select-none animate-fade-in" dir="rtl">
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveNodeUp(node.id); }}
                        className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors text-white"
                        title="تحريك لأعلى"
                      >
                        أعلى ↑
                      </button>
                      <span className="opacity-50">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveNodeDown(node.id); }}
                        className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors text-white"
                        title="تحريك لأسفل"
                      >
                        أسفل ↓
                      </button>
                      <span className="opacity-50">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); duplicateNode(node.id); }}
                        className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors"
                      >
                        تكرار
                      </button>
                      <span className="opacity-50">|</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                        className="hover:bg-rose-600 px-1.5 py-0.5 rounded transition-colors text-rose-100"
                      >
                        حذف
                      </button>
                    </div>
                  )}

                  {/* Component View */}
                  <div className="pointer-events-none select-none">
                    {renderComponent(node)}
                  </div>

                  {/* If section supports nested widgets, show drop area */}
                  {node.type === 'tabs' && (
                    <div className="mt-4 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-bold mb-3">عناصر التبويب الفرعية (Widgets)</p>
                      <RecursiveRenderer nodes={node.children || []} isNested={true} />
                    </div>
                  )}
                </div>
              </SortableSection>
            );
          } else {
            // Nested children behave as widgets
            return (
              <SortableWidget key={node.id} id={node.id}>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setHoveredNodeId(node.id);
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className={`relative rounded-2xl transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-2' 
                      : isHovered 
                        ? 'ring-2 ring-blue-300 ring-offset-1' 
                        : ''
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 left-3 z-40 flex items-center gap-1 bg-blue-600 text-white rounded px-2 py-0.5 text-[8px] font-black shadow select-none" dir="rtl">
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                        className="hover:bg-rose-600 px-1 py-0.5 rounded text-rose-100"
                      >
                        حذف
                      </button>
                    </div>
                  )}
                  
                  <div className="pointer-events-none select-none">
                    {renderComponent(node)}
                  </div>
                </div>
              </SortableWidget>
            );
          }
        }

        // Live preview / Simulator render - no highlighting or edit borders
        return (
          <div key={node.id}>
            {renderComponent(node)}
            {node.type === 'tabs' && node.children && node.children.length > 0 && (
              <div className="mt-4">
                <RecursiveRenderer nodes={node.children} isNested={true} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
