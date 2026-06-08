'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Plus, 
  Trash2, 
  Edit2, 
  Move, 
  X, 
  Upload, 
  Grid, 
  Save, 
  Link as LinkIcon, 
  HelpCircle,
  Settings,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface MenuItem {
  id: string;
  name: string;
  link: string;
  iconUrl?: string;
}

// ----------------------------------------------------------------------
// Initial Mock Data
// ----------------------------------------------------------------------
const INITIAL_HEADER_ITEMS: MenuItem[] = [
  { id: 'h1', name: 'الرئيسية', link: '/' },
  { id: 'h2', name: 'من نحن', link: '/about' },
  { id: 'h3', name: 'الدورات', link: '/courses' },
  { id: 'h4', name: 'اتصل بنا', link: '/contact' }
];

const INITIAL_FOOTER_ITEMS: MenuItem[] = [
  { id: 'f1', name: 'الأسئلة الشائعة', link: '/faqs' },
  { id: 'f2', name: 'شروط الخدمة', link: '/terms' },
  { id: 'f3', name: 'سياسة الخصوصية', link: '/privacy' }
];

export default function MenusPage() {
  const [activeMenuTab, setActiveMenuTab] = useState<'header' | 'footer'>('header');
  const [headerItems, setHeaderItems] = useState<MenuItem[]>(INITIAL_HEADER_ITEMS);
  const [footerItems, setFooterItems] = useState<MenuItem[]>(INITIAL_FOOTER_ITEMS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Load from local storage
  useEffect(() => {
    const cachedHeader = localStorage.getItem('darab_menu_header');
    const cachedFooter = localStorage.getItem('darab_menu_footer');
    if (cachedHeader) setHeaderItems(JSON.parse(cachedHeader));
    if (cachedFooter) setFooterItems(JSON.parse(cachedFooter));
  }, []);

  const saveHeader = (items: MenuItem[]) => {
    setHeaderItems(items);
    localStorage.setItem('darab_menu_header', JSON.stringify(items));
  };

  const saveFooter = (items: MenuItem[]) => {
    setFooterItems(items);
    localStorage.setItem('darab_menu_footer', JSON.stringify(items));
  };

  const activeItems = activeMenuTab === 'header' ? headerItems : footerItems;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'حذف عنصر القائمة',
      text: `هل أنت متأكد من حذف العنصر "${name}"؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      customClass: {
        popup: 'rounded-[2rem]',
      }
    });

    if (result.isConfirmed) {
      if (activeMenuTab === 'header') {
        saveHeader(headerItems.filter(item => item.id !== id));
      } else {
        saveFooter(footerItems.filter(item => item.id !== id));
      }
      toast.success('تم حذف العنصر بنجاح.');
    }
  };

  const handleSaveItem = (item: MenuItem, isNew: boolean) => {
    if (activeMenuTab === 'header') {
      const updated = isNew 
        ? [...headerItems, item] 
        : headerItems.map(h => h.id === item.id ? item : h);
      saveHeader(updated);
    } else {
      const updated = isNew 
        ? [...footerItems, item] 
        : footerItems.map(f => f.id === item.id ? item : f);
      saveFooter(updated);
    }
    setIsModalOpen(false);
    toast.success(isNew ? 'تمت إضافة العنصر بنجاح!' : 'تم حفظ تعديلات العنصر.');
  };

  // Re-order simulation buttons
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetList = [...activeItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= targetList.length) return;
    
    // Swap items
    const temp = targetList[index];
    targetList[index] = targetList[targetIndex];
    targetList[targetIndex] = temp;

    if (activeMenuTab === 'header') {
      saveHeader(targetList);
    } else {
      saveFooter(targetList);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 text-right animate-slide-up-fade" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Menu className="w-8 h-8 text-[#4880FF]" />
            <span>إعدادات القوائم</span>
          </h2>
          <p className="text-gray-400 font-bold mt-2">قم ببناء وتعديل قوائم التنقل العلوية (الهيدر) والسفلية (الفوتر)</p>
        </div>
        
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#4880FF] hover:bg-blue-600 text-white font-black transition-all shadow-xl shadow-blue-500/10 active:scale-95 text-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>إضافة عنصر جديد</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-100/80 border border-slate-200/40 rounded-3xl p-1.5 max-w-sm mb-8 select-none">
        <button
          onClick={() => setActiveMenuTab('header')}
          className={`flex-1 text-center py-3 rounded-2xl text-xs font-black transition-all ${
            activeMenuTab === 'header' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          قائمة الهيدر (العلوية)
        </button>
        <button
          onClick={() => setActiveMenuTab('footer')}
          className={`flex-1 text-center py-3 rounded-2xl text-xs font-black transition-all ${
            activeMenuTab === 'footer' 
              ? 'bg-white text-slate-800 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          قائمة الفوتر (السفلية)
        </button>
      </div>

      {/* Main List Card */}
      <div className="bg-white rounded-[40px] shadow-[0_12px_40px_rgba(25,28,29,0.02)] border border-gray-100 p-8 md:p-10 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <h3 className="text-lg font-black text-slate-800">
            {activeMenuTab === 'header' ? 'روابط الترويسة الرئيسية' : 'روابط تذييل الصفحة'}
          </h3>
          <span className="text-xs text-slate-400 font-bold">يمكنك إعادة ترتيب العناصر وتحديث روابطها</span>
        </div>

        {/* Menu items listing */}
        <div className="space-y-4">
          {activeItems.length > 0 ? (
            activeItems.map((item, index) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-5 bg-slate-50/60 border border-slate-100 hover:border-slate-200 rounded-[2rem] transition-all group"
              >
                
                {/* Right: Drag icon & Info */}
                <div className="flex items-center gap-4">
                  {/* Reorder arrows */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button 
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-white border border-transparent hover:border-slate-100 rounded text-slate-400 hover:text-[#4880FF] transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ChevronDown className="w-3.5 h-3.5 rotate-185" />
                    </button>
                    <button 
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === activeItems.length - 1}
                      className="p-1 hover:bg-white border border-transparent hover:border-slate-100 rounded text-slate-400 hover:text-[#4880FF] transition-all disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Icon image preview (if existing) */}
                  {item.iconUrl ? (
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                      <img src={item.iconUrl} alt="Menu item icon" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors shrink-0">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                  )}

                  {/* Text details */}
                  <div>
                    <span className="font-extrabold text-slate-800 text-sm block">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold block mt-0.5" dir="ltr">{item.link}</span>
                  </div>
                </div>

                {/* Left: Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-xl border border-gray-100 shadow-sm transition-all"
                    title="تعديل"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-3 bg-white text-gray-400 hover:text-red-600 rounded-xl border border-gray-100 shadow-sm transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 font-bold italic">
              القائمة فارغة حالياً. قم بإضافة عناصر جديدة للبدء.
            </div>
          )}
        </div>

      </div>

      {/* Menu Item Dialog Modal (matches Screenshot 5) */}
      <MenuDialogModal 
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        menuType={activeMenuTab === 'header' ? 'قائمة الهيدر (العلوية)' : 'قائمة الفوتر (السفلية)'}
      />

    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Component: Modal Dialog Form (matches Screenshot 5 UI)
// ----------------------------------------------------------------------
interface MenuDialogModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem, isNew: boolean) => void;
  menuType: string;
}

function MenuDialogModal({ isOpen, item, onClose, onSave, menuType }: MenuDialogModalProps) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const localIconUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setName(item.name);
        setLink(item.link);
        setIconPreview(item.iconUrl || null);
      } else {
        setName('');
        setLink('');
        setIconPreview(null);
      }
    }

    return () => {
      // Memory cleanup for object URLs (garbage collection)
      if (localIconUrlRef.current) {
        URL.revokeObjectURL(localIconUrlRef.current);
        localIconUrlRef.current = null;
      }
    };
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    // Revoke previous URL to release memory (garbage collector)
    if (localIconUrlRef.current) {
      URL.revokeObjectURL(localIconUrlRef.current);
      localIconUrlRef.current = null;
    }

    const objectUrl = URL.createObjectURL(file);
    localIconUrlRef.current = objectUrl;
    setIconPreview(objectUrl);
  };

  const handleRemoveIcon = () => {
    if (localIconUrlRef.current) {
      URL.revokeObjectURL(localIconUrlRef.current);
      localIconUrlRef.current = null;
    }
    setIconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('الرجاء إدخال اسم العنصر');
      return;
    }

    if (!link.trim()) {
      toast.error('الرجاء إدخال رابط العنصر');
      return;
    }

    const savedItem: MenuItem = {
      id: item?.id || String(Date.now()),
      name: name.trim(),
      link: link.trim(),
      iconUrl: iconPreview || undefined
    };

    onSave(savedItem, !item);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      
      {/* Modal Container Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col text-right transform scale-100 transition-all duration-300">
        
        {/* Header (modal title matches Screenshot 5 background title context) */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-800">{item ? 'تعديل عنصر' : 'إضافة عنصر جديد'}</h3>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">إضافة الرابط لـ {menuType}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors border border-slate-100 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Item Name */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-500 pr-2 block">اسم العنصر</label>
            <input 
              type="text" 
              placeholder="ادخل اسم العنصر"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4.5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-[2rem] outline-none transition-all font-bold text-gray-900 text-sm"
            />
          </div>

          {/* Item Link */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-500 pr-2 block">ادخل الرابط</label>
            <input 
              type="text" 
              placeholder="ادخل الرابط"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-4.5 bg-gray-50 border border-gray-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-[2rem] outline-none transition-all font-bold text-gray-900 text-sm"
            />
          </div>

          {/* Item Icon drag & drop area (matches Screenshot 5) */}
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-500 pr-2 block">الايقون الخاصة بالعنصر</label>
            
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {iconPreview ? (
              /* Icon preview block */
              <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner group bg-slate-50 flex items-center justify-center p-4 min-h-[140px]">
                <img 
                  src={iconPreview} 
                  alt="Menu icon item preview"
                  className="max-h-[90px] object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveIcon}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors active:scale-95"
                  title="حذف الأيقونة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Drag box matching Screenshot 5 design layout */
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border border-slate-200 hover:border-blue-400 hover:bg-blue-50/5 cursor-pointer rounded-[2rem] p-8 transition-all duration-300 flex flex-col items-center justify-center space-y-3 bg-slate-50/20"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                  <Grid className="w-5 h-5" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-slate-700 block">اضغط للتحميل أو اسحب الملف الي هنا</span>
                  <span className="text-[9px] text-slate-400 font-bold block">الحجم الاقصى للملف : 500MB , MP4,PDF,PPTX</span>
                </div>
              </div>
            )}
          </div>

          {/* Form Action buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
            <button
              type="submit"
              className="flex-1 bg-[#4880FF] hover:bg-blue-600 text-white py-4.5 rounded-[2rem] font-black text-base shadow-xl shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>حفظ</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[2rem] font-black text-base transition-all active:scale-[0.99]"
            >
              إلغاء
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
