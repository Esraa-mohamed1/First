'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, Calculator, Sparkles, Trash2, Atom, FlaskConical, Search } from 'lucide-react';
import { KaTeXRenderer } from './KaTeXRenderer';

interface EquationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (latexCode: string) => void;
  initialLatex?: string;
  initialCategory?: 'math' | 'phys' | 'chem';
  zIndexClass?: string;
  hideDisplayToggle?: boolean;
}

interface MathSymbolItem {
  label: string;
  latex: string;
  display?: string;
  category: 'math' | 'phys' | 'chem';
  group?: string;
}

const SYMBOL_PALETTE: MathSymbolItem[] = [
  // =========================================================================
  // CHEMISTRY (كيمياء) — Preserved exactly as existing (20 items)
  // =========================================================================
  { label: 'صيغة', latex: 'H_2O', display: '\\text{H}_2\\text{O}', category: 'chem', group: 'صيغ وتفاعلات' },
  { label: 'يعطي', latex: '\\rightarrow ', display: '\\rightarrow', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'انعكاسي', latex: '\\rightleftharpoons ', display: '\\rightleftharpoons', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'بالحرارة', latex: '\\xrightarrow{\\Delta}', display: '\\xrightarrow{\\Delta}', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'عامل حفاز', latex: '\\xrightarrow{\\text{Pt}}', display: '\\xrightarrow{\\text{Pt}}', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'غاز ↑', latex: '\\uparrow ', display: '\\uparrow', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'راسب ↓', latex: '\\downarrow ', display: '\\downarrow', category: 'chem', group: 'أسهم وظروف التفاعل' },
  { label: 'شحنة +', latex: '^{2+}', display: '^{2+}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'شحنة -', latex: '^{-}', display: '^{-}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'محلول', latex: '\\text{(aq)}', display: '\\text{(aq)}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'صلب', latex: '\\text{(s)}', display: '\\text{(s)}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'غاز', latex: '\\text{(g)}', display: '\\text{(g)}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'سائل', latex: '\\text{(l)}', display: '\\text{(l)}', category: 'chem', group: 'أيونات وحالات المادة' },
  { label: 'كبريتات', latex: 'SO_4^{2-}', display: '\\text{SO}_4^{2-}', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'نترات', latex: 'NO_3^-', display: '\\text{NO}_3^-', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'إلكترون', latex: 'e^-', display: 'e^-', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'نظير', latex: '^{14}_6C', display: '^{14}_6\\text{C}', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'متهدرت', latex: 'CuSO_4 \\cdot 5H_2O', display: '\\text{CuSO}_4 \\cdot 5\\text{H}_2\\text{O}', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'حمض أسيتيك', latex: 'CH_3COOH', display: '\\text{CH}_3\\text{COOH}', category: 'chem', group: 'مجموعات ذرية ونماذج' },
  { label: 'مثال', latex: '2H_2 + O_2 \\rightarrow 2H_2O', display: '2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}', category: 'chem', group: 'مجموعات ذرية ونماذج' },

  // =========================================================================
  // PHYSICS (فيزياء) — Existing entries (12 items)
  // =========================================================================
  { label: 'سرعة', latex: 'v = \\frac{d}{t}', display: 'v = \\frac{d}{t}', category: 'phys', group: 'شائعة' },
  { label: 'قوة', latex: 'F = ma', display: 'F = ma', category: 'phys', group: 'شائعة' },
  { label: 'طاقة', latex: 'E = mc^2', display: 'E = mc^2', category: 'phys', group: 'شائعة' },
  { label: 'أوم Ω', latex: '\\Omega ', display: '\\Omega', category: 'phys', group: 'شائعة' },
  { label: 'طول موجي λ', latex: '\\lambda ', display: '\\lambda', category: 'phys', group: 'شائعة' },
  { label: 'كثافة ρ', latex: '\\rho ', display: '\\rho', category: 'phys', group: 'شائعة' },
  { label: 'زاوية θ', latex: '\\theta ', display: '\\theta', category: 'phys', group: 'شائعة' },
  { label: 'تسارع', latex: 'a = \\frac{\\Delta v}{\\Delta t}', display: 'a = \\frac{\\Delta v}{\\Delta t}', category: 'phys', group: 'شائعة' },
  { label: 'شغل', latex: 'W = F \\cdot d', display: 'W = F \\cdot d', category: 'phys', group: 'شائعة' },
  { label: 'قدرة', latex: 'P = \\frac{W}{t}', display: 'P = \\frac{W}{t}', category: 'phys', group: 'شائعة' },
  { label: 'جهد', latex: 'V = IR', display: 'V = IR', category: 'phys', group: 'شائعة' },
  { label: 'تردد', latex: 'f = \\frac{1}{T}', display: 'f = \\frac{1}{T}', category: 'phys', group: 'شائعة' },

  // =========================================================================
  // PHYSICS (فيزياء) — New entries appended by group (74 new items)
  // =========================================================================
  // Group: رموز (Physics)
  { label: 'ألفا', latex: '\\alpha', category: 'phys', group: 'رموز' },
  { label: 'بيتا', latex: '\\beta', category: 'phys', group: 'رموز' },
  { label: 'جاما', latex: '\\gamma', category: 'phys', group: 'رموز' },
  { label: 'فاي', latex: '\\phi', category: 'phys', group: 'رموز' },
  { label: 'تاو', latex: '\\tau', category: 'phys', group: 'رموز' },
  { label: 'إيتا', latex: '\\eta', category: 'phys', group: 'رموز' },
  { label: 'سيجما', latex: '\\sigma', category: 'phys', group: 'رموز' },
  { label: 'ثابت بلانك المختزل', latex: '\\hbar', category: 'phys', group: 'رموز' },
  { label: 'نيو (تردد)', latex: '\\nu', category: 'phys', group: 'رموز' },
  { label: 'فيض', latex: '\\Phi', category: 'phys', group: 'رموز' },
  { label: 'متجه السرعة', latex: '\\vec{v}', category: 'phys', group: 'رموز' },
  { label: 'متجه العجلة', latex: '\\vec{a}', category: 'phys', group: 'رموز' },
  { label: 'المجال المغناطيسي', latex: '\\vec{B}', category: 'phys', group: 'رموز' },
  { label: 'المجال الكهربي', latex: '\\vec{E}', category: 'phys', group: 'رموز' },
  { label: 'متجه وحدة', latex: '\\hat{i}', category: 'phys', group: 'رموز' },
  { label: 'ضرب قياسي', latex: '\\vec{A} \\cdot \\vec{B}', category: 'phys', group: 'رموز' },
  { label: 'ضرب اتجاهي', latex: '\\vec{A} \\times \\vec{B}', category: 'phys', group: 'رموز' },
  { label: 'مقدار متجه', latex: '\\left| \\vec{F} \\right|', category: 'phys', group: 'رموز' },

  // Group: وحدات (Physics)
  { label: 'متر', latex: '\\,\\text{m}', category: 'phys', group: 'وحدات' },
  { label: 'ثانية', latex: '\\,\\text{s}', category: 'phys', group: 'وحدات' },
  { label: 'كجم', latex: '\\,\\text{kg}', category: 'phys', group: 'وحدات' },
  { label: 'م/ث', latex: '\\,\\text{m/s}', category: 'phys', group: 'وحدات' },
  { label: 'كم/س', latex: '\\,\\text{km/h}', category: 'phys', group: 'وحدات' },
  { label: 'سم', latex: '\\,\\text{cm}', category: 'phys', group: 'وحدات' },
  { label: 'نانومتر', latex: '\\,\\text{nm}', category: 'phys', group: 'وحدات' },
  { label: 'باسكال', latex: '\\,\\text{Pa}', category: 'phys', group: 'وحدات' },
  { label: 'هرتز', latex: '\\,\\text{Hz}', category: 'phys', group: 'وحدات' },
  { label: 'كولوم', latex: '\\,\\text{C}', category: 'phys', group: 'وحدات' },
  { label: 'فاراد', latex: '\\,\\text{F}', category: 'phys', group: 'وحدات' },
  { label: 'هنري', latex: '\\,\\text{H}', category: 'phys', group: 'وحدات' },
  { label: 'تسلا', latex: '\\,\\text{T}', category: 'phys', group: 'وحدات' },
  { label: 'ويبر', latex: '\\,\\text{Wb}', category: 'phys', group: 'وحدات' },
  { label: 'كلفن', latex: '\\,\\text{K}', category: 'phys', group: 'وحدات' },
  { label: 'درجة مئوية', latex: '^{\\circ}\\text{C}', category: 'phys', group: 'وحدات' },
  { label: 'مول', latex: '\\,\\text{mol}', category: 'phys', group: 'وحدات' },
  { label: 'كمية حركة', latex: '\\,\\text{kg}\\cdot\\text{m/s}', category: 'phys', group: 'وحدات' },
  { label: '×10⁻ⁿ', latex: '\\times 10^{-3}', category: 'phys', group: 'وحدات' },

  // Group: ميكانيكا (Physics)
  { label: 'السرعة النهائية', latex: 'v = u + at', category: 'phys', group: 'ميكانيكا' },
  { label: 'الإزاحة', latex: 's = ut + \\frac{1}{2}at^{2}', category: 'phys', group: 'ميكانيكا' },
  { label: 'معادلة الحركة الثالثة', latex: 'v^{2} = u^{2} + 2as', category: 'phys', group: 'ميكانيكا' },
  { label: 'كمية الحركة', latex: 'p = mv', category: 'phys', group: 'ميكانيكا' },
  { label: 'الشغل', latex: 'W = Fd\\cos\\theta', category: 'phys', group: 'ميكانيكا' },
  { label: 'طاقة وضع', latex: 'E_{p} = mgh', category: 'phys', group: 'ميكانيكا' },
  { label: 'الجذب العام', latex: 'F = G\\frac{m_{1}m_{2}}{r^{2}}', category: 'phys', group: 'ميكانيكا' },
  { label: 'زمن البندول', latex: 'T = 2\\pi\\sqrt{\\frac{l}{g}}', category: 'phys', group: 'ميكانيكا' },
  { label: 'العزم', latex: '\\tau = rF\\sin\\theta', category: 'phys', group: 'ميكانيكا' },
  { label: 'العجلة المركزية', latex: 'a_{c} = \\frac{v^{2}}{r}', category: 'phys', group: 'ميكانيكا' },
  { label: 'الكثافة', latex: '\\rho = \\frac{m}{V}', category: 'phys', group: 'ميكانيكا' },
  { label: 'الضغط', latex: 'P = \\frac{F}{A}', category: 'phys', group: 'ميكانيكا' },
  { label: 'قانون هوك', latex: 'F = -kx', category: 'phys', group: 'ميكانيكا' },

  // Group: كهرباء ومغناطيسية (Physics)
  { label: 'قانون كولوم', latex: 'F = k\\frac{q_{1}q_{2}}{r^{2}}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'المجال الكهربي', latex: 'E = \\frac{F}{q}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'السعة', latex: 'C = \\frac{Q}{V}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'المقاومة النوعية', latex: 'R = \\rho\\frac{L}{A}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'توالي', latex: 'R_{eq} = R_{1} + R_{2} + R_{3}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'قانون فاراداي', latex: '\\varepsilon = -\\frac{\\Delta\\Phi}{\\Delta t}', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'قوة مغناطيسية', latex: 'F = BIL\\sin\\theta', category: 'phys', group: 'كهرباء ومغناطيسية' },
  { label: 'المحول', latex: '\\frac{V_{p}}{V_{s}} = \\frac{N_{p}}{N_{s}}', category: 'phys', group: 'كهرباء ومغناطيسية' },

  // Group: موجات وضوء (Physics)
  { label: 'سرعة الموجة', latex: 'v = f\\lambda', category: 'phys', group: 'موجات وضوء' },
  { label: 'معامل الانكسار', latex: 'n = \\frac{c}{v}', category: 'phys', group: 'موجات وضوء' },
  { label: 'قانون سنل', latex: 'n_{1}\\sin\\theta_{1} = n_{2}\\sin\\theta_{2}', category: 'phys', group: 'موجات وضوء' },
  { label: 'قانون العدسة', latex: '\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}', category: 'phys', group: 'موجات وضوء' },
  { label: 'طاقة الفوتون', latex: 'E = hf', category: 'phys', group: 'موجات وضوء' },

  // Group: حرارة وفيزياء حديثة (Physics)
  { label: 'كمية الحرارة', latex: 'Q = mc\\Delta T', category: 'phys', group: 'حرارة وفيزياء حديثة' },
  { label: 'الغاز المثالي', latex: 'PV = nRT', category: 'phys', group: 'حرارة وفيزياء حديثة' },
  { label: 'القانون الأول', latex: '\\Delta U = Q - W', category: 'phys', group: 'حرارة وفيزياء حديثة' },
  { label: 'الاضمحلال الإشعاعي', latex: 'N = N_{0}e^{-\\lambda t}', category: 'phys', group: 'حرارة وفيزياء حديثة' },
  { label: 'دي برولي', latex: '\\lambda = \\frac{h}{p}', category: 'phys', group: 'حرارة وفيزياء حديثة' },
  { label: 'الكفاءة', latex: '\\eta = \\frac{W}{Q_{H}}', category: 'phys', group: 'حرارة وفيزياء حديثة' },

  // Group: ثوابت (Physics)
  { label: 'عجلة الجاذبية', latex: 'g = 9.8\\,\\text{m/s}^{2}', category: 'phys', group: 'ثوابت' },
  { label: 'سرعة الضوء', latex: 'c = 3 \\times 10^{8}\\,\\text{m/s}', category: 'phys', group: 'ثوابت' },
  { label: 'ثابت الجذب', latex: 'G = 6.67 \\times 10^{-11}\\,\\text{N}\\cdot\\text{m}^{2}/\\text{kg}^{2}', category: 'phys', group: 'ثوابت' },
  { label: 'ثابت بلانك', latex: 'h = 6.63 \\times 10^{-34}\\,\\text{J}\\cdot\\text{s}', category: 'phys', group: 'ثوابت' },
  { label: 'شحنة الإلكترون', latex: 'e = 1.6 \\times 10^{-19}\\,\\text{C}', category: 'phys', group: 'ثوابت' },

  // =========================================================================
  // MATH (رياضيات) — Existing entries (19 items)
  // =========================================================================
  { label: 'كسر', latex: '\\frac{a}{b}', display: '\\frac{a}{b}', category: 'math', group: 'شائعة' },
  { label: 'جذر تربيعي', latex: '\\sqrt{x}', display: '\\sqrt{x}', category: 'math', group: 'شائعة' },
  { label: 'جذر نوني', latex: '\\sqrt[n]{x}', display: '\\sqrt[n]{x}', category: 'math', group: 'شائعة' },
  { label: 'أس / قوة', latex: 'x^{n}', display: 'x^n', category: 'math', group: 'شائعة' },
  { label: 'دليل سفلي', latex: 'x_{n}', display: 'x_n', category: 'math', group: 'شائعة' },
  { label: 'زائد أو ناقص', latex: '\\pm ', display: '\\pm', category: 'math', group: 'شائعة' },
  { label: 'ضرب', latex: '\\times ', display: '\\times', category: 'math', group: 'شائعة' },
  { label: 'قسمة', latex: '\\div ', display: '\\div', category: 'math', group: 'شائعة' },
  { label: 'لا يساوي', latex: '\\neq ', display: '\\neq', category: 'math', group: 'شائعة' },
  { label: 'أصغر من أو يساوي', latex: '\\le ', display: '\\le', category: 'math', group: 'شائعة' },
  { label: 'أكبر من أو يساوي', latex: '\\ge ', display: '\\ge', category: 'math', group: 'شائعة' },
  { label: 'تقريباً', latex: '\\approx ', display: '\\approx', category: 'math', group: 'شائعة' },
  { label: 'تكامل محدد', latex: '\\int_{a}^{b} f(x)\\,dx', display: '\\int_a^b f(x)dx', category: 'math', group: 'شائعة' },
  { label: 'مجموع', latex: '\\sum_{i=1}^{n} x_i', display: '\\sum_{i=1}^n x_i', category: 'math', group: 'شائعة' },
  { label: 'نهاية', latex: '\\lim_{x \\to 0} f(x)', display: '\\lim_{x\\to 0} f(x)', category: 'math', group: 'شائعة' },
  { label: 'باي π', latex: '\\pi ', display: '\\pi', category: 'math', group: 'شائعة' },
  { label: 'ألفا α', latex: '\\alpha ', display: '\\alpha', category: 'math', group: 'شائعة' },
  { label: 'بيتا β', latex: '\\beta ', display: '\\beta', category: 'math', group: 'شائعة' },
  { label: 'لانهاية ∞', latex: '\\infty ', display: '\\infty', category: 'math', group: 'شائعة' },

  // =========================================================================
  // MATH (رياضيات) — New entries appended by group (65 new items)
  // =========================================================================
  // Group: أساسيات (Math)
  { label: '∓', latex: '\\mp', category: 'math', group: 'أساسيات' },
  { label: 'ضرب نقطة', latex: '\\cdot', category: 'math', group: 'أساسيات' },
  { label: 'مطابق', latex: '\\equiv', category: 'math', group: 'أساسيات' },
  { label: 'يشابه', latex: '\\sim', category: 'math', group: 'أساسيات' },
  { label: 'أقواس كبيرة', latex: '\\left( \\frac{a}{b} \\right)', category: 'math', group: 'أساسيات' },
  { label: 'الجزء الصحيح', latex: '\\lfloor x \\rfloor', category: 'math', group: 'أساسيات' },
  { label: 'التقريب لأعلى', latex: '\\lceil x \\rceil', category: 'math', group: 'أساسيات' },
  { label: 'مضروب', latex: 'n!', category: 'math', group: 'أساسيات' },
  { label: 'توافيق', latex: '\\binom{n}{k}', category: 'math', group: 'أساسيات' },
  { label: 'تباديل', latex: '{}^{n}P_{r}', category: 'math', group: 'أساسيات' },
  { label: 'نسبة مئوية', latex: '\\%', category: 'math', group: 'أساسيات' },

  // Group: هندسة (Math)
  { label: 'زاوية', latex: '\\angle ABC', category: 'math', group: 'هندسة' },
  { label: 'مثلث', latex: '\\triangle ABC', category: 'math', group: 'هندسة' },
  { label: 'يوازي', latex: '\\parallel', category: 'math', group: 'هندسة' },
  { label: 'عمودي', latex: '\\perp', category: 'math', group: 'هندسة' },
  { label: 'يطابق', latex: '\\cong', category: 'math', group: 'هندسة' },
  { label: 'قطعة مستقيمة', latex: '\\overline{AB}', category: 'math', group: 'هندسة' },
  { label: 'شعاع', latex: '\\overrightarrow{AB}', category: 'math', group: 'هندسة' },
  { label: 'قوس', latex: '\\widehat{AB}', category: 'math', group: 'هندسة' },
  { label: 'جتا', latex: '\\cos\\theta', category: 'math', group: 'هندسة' },
  { label: 'ظل', latex: '\\tan\\theta', category: 'math', group: 'هندسة' },

  // Group: رموز يونانية (Math)
  { label: 'جاما', latex: '\\gamma', category: 'math', group: 'رموز يونانية' },
  { label: 'دلتا صغيرة', latex: '\\delta', category: 'math', group: 'رموز يونانية' },
  { label: 'فاي', latex: '\\phi', category: 'math', group: 'رموز يونانية' },
  { label: 'سيجما', latex: '\\sigma', category: 'math', group: 'رموز يونانية' },
  { label: 'سيجما كبيرة', latex: '\\Sigma', category: 'math', group: 'رموز يونانية' },
  { label: 'دلتا كبيرة', latex: '\\Delta', category: 'math', group: 'رموز يونانية' },

  // Group: مجموعات ومنطق (Math)
  { label: 'ينتمي', latex: '\\in', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'لا ينتمي', latex: '\\notin', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'مجموعة جزئية', latex: '\\subset', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'جزئية أو تساوي', latex: '\\subseteq', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'اتحاد', latex: '\\cup', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'تقاطع', latex: '\\cap', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'المجموعة الخالية', latex: '\\emptyset', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'الأعداد الحقيقية', latex: '\\mathbb{R}', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'الأعداد الطبيعية', latex: '\\mathbb{N}', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'الأعداد الصحيحة', latex: '\\mathbb{Z}', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'الأعداد النسبية', latex: '\\mathbb{Q}', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'لكل', latex: '\\forall', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'يوجد', latex: '\\exists', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'يستلزم', latex: '\\Rightarrow', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'إذا وفقط إذا', latex: '\\Leftrightarrow', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'تؤول إلى', latex: '\\to', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'إذن', latex: '\\therefore', category: 'math', group: 'مجموعات ومنطق' },
  { label: 'لأن', latex: '\\because', category: 'math', group: 'مجموعات ومنطق' },

  // Group: تفاضل وتكامل (Math)
  { label: 'حاصل ضرب', latex: '\\prod_{i=1}^{n}', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'تكامل غير محدد', latex: '\\int f(x)\\,dx', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'تكامل مغلق', latex: '\\oint', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'نهاية عند ∞', latex: '\\lim_{x \\to \\infty}', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'مشتقة ثانية', latex: '\\frac{d^{2}y}{dx^{2}}', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'مشتقة جزئية', latex: '\\frac{\\partial f}{\\partial x}', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'مشتقة', latex: "f'(x)", category: 'math', group: 'تفاضل وتكامل' },
  { label: 'ناب لا', latex: '\\nabla', category: 'math', group: 'تفاضل وتكامل' },
  { label: 'تقييم بين حدين', latex: '\\left. f(x) \\right|_{a}^{b}', category: 'math', group: 'تفاضل وتكامل' },

  // Group: دوال (Math)
  { label: 'متطابقة', latex: '\\sin^{2}x + \\cos^{2}x = 1', category: 'math', group: 'دوال' },
  { label: 'معكوس الجيب', latex: '\\sin^{-1}x', category: 'math', group: 'دوال' },
  { label: 'لوغاريتم طبيعي', latex: '\\ln x', category: 'math', group: 'دوال' },
  { label: 'دالة أسية', latex: 'e^{x}', category: 'math', group: 'دوال' },
  { label: 'لوغاريتم عشري', latex: '\\log_{10}x', category: 'math', group: 'دوال' },

  // Group: جبر (Math)
  { label: 'القانون العام', latex: 'x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}', category: 'math', group: 'جبر' },
  { label: 'مربع مجموع', latex: '(a+b)^{2} = a^{2} + 2ab + b^{2}', category: 'math', group: 'جبر' },
  { label: 'فرق مربعين', latex: 'a^{2} - b^{2} = (a-b)(a+b)', category: 'math', group: 'جبر' },
  { label: 'معادلتان', latex: '\\begin{cases} x + y = 1 \\\\ x - y = 3 \\end{cases}', category: 'math', group: 'جبر' },
  { label: 'محدد', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', category: 'math', group: 'جبر' },
  { label: 'المتوسط', latex: '\\bar{x}', category: 'math', group: 'جبر' },
];

export const EquationEditorModal: React.FC<EquationEditorModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialLatex = '',
  initialCategory = 'math',
  zIndexClass = 'z-[130]',
  hideDisplayToggle = false,
}) => {
  const [latexCode, setLatexCode] = useState(initialLatex);
  const [activeTab, setActiveTab] = useState<'math' | 'phys' | 'chem'>(initialCategory || 'math');
  const [isStandaloneLine, setIsStandaloneLine] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setLatexCode(initialLatex || '');
      setActiveTab(initialCategory || 'math');
      setIsStandaloneLine(false);
      setSearchQuery('');
    }
  }, [isOpen, initialLatex, initialCategory]);

  // Reset search on tab change
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  // Escape key handler for topmost modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter symbol palette by active category and search query
  const filteredPalette = useMemo(() => {
    const categoryItems = SYMBOL_PALETTE.filter((item) => item.category === activeTab);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoryItems;
    return categoryItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.latex.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  // Group filtered items by section heading
  const groupedPalette = useMemo(() => {
    const groups: { name: string; items: MathSymbolItem[] }[] = [];
    const groupMap = new Map<string, MathSymbolItem[]>();

    for (const item of filteredPalette) {
      const gName = item.group || 'أخرى';
      if (!groupMap.has(gName)) {
        const arr: MathSymbolItem[] = [];
        groupMap.set(gName, arr);
        groups.push({ name: gName, items: arr });
      }
      groupMap.get(gName)!.push(item);
    }

    return groups;
  }, [filteredPalette]);

  if (!isOpen) return null;

  const handleAppendSymbol = (symbolLatex: string) => {
    setLatexCode((prev) => (prev ? `${prev} ${symbolLatex}` : symbolLatex));
  };

  const handleConfirmInsert = () => {
    if (!latexCode.trim()) return;
    const formatted = isStandaloneLine && !hideDisplayToggle
      ? `$$${latexCode.trim()}$$`
      : `$${latexCode.trim()}$`;
    onInsert(formatted);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150`}
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
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs Bar */}
        <div className="px-6 pt-4 pb-2 bg-white shrink-0">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('math')}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
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
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
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

        {/* Scrollable Modal Body */}
        <div className="p-6 pt-2 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">
          {/* Symbol Section */}
          <div className="space-y-2">
            {/* Search Box */}
            <div className="relative">
              <Search size={14} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن رمز…"
                className="w-full ps-9 pe-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="مسح البحث"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Bounded Scrollable Container for Symbol Tiles */}
            <div className="max-h-[220px] overflow-y-auto space-y-3 custom-scrollbar pe-1 border border-slate-100/80 rounded-2xl p-2 bg-slate-50/40">
              {groupedPalette.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-slate-400">
                  مفيش رمز بالاسم ده
                </div>
              ) : (
                groupedPalette.map((group) => (
                  <div key={group.name} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 px-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{group.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({group.items.length})</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
                      {group.items.map((item, idx) => {
                        const isLong = item.latex.length > 22;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAppendSymbol(item.latex)}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-xs text-slate-800 transition group cursor-pointer min-h-[58px] text-center ${
                              isLong ? 'col-span-2 sm:col-span-2' : ''
                            }`}
                            title={`${item.label} (${item.latex})`}
                          >
                            <div className="text-sm font-bold mb-0.5 text-slate-900 max-w-full overflow-x-hidden">
                              <KaTeXRenderer content={`$${item.display || item.latex}$`} inline />
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-600 truncate w-full px-1">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
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
            <div className="min-h-[72px] rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-3.5 flex items-center justify-center text-base md:text-lg text-slate-900 overflow-x-auto">
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
          {!hideDisplayToggle && (
            <div className="pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isStandaloneLine}
                  onChange={(e) => setIsStandaloneLine(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-600">
                  عرض المعادلة في سطر لوحدها (للمعادلات الكبيرة)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Modal Pinned Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 shrink-0">
          <button
            type="button"
            onClick={() => setLatexCode('')}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer"
          >
            مسح المعادلة
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
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
