import React, { useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { MOCK_ROWS } from '../../components/TableBlock';
import { useBuilderStore } from '../../store/builderStore';

interface TableBlockEditorProps {
  props: Record<string, any>;
  handlePropChange: (key: string, value: any) => void;
}

export default function TableBlockEditor({
  props,
  handlePropChange,
}: TableBlockEditorProps) {
  const rows = props.rows || MOCK_ROWS;
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
      <label className="text-[10px] font-black text-slate-400 pr-1 block">تعديل أسطر الجدول</label>
      {rows.map((row: any, idx: number) => (
        <div 
          key={row.id} 
          id={`item-editor-${idx}`}
          className={`p-3.5 bg-slate-50 border rounded-2xl space-y-3 relative group transition-all duration-300 ${
            selectedItemIndex === idx ? 'border-blue-500 shadow-md bg-blue-50/10 ring-2 ring-blue-500/20' : 'border-slate-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400">سطر #{idx + 1}</span>
            <button 
              onClick={() => {
                const updated = rows.filter((r: any) => r.id !== row.id);
                handlePropChange('rows', updated);
              }}
              className="text-rose-500 hover:text-rose-600 transition-colors p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input 
            type="text"
            placeholder="اسم الطالب"
            value={row.name}
            onChange={(e) => {
              const updated = rows.map((r: any) => r.id === row.id ? { ...r, name: e.target.value } : r);
              handlePropChange('rows', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <input 
            type="email"
            placeholder="البريد الإلكتروني"
            value={row.email}
            onChange={(e) => {
              const updated = rows.map((r: any) => r.id === row.id ? { ...r, email: e.target.value } : r);
              handlePropChange('rows', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <input 
            type="text"
            placeholder="اسم الدورة المسجل بها"
            value={row.course}
            onChange={(e) => {
              const updated = rows.map((r: any) => r.id === row.id ? { ...r, course: e.target.value } : r);
              handlePropChange('rows', updated);
            }}
            className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              placeholder="السعر (مثال: 250 ريال)"
              value={row.price}
              onChange={(e) => {
                const updated = rows.map((r: any) => r.id === row.id ? { ...r, price: e.target.value } : r);
                handlePropChange('rows', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
            <input 
              type="text"
              placeholder="التاريخ (مثال: 2026/06/07)"
              value={row.date}
              onChange={(e) => {
                const updated = rows.map((r: any) => r.id === row.id ? { ...r, date: e.target.value } : r);
                handlePropChange('rows', updated);
              }}
              className="w-full p-2.5 bg-white border border-slate-100 rounded-xl text-xs font-bold outline-none"
            />
          </div>
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => {
          const newRow = {
            id: String(Date.now()),
            name: 'طالب جديد',
            email: 'new.student@email.com',
            course: 'كورس تجريبي جديد',
            price: '100 ريال',
            date: new Date().toLocaleDateString('zh-Hans-CN')
          };
          handlePropChange('rows', [...rows, newRow]);
        }}
        className="w-full py-3 border border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-1.5 text-slate-500 hover:text-blue-500 text-xs font-black transition-all bg-slate-50/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة سطر جديد للجدول</span>
      </button>
    </div>
  );
}
