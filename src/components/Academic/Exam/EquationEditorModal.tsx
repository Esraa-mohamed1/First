'use client';

import React, { useState, useMemo } from 'react';
import { X, Check, Calculator, Sparkles, Trash2, Atom, FlaskConical } from 'lucide-react';
import { KaTeXRenderer } from './KaTeXRenderer';

interface EquationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (latexCode: string) => void;
  initialLatex?: string;
  initialCategory?: 'math' | 'phys' | 'chem';
}

interface MathSymbolItem {
  label: string;
  latex: string;
  display: string;
  category: 'math' | 'phys' | 'chem';
}

const SYMBOL_PALETTE: MathSymbolItem[] = [
  // --- Chemistry (كيمياء) matching user screenshot ---
  { label: 'صيغة', latex: 'H_2O', display: '\\text{H}_2\\text{O}', category: 'chem' },
  { label: 'يعطي', latex: '\\rightarrow ', display: '\\rightarrow', category: 'chem' },
  { label: 'انعكاسي', latex: '\\rightleftharpoons ', display: '\\rightleftharpoons', category: 'chem' },
  { label: 'بالحرارة', latex: '\\xrightarrow{\\Delta}', display: '\\xrightarrow{\\Delta}', category: 'chem' },
  { label: 'عامل حفاز', latex: '\\xrightarrow{\\text{Pt}}', display: '\\xrightarrow{\\text{Pt}}', category: 'chem' },
  { label: 'غاز ↑', latex: '\\uparrow ', display: '\\uparrow', category: 'chem' },
  { label: 'راسب ↓', latex: '\\downarrow ', display: '\\downarrow', category: 'chem' },
  { label: 'شحنة +', latex: '^{2+}', display: '^{2+}', category: 'chem' },
  { label: 'شحنة -', latex: '^{-}', display: '^{-}', category: 'chem' },
  { label: 'محلول', latex: '\\text{(aq)}', display: '\\text{(aq)}', category: 'chem' },
  { label: 'صلب', latex: '\\text{(s)}', display: '\\text{(s)}', category: 'chem' },
  { label: 'غاز', latex: '\\text{(g)}', display: '\\text{(g)}', category: 'chem' },
  { label: 'سائل', latex: '\\text{(l)}', display: '\\text{(l)}', category: 'chem' },
  { label: 'كبريتات', latex: 'SO_4^{2-}', display: '\\text{SO}_4^{2-}', category: 'chem' },
  { label: 'نترات', latex: 'NO_3^-', display: '\\text{NO}_3^-', category: 'chem' },
  { label: 'إلكترون', latex: 'e^-', display: 'e^-', category: 'chem' },
  { label: 'نظير', latex: '^{14}_6C', display: '^{14}_6\\text{C}', category: 'chem' },
  { label: 'متهدرت', latex: 'CuSO_4 \\cdot 5H_2O', display: '\\text{CuSO}_4 \\cdot 5\\text{H}_2\\text{O}', category: 'chem' },
  { label: 'حمض أسيتيك', latex: 'CH_3COOH', display: '\\text{CH}_3\\text{COOH}', category: 'chem' },
  { label: 'مثال', latex: '2H_2 + O_2 \\rightarrow 2H_2O', display: '2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}', category: 'chem' },

  // --- Physics (فيزياء) ---
  { label: 'سرعة', latex: 'v = \\frac{d}{t}', display: 'v = \\frac{d}{t}', category: 'phys' },
  { label: 'قوة', latex: 'F = ma', display: 'F = ma', category: 'phys' },
  { label: 'طاقة', latex: 'E = mc^2', display: 'E = mc^2', category: 'phys' },
  { label: 'أوم Ω', latex: '\\Omega ', display: '\\Omega', category: 'phys' },
  { label: 'طول موجي λ', latex: '\\lambda ', display: '\\lambda', category: 'phys' },
  { label: 'كثافة ρ', latex: '\\rho ', display: '\\rho', category: 'phys' },
  { label: 'زاوية θ', latex: '\\theta ', display: '\\theta', category: 'phys' },
  { label: 'تسارع', latex: 'a = \\frac{\\Delta v}{\\Delta t}', display: 'a = \\frac{\\Delta v}{\\Delta t}', category: 'phys' },
  { label: 'شغل', latex: 'W = F \\cdot d', display: 'W = F \\cdot d', category: 'phys' },
  { label: 'قدرة', latex: 'P = \\frac{W}{t}', display: 'P = \\frac{W}{t}', category: 'phys' },
  { label: 'جهد', latex: 'V = IR', display: 'V = IR', category: 'phys' },
  { label: 'تردد', latex: 'f = \\frac{1}{T}', display: 'f = \\frac{1}{T}', category: 'phys' },

  // --- Math (رياضيات) ---
  { label: 'كسر', latex: '\\frac{a}{b}', display: '\\frac{a}{b}', category: 'math' },
  { label: 'جذر تربيعي', latex: '\\sqrt{x}', display: '\\sqrt{x}', category: 'math' },
  { label: 'جذر نوني', latex: '\\sqrt[n]{x}', display: '\\sqrt[n]{x}', category: 'math' },
  { label: 'أس / قوة', latex: 'x^{n}', display: 'x^n', category: 'math' },
  { label: 'دليل سفلي', latex: 'x_{n}', display: 'x_n', category: 'math' },
  { label: 'زائد أو ناقص', latex: '\\pm ', display: '\\pm', category: 'math' },
  { label: 'ضرب', latex: '\\times ', display: '\\times', category: 'math' },
  { label: 'قسمة', latex: '\\div ', display: '\\div', category: 'math' },
  { label: 'لا يساوي', latex: '\\neq ', display: '\\neq', category: 'math' },
  { label: 'أصغر من أو يساوي', latex: '\\le ', display: '\\le', category: 'math' },
  { label: 'أكبر من أو يساوي', latex: '\\ge ', display: '\\ge', category: 'math' },
  { label: 'تقريباً', latex: '\\approx ', display: '\\approx', category: 'math' },
  { label: 'تكامل محدد', latex: '\\int_{a}^{b} f(x)\\,dx', display: '\\int_a^b f(x)dx', category: 'math' },
  { label: 'مجموع', latex: '\\sum_{i=1}^{n} x_i', display: '\\sum_{i=1}^n x_i', category: 'math' },
  { label: 'نهاية', latex: '\\lim_{x \\to 0} f(x)', display: '\\lim_{x\\to 0} f(x)', category: 'math' },
  { label: 'باي π', latex: '\\pi ', display: '\\pi', category: 'math' },
  { label: 'ألفا α', latex: '\\alpha ', display: '\\alpha', category: 'math' },
  { label: 'بيتا β', latex: '\\beta ', display: '\\beta', category: 'math' },
  { label: 'لانهاية ∞', latex: '\\infty ', display: '\\infty', category: 'math' },
];

