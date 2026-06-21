import React from 'react';
import { Trash2, ChevronDown, Plus } from 'lucide-react';
import { AVAILABLE_ICONS, getIconComponent } from '../../utils/icons';

interface KpiCardsEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
  showIconDropdown: string | null;
  setShowIconDropdown: (id: string | null) => void;
  iconSearch: string;
  setIconSearch: (search: string) => void;
}

export default function KpiCardsEditor({
  props,
  handlePropChange,
  showIconDropdown,
  setShowIconDropdown,
  iconSearch,
  setIconSearch,
}: KpiCardsEditorProps) {
  const cards = props.cards || [];

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل بطاقات المؤشرات</label>
      {cards.map((card: any, idx: number) => {
        const IconComponent = getIconComponent(card.icon);
        return (
          <div key={card.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400">بطاقة #{idx + 1}</span>
              <button 
                onClick={() => {
                  const updatedCards = cards.filter((c: any) => c.id !== card.id);
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
                const updated = cards.map((c: any) => c.id === card.id ? { ...c, title: e.target.value } : c);
                handlePropChange('cards', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            
            <input 
              type="text"
              placeholder="القيمة"
              value={card.value}
              onChange={(e) => {
                const updated = cards.map((c: any) => c.id === card.id ? { ...c, value: e.target.value } : c);
                handlePropChange('cards', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />

            <input 
              type="text"
              placeholder="التغيير (مثال: +12% هذا الأسبوع)"
              value={card.change || ''}
              onChange={(e) => {
                const updated = cards.map((c: any) => c.id === card.id ? { ...c, change: e.target.value } : c);
                handlePropChange('cards', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />

            {/* Color and Positive Toggle */}
            <div className="flex items-center justify-between gap-3 bg-white p-2 border border-slate-100 rounded-xl">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={card.isPositive ?? true}
                  onChange={(e) => {
                    const updated = cards.map((c: any) => c.id === card.id ? { ...c, isPositive: e.target.checked } : c);
                    handlePropChange('cards', updated);
                  }}
                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-[9px] font-black text-slate-500">مؤشر إيجابي (+)</span>
              </label>
              
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-slate-400">اللون:</span>
                <input 
                  type="color"
                  value={card.color || '#2563eb'}
                  onChange={(e) => {
                    const updated = cards.map((c: any) => c.id === card.id ? { ...c, color: e.target.value } : c);
                    handlePropChange('cards', updated);
                  }}
                  className="w-6 h-6 p-0 rounded border border-slate-200 cursor-pointer overflow-hidden bg-transparent shrink-0"
                />
              </div>
            </div>

            {/* Icon Selection Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconDropdown(showIconDropdown === card.id ? null : card.id)}
                className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 text-right flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4 text-slate-500" />
                  <span>أيقونة: {card.icon}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showIconDropdown === card.id && (
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
                            const updated = cards.map((c: any) => c.id === card.id ? { ...c, icon: icon } : c);
                            handlePropChange('cards', updated);
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
          </div>
        );
      })}
      
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
          handlePropChange('cards', [...cards, newCard]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة بطاقة جديدة</span>
      </button>
    </div>
  );
}
