'use client';

import React, { useState, useEffect } from 'react';
import { useBuilderStore } from '../store/builderStore';
import { COMPONENT_REGISTRY } from '../registry/componentRegistry';
import { AVAILABLE_ICONS } from '../utils/icons';
import { 
  AVAILABLE_FONTS, 
  AVAILABLE_SIZES, 
  AVAILABLE_WEIGHTS 
} from '../utils/typography';
import { 
  X, 
  Settings, 
  Paintbrush, 
  FileText, 
  Plus, 
  Trash2, 
  ChevronDown, 
  AlignRight, 
  AlignCenter, 
  AlignLeft,
  ChevronLeft
} from 'lucide-react';

const EDITABLE_LINES: Record<string, { key: string; label: string; type: 'text' | 'textarea' }[]> = {
  'hero': [
    { key: 'badgeText', label: 'شارة الترويسة العليا (Badge)', type: 'text' },
    { key: 'title', label: 'العنوان الرئيسي (Title)', type: 'text' },
    { key: 'subtitle', label: 'العنوان الفرعي (Subtitle)', type: 'textarea' },
    { key: 'buttonText', label: 'نص الزر الأساسي (Button)', type: 'text' },
  ],
  'charts': [
    { key: 'title', label: 'عنوان الرسم البياني (Title)', type: 'text' }
  ],
  'tables': [
    { key: 'title', label: 'عنوان جدول البيانات (Title)', type: 'text' }
  ],
  'student-feed': [
    { key: 'title', label: 'عنوان الأنشطة (Title)', type: 'text' }
  ],
  'course-cards': [
    { key: 'title', label: 'عنوان قسم الكورسات (Title)', type: 'text' }
  ],
  'sidebar': [
    { key: 'title', label: 'اسم الأكاديمية (Title)', type: 'text' },
    { key: 'logoText', label: 'حرف الشعار (Logo Text)', type: 'text' }
  ],
  'navbar': [
    { key: 'title', label: 'عنوان الترويسة (Title)', type: 'text' }
  ],
  'metrics': [
    { key: 'title', label: 'عنوان قسم المؤشرات (Title)', type: 'text' }
  ],
};

