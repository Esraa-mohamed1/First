'use client';

import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { COMPONENT_REGISTRY } from '../registry/componentRegistry';
import { 
  X, 
  Settings, 
  Paintbrush, 
  FileText, 
  ChevronDown, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  ChevronLeft,
  Plus,
  Trash2
} from 'lucide-react';

// Subcomponents
import SectionBackgroundControls from './components/SectionBackgroundControls';
import TypographyCustomizer, { EDITABLE_LINES } from './components/TypographyCustomizer';
import KpiCardsEditor from './components/KpiCardsEditor';
import CourseCardsEditor from './components/CourseCardsEditor';
import StudentFeedEditor from './components/StudentFeedEditor';
import TableBlockEditor from './components/TableBlockEditor';
import MetricsCardsEditor from './components/MetricsCardsEditor';
import TabsBlockEditor from './components/TabsBlockEditor';
import HeroSliderEditor from './components/HeroSliderEditor';
import NavbarBlockEditor from './components/NavbarBlockEditor';
import ImageUploader from './components/ImageUploader';
import ItemImageUploader from './components/ImageUploader';
import { AVAILABLE_ICONS, getIconComponent } from '../utils/icons';

function ItemIconPicker({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label?: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const IconComp = getIconComponent(value || 'HelpCircle');

  const filteredIcons = AVAILABLE_ICONS.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      {label && <label className="block text-[10px] font-black text-slate-400 mb-1.5">{label}</label>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 rounded-xl text-xs font-bold text-slate-700 outline-none flex justify-between items-center transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-600 bg-blue-50 p-1 rounded-lg">
            <IconComp className="w-4 h-4" />
          </span>
          <span>{value || 'اختر أيقونة'}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl p-3 z-50 max-h-[240px] overflow-y-auto">
            <input 
              type="text"
              placeholder="ابحث عن أيقونة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none mb-2 text-right"
              dir="rtl"
            />
            <div className="grid grid-cols-4 gap-1.5">
              {filteredIcons.map((icon) => {
                const CurrentIcon = getIconComponent(icon);
                const isSelected = value === icon;
                return (
                  <button
                    type="button"
                    key={icon}
                    title={icon}
                    onClick={() => {
                      onChange(icon);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`p-2.5 border rounded-xl flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'border-slate-50 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CurrentIcon className="w-4 h-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function InspectorPanel() {
  const { 
    selectedNodeId, 
    currentTemplate, 
    updateNodeProps, 
    setSelectedNodeId,
    selectedItemIndex,
    setSelectedItemIndex
  } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'spacing'>('content');
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darab_builder_simple_mode');
      return saved !== 'false';
    }
    return true;
  });

  const toggleSimpleMode = (val: boolean) => {
    setIsSimpleMode(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darab_builder_simple_mode', String(val));
    }
  };
  const [iconSearch, setIconSearch] = useState('');
  const [showIconDropdown, setShowIconDropdown] = useState<string | null>(null);
  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  // Auto-reset tab on node selection change
  useEffect(() => {
    setActiveTab('content');
    setExpandedLine(null);
  }, [selectedNodeId]);

  useEffect(() => {
    if (isSimpleMode && activeTab === 'spacing') {
      setActiveTab('content');
    }
  }, [isSimpleMode, activeTab]);

  if (!selectedNodeId || !currentTemplate) {
    return (
      <div className="w-[340px] bg-white border-r border-slate-100 flex flex-col items-center justify-center p-8 text-center" dir="rtl">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
          <Settings className="w-7 h-7" />
        </div>
        <p className="text-xs font-black text-slate-700">حدد عنصراً للبدء بتعديله</p>
        <p className="text-[10px] text-slate-400 font-bold mt-1">اضغط على أي جزء في مساحة العمل لعرض خصائصه هنا</p>
      </div>
    );
  }

  // Find the selected node
  const findNodeById = (nodes: any[], id: string): any => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children && node.children.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNodeById(currentTemplate.sections, selectedNodeId);
  if (!selectedNode) return null;

  const registryConfig = COMPONENT_REGISTRY[selectedNode.type];
  if (!registryConfig) return null;

  const props = selectedNode.props || {};

  const handlePropChange = (key: string, value: any) => {
    updateNodeProps(selectedNodeId, { [key]: value });
  };

  // Group fields into Content vs styling parameters
  const contentFields = registryConfig.fields.filter(
    (f) => !f.name.startsWith('section') && !['color', 'buttonColor', 'buttonTextColor', 'backgroundColor', 'titleColor', 'subtitleColor', 'headerBg', 'activeTabColor', 'accentColor', 'theme'].includes(f.type) && f.name !== 'align'
  );
  
  const stylingFields = registryConfig.fields.filter(
    (f) => !f.name.startsWith('section') && (['color', 'buttonColor', 'buttonTextColor', 'backgroundColor', 'titleColor', 'subtitleColor', 'headerBg', 'activeTabColor', 'accentColor', 'theme'].includes(f.type) || f.name === 'align')
  );

  return (
    <div className="w-[340px] bg-white border-r border-slate-100 h-full flex flex-col justify-between shadow-sm select-none z-30 font-['IBM_Plex_Sans_Arabic']" dir="rtl">
      
      {/* Header Panel */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-black text-slate-800">{registryConfig.name}</h3>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Simple/Advanced Toggle Switch */}
      <div className="px-5 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-500">مستوى لوحة التحكم:</span>
        <div className="flex bg-slate-200/60 rounded-xl p-0.5 border border-slate-200/50 select-none">
          <button
            type="button"
            onClick={() => toggleSimpleMode(true)}
            className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${
              isSimpleMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            سهل ✨
          </button>
          <button
            type="button"
            onClick={() => toggleSimpleMode(false)}
            className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${
              !isSimpleMode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            متقدم 🛠️
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 text-[11px] font-black border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'content' ? 'border-blue-500 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          المحتوى
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-3 text-[11px] font-black border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'style' ? 'border-blue-500 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          التنسيق
        </button>
        {!isSimpleMode && (
          <button
            onClick={() => setActiveTab('spacing')}
            className={`flex-1 py-3 text-[11px] font-black border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'spacing' ? 'border-blue-500 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            الهوامش
          </button>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {activeTab === 'content' && (
          <div className="space-y-5">
            {contentFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-1 block">
                  {field.label}
                </label>

                {field.type === 'text' && (
                  (field.name.toLowerCase().includes('image') || field.name.toLowerCase().includes('img') || field.name.toLowerCase().includes('logo')) ? (
                    <ImageUploader
                      value={props[field.name] ?? ''}
                      onChange={(val) => handlePropChange(field.name, val)}
                      label={field.label}
                    />
                  ) : (
                    <input 
                      type="text" 
                      value={props[field.name] ?? ''} 
                      onChange={(e) => handlePropChange(field.name, e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all"
                    />
                  )
                )}

                {field.type === 'textarea' && (
                  <textarea 
                    rows={3}
                    value={props[field.name] ?? ''} 
                    onChange={(e) => handlePropChange(field.name, e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all resize-none"
                  />
                )}

                {field.type === 'number' && (
                  <input 
                    type="number" 
                    value={props[field.name] ?? field.defaultValue} 
                    onChange={(e) => handlePropChange(field.name, Number(e.target.value))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all"
                  />
                )}

                {field.type === 'boolean' && (
                  <label className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100/40 select-none">
                    <input 
                      type="checkbox" 
                      checked={props[field.name] ?? field.defaultValue} 
                      onChange={(e) => handlePropChange(field.name, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-600">تفعيل هذا الخيار</span>
                  </label>
                )}

                {field.type === 'select' && (
                  <div className="relative">
                    <select
                      value={props[field.name] ?? field.defaultValue}
                      onChange={(e) => handlePropChange(field.name, e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all appearance-none"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}

                {field.type === 'icon' && (
                  <ItemIconPicker
                    value={props[field.name] ?? field.defaultValue}
                    onChange={(val) => handlePropChange(field.name, val)}
                  />
                )}
              </div>
            ))}

            {/* Custom List Editors */}
            {selectedNode.type === 'kpi-cards' && (
              <KpiCardsEditor 
                props={props} 
                handlePropChange={handlePropChange}
                showIconDropdown={showIconDropdown}
                setShowIconDropdown={setShowIconDropdown}
                iconSearch={iconSearch}
                setIconSearch={setIconSearch}
              />
            )}

            {selectedNode.type === 'course-cards' && (
              <CourseCardsEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {selectedNode.type === 'student-feed' && (
              <StudentFeedEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {selectedNode.type === 'tables' && (
              <TableBlockEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {selectedNode.type === 'metrics' && (
              <MetricsCardsEditor 
                props={props} 
                handlePropChange={handlePropChange}
                showIconDropdown={showIconDropdown}
                setShowIconDropdown={setShowIconDropdown}
                iconSearch={iconSearch}
                setIconSearch={setIconSearch}
              />
            )}

            {selectedNode.type === 'tabs' && (
              <TabsBlockEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {selectedNode.type === 'hero-slider' && (
              <HeroSliderEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {selectedNode.type === 'navbar' && (
              <NavbarBlockEditor 
                props={props} 
                handlePropChange={handlePropChange}
              />
            )}

            {/* Dynamic Item List Editor */}
            {registryConfig.itemFields && (
              <DynamicListEditor
                items={props.items || []}
                fields={registryConfig.itemFields}
                itemLabel={registryConfig.itemLabel || 'عنصر'}
                onChange={(newItems) => handlePropChange('items', newItems)}
              />
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-5">
            {stylingFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 pr-1 block">
                  {field.label}
                </label>

                {field.type === 'color' && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={props[field.name] ?? field.defaultValue} 
                        onChange={(e) => handlePropChange(field.name, e.target.value)}
                        className="w-10 h-10 p-0 rounded-xl border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent shrink-0"
                      />
                      
                      {!isSimpleMode ? (
                        <input 
                          type="text" 
                          value={props[field.name] ?? field.defaultValue} 
                          onChange={(e) => handlePropChange(field.name, e.target.value)}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none text-left"
                          dir="ltr"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500">اضغط لاختيار لون {field.label}</span>
                      )}
                    </div>
                  </div>
                )}

                {field.type === 'select' && (
                  <div className="relative">
                    <select
                      value={props[field.name] ?? field.defaultValue}
                      onChange={(e) => handlePropChange(field.name, e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all appearance-none"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>
            ))}

             {/* Align text blocks */}
            {registryConfig.fields.some(f => f.name === 'align') && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 pr-1 block">محاذاة النص والكتلة</label>
                <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1 items-center">
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'right')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'right' || !props.align ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'center')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'center' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'left')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'left' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[9px] font-bold text-slate-400 block mt-1 pr-1 leading-normal">
                  💡 اختر اتجاه محاذاة نصوص ومحتويات هذا القسم (ليمين أو لوسط أو ليسار الصفحة).
                </span>
              </div>
            )}

            {/* Elementor-style Line Typography Accordion */}
            {!isSimpleMode && EDITABLE_LINES[selectedNode.type] && (
              <TypographyCustomizer 
                selectedNodeType={selectedNode.type}
                props={props}
                handlePropChange={handlePropChange}
                expandedLine={expandedLine}
                setExpandedLine={setExpandedLine}
              />
            )}

            {/* Section Background & Decorative Shapes */}
            <SectionBackgroundControls 
              props={props}
              handlePropChange={handlePropChange}
              isSimpleMode={isSimpleMode}
            />

            {/* Mobile Visibility Settings */}
            <div className="border-t border-slate-150/60 pt-4 mt-4">
              <span className="text-[10px] font-black text-slate-400 block mb-2">إعدادات الجوال (Mobile Settings)</span>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-700">إخفاء في وضع الجوال</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-normal">
                    لن يظهر هذا القسم للمشتركين عند التصفح من الهاتف المحمول
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={!!props.hide_on_mobile}
                    onChange={(e) => handlePropChange('hide_on_mobile', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 block">الهامش الداخلي (Padding)</span>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                  <span>التباعد العمودي</span>
                  <span>{props.paddingTop === 'py-24' ? 'موسع (96px)' : props.paddingTop === 'py-16' ? 'افتراضي (64px)' : 'مضغوط (32px)'}</span>
                </div>
                <div className="relative">
                  <select
                    value={props.paddingTop ?? 'py-16'}
                    onChange={(e) => {
                      handlePropChange('paddingTop', e.target.value);
                      handlePropChange('paddingBottom', e.target.value);
                    }}
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none appearance-none"
                  >
                    <option value="py-8">مضغوط (py-8)</option>
                    <option value="py-16">افتراضي (py-16)</option>
                    <option value="py-24">موسع (py-24)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 block">ملاحظات التنسيق</span>
              <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                يتم إدارة جميع قياسات الهوامش والتباعد الداخلي بما يتوافق مع تخطيط الأقسام المتجاوبة على شاشات الجوال والتابلت بشكل تلقائي.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Details */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-[10px] font-bold text-slate-400 select-none">
        <span>رمز العنصر: {selectedNode.id.substr(0, 12)}...</span>
        <span className="flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          جاهز للتعديل
        </span>
      </div>

    </div>
  );
}

// ─── Dynamic List Editor Component ───────────────────────────────────────────

interface DynamicListEditorProps {
  items: any[];
  fields: any[];
  itemLabel: string;
  onChange: (newItems: any[]) => void;
}

function DynamicListEditor({ items = [], fields = [], itemLabel = 'عنصر', onChange }: DynamicListEditorProps) {
  const { selectedItemIndex, setSelectedItemIndex } = useBuilderStore();

  useEffect(() => {
    if (selectedItemIndex !== null) {
      const element = document.getElementById(`item-editor-${selectedItemIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedItemIndex]);

  const handleAddItem = () => {
    const newItemProps: Record<string, any> = {};
    fields.forEach(f => {
      newItemProps[f.name] = f.defaultValue;
    });
    const newItem = {
      order: items.length + 1,
      props: newItemProps
    };
    onChange([...items, newItem]);
    setSelectedItemIndex(items.length);
  };

  const handleUpdateItemProp = (index: number, key: string, val: any) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          props: { ...item.props, [key]: val }
        };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteItem = (index: number) => {
    const filtered = items.filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    onChange(filtered);
    setSelectedItemIndex(null);
  };

  return (
    <div className="space-y-4 border-t border-slate-100 pt-4" dir="rtl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-slate-400">قائمة العناصر ({itemLabel})</span>
        <button
          type="button"
          onClick={handleAddItem}
          className="px-2.5 py-1 bg-blue-550/10 text-blue-600 rounded-lg text-[9px] font-black hover:bg-blue-100 transition-all flex items-center gap-1 border border-blue-200"
        >
          <Plus className="w-3 h-3" />
          <span>إضافة {itemLabel} +</span>
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const itemProps = item.props || {};
          const labelText = itemProps.title || itemProps.question || itemProps.plan_name || itemProps.quote || itemProps.caption || `${itemLabel} ${idx + 1}`;
          const isEditing = selectedItemIndex === idx;

          return (
            <div key={idx} id={`item-editor-${idx}`} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
              <div
                onClick={() => setSelectedItemIndex(isEditing ? null : idx)}
                className="p-3 bg-slate-50/50 hover:bg-slate-50 flex justify-between items-center cursor-pointer transition-colors"
              >
                <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{labelText}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(idx);
                    }}
                    className="text-[9px] font-black text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] text-slate-400 font-bold">{isEditing ? 'إغلاق ▲' : 'تعديل ▼'}</span>
                </div>
              </div>

              {isEditing && (
                <div className="p-4 bg-white border-t border-slate-100 space-y-4">
                  {fields.map(f => (
                    <div key={f.name} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 pr-1 block">
                        {f.label}
                      </label>
                      
                      {f.type === 'text' && (
                        (f.name.toLowerCase().includes('image') || f.name.toLowerCase().includes('img') || f.name.toLowerCase().includes('logo') || f.name.toLowerCase().includes('avatar')) ? (
                          <ItemImageUploader
                            value={itemProps[f.name] ?? ''}
                            onChange={(val) => handleUpdateItemProp(idx, f.name, val)}
                            label={f.label}
                          />
                        ) : (
                          <input
                            type="text"
                            value={itemProps[f.name] ?? ''}
                            onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                          />
                        )
                      )}
                      
                      {f.type === 'textarea' && (
                        <textarea
                          rows={3}
                          value={itemProps[f.name] ?? ''}
                          onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all resize-none"
                        />
                      )}
                      
                      {f.type === 'number' && (
                        <input
                          type="number"
                          value={itemProps[f.name] ?? f.defaultValue}
                          onChange={(e) => handleUpdateItemProp(idx, f.name, Number(e.target.value))}
                          className="w-full p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                        />
                      )}
                      
                      {f.type === 'boolean' && (
                        <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100/40 select-none">
                          <input
                            type="checkbox"
                            checked={itemProps[f.name] ?? f.defaultValue}
                            onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.checked)}
                            className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-[10px] font-bold text-slate-600">تفعيل هذا الخيار</span>
                        </label>
                      )}
                      
                      {f.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={itemProps[f.name] ?? f.defaultValue}
                            onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.value)}
                            className="w-8 h-8 p-0 rounded-lg border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent shrink-0"
                          />
                          <input
                            type="text"
                            value={itemProps[f.name] ?? f.defaultValue}
                            onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.value)}
                            className="flex-1 min-w-0 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono font-bold text-slate-600 outline-none text-left"
                            dir="ltr"
                          />
                        </div>
                      )}
                      
                      {f.type === 'image' && (
                        <ItemImageUploader
                          value={itemProps[f.name] ?? ''}
                          onChange={(val) => handleUpdateItemProp(idx, f.name, val)}
                          label={f.label}
                        />
                      )}
                      
                      {f.type === 'select' && (
                        <select
                          value={itemProps[f.name] ?? f.defaultValue}
                          onChange={(e) => handleUpdateItemProp(idx, f.name, e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                        >
                          {f.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}

                      {f.type === 'icon' && (
                        <ItemIconPicker
                          value={itemProps[f.name] ?? f.defaultValue}
                          onChange={(val) => handleUpdateItemProp(idx, f.name, val)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
