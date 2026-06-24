import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useBuilderStore } from '../store/builderStore';
import { BuilderNode } from '../interfaces';
import SectionShapeOverlay from '../components/SectionShapeOverlay';
import SortableSection from '@/builder/dnd/SortableSection';
import SortableWidget from '@/builder/dnd/SortableWidget';

// ─── Dynamic Imports & Lazy Loading for all blocks ───────────────────────────

const HeroBanner = dynamic(() => import('../components/HeroBanner'), { ssr: false });
const HeroSlider = dynamic(() => import('../components/HeroSlider'), { ssr: false });
const KpiCards = dynamic(() => import('../components/KpiCards'), { ssr: false });
const ChartsBlock = dynamic(() => import('../components/ChartsBlock'), { ssr: false });
const TableBlock = dynamic(() => import('../components/TableBlock'), { ssr: false });
const StudentFeed = dynamic(() => import('../components/StudentFeed'), { ssr: false });
const CourseCards = dynamic(() => import('../components/CourseCards'), { ssr: false });
const SidebarBlock = dynamic(() => import('../components/SidebarBlock'), { ssr: false });
const NavbarBlock = dynamic(() => import('../components/NavbarBlock'), { ssr: false });
const TabsBlock = dynamic(() => import('../components/TabsBlock'), { ssr: false });
const MetricsCards = dynamic(() => import('../components/MetricsCards'), { ssr: false });

// Lazy load the dynamic backend sections from componentRegistry
const HeroSection = dynamic(() => import('../registry/componentRegistry').then(m => m.HeroSection), { ssr: false });
const FeaturesSection = dynamic(() => import('../registry/componentRegistry').then(m => m.FeaturesSection), { ssr: false });
const FaqSection = dynamic(() => import('../registry/componentRegistry').then(m => m.FaqSection), { ssr: false });
const TestimonialsSection = dynamic(() => import('../registry/componentRegistry').then(m => m.TestimonialsSection), { ssr: false });
const GallerySection = dynamic(() => import('../registry/componentRegistry').then(m => m.GallerySection), { ssr: false });
const PricingSection = dynamic(() => import('../registry/componentRegistry').then(m => m.PricingSection), { ssr: false });
const CategoriesSection = dynamic(() => import('../registry/componentRegistry').then(m => m.CategoriesSection), { ssr: false });

// Component Rendering Map
const rendererRegistry: Record<string, React.ComponentType<any>> = {
  // Dynamic backend-linked sections
  hero_section: HeroSection,
  features_section: FeaturesSection,
  faq_section: FaqSection,
  testimonials_section: TestimonialsSection,
  gallery_section: GallerySection,
  pricing_section: PricingSection,
  categories_section: CategoriesSection,
  // Existing static blocks
  hero: HeroBanner,
  'hero-slider': HeroSlider,
  'kpi-cards': KpiCards,
  charts: ChartsBlock,
  tables: TableBlock,
  'student-feed': StudentFeed,
  'course-cards': CourseCards,
  sidebar: SidebarBlock,
  navbar: NavbarBlock,
  tabs: TabsBlock,
  metrics: MetricsCards,
};

// ─── Section Background Wrapper ───────────────────────────────────────────────

