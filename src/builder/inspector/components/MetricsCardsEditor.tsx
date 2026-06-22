import React, { useEffect } from 'react';
import { Trash2, ChevronDown, Plus } from 'lucide-react';
import { AVAILABLE_ICONS, getIconComponent } from '../../utils/icons';
import { MOCK_METRICS } from '../../components/MetricsCards';
import { useBuilderStore } from '../../store/builderStore';

interface MetricsCardsEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
  showIconDropdown: string | null;
  setShowIconDropdown: (id: string | null) => void;
  iconSearch: string;
  setIconSearch: (search: string) => void;
}

export default function MetricsCardsEditor({
  props,
  handlePropChange,
  showIconDropdown,
  setShowIconDropdown,
  iconSearch,
  setIconSearch,
}: MetricsCardsEditorProps) {
  const metrics = props.metrics || MOCK_METRICS;
  const { selectedItemIndex } = useBuilderStore();

  useEffect(() => {
    if (selectedItemIndex !== null) {
      const element = document.getElementById(`item-editor-${selectedItemIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedItemIndex]);

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل مؤشرات الأداء</label>
      {metrics.map((metric: any, idx: number) => {
        const IconComponent = getIconComponent(metric.icon);
        return (
          <div 
            key={idx} 
            id={`item-editor-${idx}`}
            className={`p-3.5 bg-slate-50 border rounded-2xl space-y-3 relative group transition-all duration-300 ${
              selectedItemIndex === idx ? 'border-blue-500 shadow-md bg-blue-50/10 ring-2 ring-blue-500/20' : 'border-slate-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400">مؤشر #{idx + 1}</span>
              <button 
                onClick={() => {
                  const updated = metrics.filter((_: any, i: number) => i !== idx);
                  handlePropChange('metrics', updated);
                }}
                className="text-rose-500 hover:text-rose-600 transition-colors p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <input 
              type="text"
              placeholder="العنوان (مثال: نسبة النجاح العامة)"
              value={metric.label}
              onChange={(e) => {
                const updated = metrics.map((m: any, i: number) => i === idx ? { ...m, label: e.target.value } : m);
                handlePropChange('metrics', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />

            <input 
              type="text"
              placeholder="القيمة (مثال: 94.2%)"
              value={metric.value}
              onChange={(e) => {
                const updated = metrics.map((m: any, i: number) => i === idx ? { ...m, value: e.target.value } : m);
                handlePropChange('metrics', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />

            <input 
              type="text"
              placeholder="الوصف (مثال: بزيادة 1.8% عن الشهر الماضي)"
              value={metric.desc}
              onChange={(e) => {
                const updated = metrics.map((m: any, i: number) => i === idx ? { ...m, desc: e.target.value } : m);
                handlePropChange('metrics', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />

            {/* Icon Selection Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconDropdown(showIconDropdown === `metric-${idx}` ? null : `metric-${idx}`)}
                className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 text-right flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-slate-500" />
                  <span>أيقونة: {metric.icon}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showIconDropdown === `metric-${idx}` && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg p-2.5 z-50 max-h-[200px] overflow-y-auto">
                  <input 
                    type="text"
                    placeholder="ابحث عن أيقونة..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold outline-none mb-2"
                  />
                  <div className="grid grid-cols-4 gap-1.5">
                    {AVAILABLE_ICONS.filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase())).map((icon) => {
                      const IconComp = getIconComponent(icon);
                      return (
                        <button
                          type="button"
                          key={icon}
                          title={icon}
                          onClick={() => {
                            const updated = metrics.map((m: any, i: number) => i === idx ? { ...m, icon: icon } : m);
                            handlePropChange('metrics', updated);
                            setShowIconDropdown(null);
                            setIconSearch('');
                          }}
                          className="p-2 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all"
                        >
                          <IconComp className="w-4 h-4 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-[9px] font-black text-slate-400">اللون:</span>
              <input 
                type="color"
                value={metric.color || '#2563eb'}
                onChange={(e) => {
                  const updated = metrics.map((m: any, i: number) => i === idx ? { ...m, color: e.target.value } : m);
                  handlePropChange('metrics', updated);
                }}
                className="w-7 h-7 p-0 rounded border border-slate-200 cursor-pointer overflow-hidden bg-transparent"
              />
            </div>
          </div>
        );
      })}
      
      <button
        type="button"
        onClick={() => {
          const newMetric = {
            label: 'مؤشر أداء جديد',
            value: '0%',
            desc: 'وصف لمؤشر الأداء المضاف',
            icon: 'Sparkles',
            color: '#2563eb'
          };
          handlePropChange('metrics', [...metrics, newMetric]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة مؤشر جديد</span>
      </button>
    </div>
  );
}
