import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { MOCK_TABS } from '../../components/TabsBlock';

interface TabsBlockEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export default function TabsBlockEditor({
  props,
  handlePropChange,
}: TabsBlockEditorProps) {
  const tabs = props.tabs || MOCK_TABS;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل علامات التبويب</label>
      {tabs.map((tab: any, idx: number) => (
        <div key={tab.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 relative group">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400">تبويب #{idx + 1}</span>
            <button 
              onClick={() => {
                const updated = tabs.filter((t: any) => t.id !== tab.id);
                handlePropChange('tabs', updated);
              }}
              className="text-rose-500 hover:text-rose-600 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input 
            type="text"
            placeholder="عنوان التبويب"
            value={tab.label}
            onChange={(e) => {
              const updated = tabs.map((t: any) => t.id === tab.id ? { ...t, label: e.target.value } : t);
              handlePropChange('tabs', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => {
          const newTab = {
            id: String(Date.now()),
            label: 'تبويب جديد'
          };
          handlePropChange('tabs', [...tabs, newTab]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة تبويب جديد</span>
      </button>
    </div>
  );
}