const SectionBackground = React.memo(({ node, children }: { node: BuilderNode; children: React.ReactNode }) => {
  const p = node.props || {};
  const bgType = p.sectionBgType || 'solid';

  let style: React.CSSProperties = {};

  if (bgType === 'solid' && p.sectionBg) {
    style.backgroundColor = p.sectionBg;
  } else if (bgType === 'gradient' && p.sectionGradientFrom && p.sectionGradientTo) {
    const dirMap: Record<string, string> = {
      'to-r': 'to right',
      'to-l': 'to left',
      'to-b': 'to bottom',
      'to-t': 'to top',
      'to-br': '135deg',
      'to-tr': '45deg',
    };
    const direction = dirMap[p.sectionGradientDir || 'to-br'] || '135deg';
    style.backgroundImage = `linear-gradient(${direction}, ${p.sectionGradientFrom}, ${p.sectionGradientTo})`;
  } else if (bgType === 'image' && p.sectionBgImage) {
    style.backgroundImage = `url(${p.sectionBgImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  const hasBackground = bgType === 'solid' ? !!p.sectionBg : bgType === 'gradient' ? !!(p.sectionGradientFrom && p.sectionGradientTo) : !!p.sectionBgImage;

  if (!hasBackground && !(p.sectionShape && p.sectionShape !== 'none')) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-[inherit]" style={style}>
      {/* Image overlay */}
      {bgType === 'image' && p.sectionBgImage && (
        <div
          className="absolute inset-0 bg-slate-900"
          style={{ opacity: (p.sectionBgOverlay ?? 40) / 100 }}
        />
      )}
      {/* Decorative shape */}
      <SectionShapeOverlay
        shapeType={p.sectionShape}
        shapeColor={p.sectionShapeColor}
        shapeOpacity={p.sectionShapeOpacity}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
});
SectionBackground.displayName = 'SectionBackground';


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

  const renderComponent = React.useCallback((node: BuilderNode) => {
    const props = node.props || {};
    const Component = rendererRegistry[node.type];

    if (!Component) {
      return (
        <div className="p-4 border border-dashed border-red-200 text-center text-xs text-red-500 font-bold bg-red-50/50 rounded-xl">
          نوع مكون غير معروف: {node.type}
        </div>
      );
    }

    return (
      <Suspense fallback={<div className="p-4 text-center text-xs text-slate-400 font-bold animate-pulse">جاري تحميل المكون...</div>}>
        <Component {...props} id={node.id} />
      </Suspense>
    );
  }, []);

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

        if (isEditing) {
          if (!isNested) {
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
                  {/* Floating edit actions */}
                  {isSelected && (
                    <div className="absolute -top-3.5 left-4 z-40 flex items-center gap-1 bg-blue-600 text-white rounded-lg px-2.5 py-1 text-[9px] font-black shadow-md border border-blue-500 select-none animate-fade-in" dir="rtl">
                      <button onClick={(e) => { e.stopPropagation(); moveNodeUp(node.id); }} className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors" title="تحريك لأعلى">أعلى ↑</button>
                      <span className="opacity-50">|</span>
                      <button onClick={(e) => { e.stopPropagation(); moveNodeDown(node.id); }} className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors" title="تحريك لأسفل">أسفل ↓</button>
                      <span className="opacity-50">|</span>
                      <button onClick={(e) => { e.stopPropagation(); duplicateNode(node.id); }} className="hover:bg-blue-700 px-1.5 py-0.5 rounded transition-colors">تكرار</button>
                      <span className="opacity-50">|</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="hover:bg-rose-600 px-1.5 py-0.5 rounded transition-colors text-rose-100">حذف</button>
                    </div>
                  )}

                  {/* Component with optional section background/shape wrapper */}
                  <div className="select-none">
                    <SectionBackground node={node}>
                      <div>
                        {renderComponent(node)}
                      </div>
                    </SectionBackground>
                  </div>

                  {/* Nested tabs children */}
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
            return (
              <SortableWidget key={node.id} id={node.id}>
                <div
                  onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                  onMouseEnter={(e) => { e.stopPropagation(); setHoveredNodeId(node.id); }}
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
                      <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="hover:bg-rose-600 px-1 py-0.5 rounded text-rose-100">حذف</button>
                    </div>
                  )}
                  <div className="select-none">
                    <SectionBackground node={node}>
                      <div>
                        {renderComponent(node)}
                      </div>
                    </SectionBackground>
                  </div>
                </div>
              </SortableWidget>
            );
          }
        }

        // Live preview — no editing overlays
        return (
          <div key={node.id}>
            <SectionBackground node={node}>
              {renderComponent(node)}
            </SectionBackground>
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
