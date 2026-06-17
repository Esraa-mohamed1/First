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
  ChevronLeft
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
import ImageUploader from './components/ImageUploader';

export default function InspectorPanel() {
  const { selectedNodeId, currentTemplate, updateNodeProps, setSelectedNodeId } = useBuilderStore();
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
    (f) => !['color', 'buttonColor', 'buttonTextColor', 'backgroundColor', 'titleColor', 'subtitleColor', 'headerBg', 'activeTabColor', 'accentColor', 'theme'].includes(f.type) && f.name !== 'align'
  );
  
  const stylingFields = registryConfig.fields.filter(
    (f) => ['color', 'buttonColor', 'buttonTextColor', 'backgroundColor', 'titleColor', 'subtitleColor', 'headerBg', 'activeTabColor', 'accentColor', 'theme'].includes(f.type) || f.name === 'align'
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
                        className="w-10 h-10 p-0 rounded-xl border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent"
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