export default function InspectorPanel() {
  const { selectedNodeId, currentTemplate, updateNodeProps, setSelectedNodeId } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'spacing'>('content');
  const [iconSearch, setIconSearch] = useState('');
  const [showIconDropdown, setShowIconDropdown] = useState<string | null>(null);
  const [expandedLine, setExpandedLine] = useState<string | null>(null);

  // Auto-reset tab on node selection change
  useEffect(() => {
    setActiveTab('content');
    setExpandedLine(null);
  }, [selectedNodeId]);

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
        <button
          onClick={() => setActiveTab('spacing')}
          className={`flex-1 py-3 text-[11px] font-black border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'spacing' ? 'border-blue-500 text-blue-600 bg-blue-50/10' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          الهوامش
        </button>
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
                  <input 
                    type="text" 
                    value={props[field.name] ?? ''} 
                    onChange={(e) => handlePropChange(field.name, e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all"
                  />
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

            {/* Special Editor for KPI Cards lists */}
            {selectedNode.type === 'kpi-cards' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل بطاقات المؤشرات</label>
                {(props.cards || []).map((card: any, idx: number) => (
                  <div key={card.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400">بطاقة #{idx + 1}</span>
                      <button 
                        onClick={() => {
                          const updatedCards = props.cards.filter((c: any) => c.id !== card.id);
                          handlePropChange('cards', updatedCards);
                        }}
                        className="text-rose-500 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input 
                      type="text"
                      placeholder="العنوان"
                      value={card.title}
                      onChange={(e) => {
                        const updated = props.cards.map((c: any) => c.id === card.id ? { ...c, title: e.target.value } : c);
                        handlePropChange('cards', updated);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
                    />
                    
                    <input 
                      type="text"
                      placeholder="القيمة"
                      value={card.value}
                      onChange={(e) => {
                        const updated = props.cards.map((c: any) => c.id === card.id ? { ...c, value: e.target.value } : c);
                        handlePropChange('cards', updated);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
                    />

                    {/* Icon Selection Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowIconDropdown(showIconDropdown === card.id ? null : card.id)}
                        className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 text-right flex justify-between items-center"
                      >
                        <span>أيقونة: {card.icon}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {showIconDropdown === card.id && (
                        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg p-2.5 z-50 max-h-[160px] overflow-y-auto">
                          <input 
                            type="text"
                            placeholder="ابحث عن أيقونة..."
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none mb-2"
                          />
                          <div className="grid grid-cols-4 gap-1.5">
                            {AVAILABLE_ICONS.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase())).map((icon) => (
                              <button
                                type="button"
                                key={icon}
                                onClick={() => {
                                  const updated = props.cards.map((c: any) => c.id === card.id ? { ...c, icon: icon } : c);
                                  handlePropChange('cards', updated);
                                  setShowIconDropdown(null);
                                  setIconSearch('');
                                }}
                                className="p-1.5 hover:bg-slate-50 border border-slate-50 rounded text-center text-xs font-semibold text-slate-600"
                              >
                                {icon.substr(0, 4)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newCard = {
                      id: String(Date.now()),
                      title: 'مؤشر جديد',
                      value: '0',
                      change: '0%',
                      isPositive: true,
                      icon: 'Sparkles',
                      color: '#2563eb'
                    };
                    handlePropChange('cards', [...(props.cards || []), newCard]);
                  }}
                  className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة بطاقة جديدة</span>
                </button>
              </div>
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
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={props[field.name] ?? field.defaultValue} 
                      onChange={(e) => handlePropChange(field.name, e.target.value)}
                      className="w-10 h-10 p-0 rounded-xl border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent"
                    />
                    
                    <input 
                      type="text" 
                      value={props[field.name] ?? field.defaultValue} 
                      onChange={(e) => handlePropChange(field.name, e.target.value)}
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold text-slate-600 outline-none text-left"
                      dir="ltr"
                    />
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
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 pr-1 block">محاذاة النص والكتلة</label>
                <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1 items-center">
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'right')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'right' || !props.align ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'center')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'center' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropChange('align', 'left')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-all ${
                      props.align === 'left' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Elementor-style Line Typography Accordion */}
            {EDITABLE_LINES[selectedNode.type] && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-400 pr-1 block">
                  تنسيق وتخصيص أسطر النصوص (طراز المنتور)
                </span>
                
                <div className="space-y-2">
                  {EDITABLE_LINES[selectedNode.type].map((line) => {
                    const isExpanded = expandedLine === line.key;
                    
                    const textValue = props[line.key] ?? '';
                    const fontFamily = props[`${line.key}FontFamily`] ?? 'IBM Plex Sans Arabic';
                    const fontSize = props[`${line.key}FontSize`] ?? '';
                    const fontWeight = props[`${line.key}FontWeight`] ?? '';
                    const fontColor = props[`${line.key}Color`] ?? '';

                    return (
                      <div key={line.key} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                        <button
                          type="button"
                          onClick={() => setExpandedLine(isExpanded ? null : line.key)}
                          className="w-full p-3.5 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors text-right"
                        >
                          <span className="text-[11px] font-black text-slate-700">{line.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="p-4 space-y-4 border-t border-slate-100 bg-white">
                            {/* Text Input */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 block">محتوى النص</label>
                              {line.type === 'textarea' ? (
                                <textarea
                                  rows={2}
                                  value={textValue}
                                  onChange={(e) => handlePropChange(line.key, e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all resize-none"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={textValue}
                                  onChange={(e) => handlePropChange(line.key, e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none transition-all"
                                />
                              )}
                            </div>

                            {/* Font Family */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 block">نوع الخط (Font Family)</label>
                              <div className="relative">
                                <select
                                  value={fontFamily}
                                  onChange={(e) => handlePropChange(`${line.key}FontFamily`, e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                                >
                                  {AVAILABLE_FONTS.map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            {/* Font Size */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 block">حجم الخط (Size)</label>
                              <div className="relative">
                                <select
                                  value={fontSize}
                                  onChange={(e) => handlePropChange(`${line.key}FontSize`, e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                                >
                                  <option value="">تلقائي (حسب التصميم)</option>
                                  {AVAILABLE_SIZES.map(sz => (
                                    <option key={sz.value} value={sz.value}>{sz.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            {/* Font Weight */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 block">وزن الخط (Weight)</label>
                              <div className="relative">
                                <select
                                  value={fontWeight}
                                  onChange={(e) => handlePropChange(`${line.key}FontWeight`, e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none"
                                >
                                  <option value="">تلقائي</option>
                                  {AVAILABLE_WEIGHTS.map(w => (
                                    <option key={w.value} value={w.value}>{w.label}</option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            {/* Font Color */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-400 block">لون النص (Color)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={fontColor || '#1f2937'}
                                  onChange={(e) => handlePropChange(`${line.key}Color`, e.target.value)}
                                  className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer overflow-hidden outline-none bg-transparent shrink-0"
                                />
                                <input
                                  type="text"
                                  value={fontColor}
                                  placeholder="تلقائي"
                                  onChange={(e) => handlePropChange(`${line.key}Color`, e.target.value)}
                                  className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-left"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