export const EquationEditorModal: React.FC<EquationEditorModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialLatex = '',
  initialCategory = 'math',
}) => {
  const [latexCode, setLatexCode] = useState(initialLatex);
  const [activeTab, setActiveTab] = useState<'math' | 'phys' | 'chem'>(initialCategory || 'math');
  const [isStandaloneLine, setIsStandaloneLine] = useState(false);

  // Filter symbol palette by active category
  const filteredPalette = useMemo(() => {
    return SYMBOL_PALETTE.filter((item) => item.category === activeTab);
  }, [activeTab]);

  if (!isOpen) return null;

  const handleAppendSymbol = (symbolLatex: string) => {
    setLatexCode((prev) => (prev ? `${prev} ${symbolLatex}` : symbolLatex));
  };

  const handleConfirmInsert = () => {
    if (!latexCode.trim()) return;
    const formatted = isStandaloneLine ? `$$${latexCode.trim()}$$` : `$${latexCode.trim()}$`;
    onInsert(formatted);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      dir="rtl"
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <span>إدراج معادلة</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              أكتب الصيغة زي ما بتكتبها في الكشكول: <span className="font-mono text-slate-700 dir-ltr">2H2 + O2 → 2H2O</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs Bar (Matching screenshot 1: رياضيات / فيزياء / كيمياء) */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('math')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'math'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator size={15} />
              <span>رياضيات</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('phys')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'phys'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Atom size={15} />
              <span>فيزياء</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chem')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'chem'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical size={15} />
              <span>كيمياء</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 pt-2 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Symbol Palette Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {filteredPalette.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAppendSymbol(item.latex)}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 hover:shadow-xs text-slate-800 transition group cursor-pointer min-h-[64px]"
                title={item.label}
              >
                <div className="text-sm font-bold mb-1 text-slate-900">
                  <KaTeXRenderer content={`$${item.display}$`} inline />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600 truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Formula Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                {activeTab === 'chem' ? 'الصيغة الكيميائية' : 'كود المعادلة'}
              </label>
              <span className="text-[11px] font-medium text-slate-400 dir-ltr">
                (بصيغة LaTeX + mhchem)
              </span>
            </div>
            <textarea
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              rows={2}
              dir="ltr"
              placeholder={
                activeTab === 'chem'
                  ? 'مثال: Fe2O3 + 3CO -> 2Fe + 3CO2'
                  : 'مثال: \\frac{a}{b} أو x^2 + y^2 = r^2'
              }
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-800 font-mono text-xs md:text-sm outline-none focus:border-blue-500 transition resize-none shadow-2xs"
            />
          </div>

          {/* Live Preview Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">المعاينة</label>
            <div className="min-h-[76px] rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-3.5 flex items-center justify-center text-base md:text-lg text-slate-900 overflow-x-auto">
              {latexCode.trim() ? (
                <KaTeXRenderer content={`$$${latexCode.trim()}$$`} />
              ) : (
                <span className="text-xs font-bold text-slate-400">
                  المعادلة ستظهر هنا وأنت تكتب
                </span>
              )}
            </div>
          </div>

          {/* Standalone Line Option */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isStandaloneLine}
                onChange={(e) => setIsStandaloneLine(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-600">
                عرض المعادلة في سطر لوحدها (للمعادلات الكبيرة)
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 shrink-0">
          <button
            type="button"
            onClick={() => setLatexCode('')}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 transition"
          >
            مسح المعادلة
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleConfirmInsert}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>إدراج في السؤال</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
