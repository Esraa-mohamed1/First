import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/student';
import { User, Loader2, Pencil, Check, X } from 'lucide-react';

interface PersonalInfoProps {
  profile: UserProfile;
  onSave: (updatedData: { name: string; email: string; phone?: string }) => Promise<void>;
}

export const PersonalInfo = ({ profile, onSave }: PersonalInfoProps) => {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [editingFields, setEditingFields] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});
  const [isSavingField, setIsSavingField] = useState<'name' | 'email' | 'phone' | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setPhone(profile.phone || '');
  }, [profile]);

  const handleFieldSave = async (field: 'name' | 'email' | 'phone') => {
    setIsSavingField(field);
    try {
      await onSave({ name, email, phone });
      setEditingFields(prev => ({ ...prev, [field]: false }));
    } catch (e) {
      // Keep in editing mode if error occurs
    } finally {
      setIsSavingField(null);
    }
  };

  const handleFieldCancel = (field: 'name' | 'email' | 'phone') => {
    if (field === 'name') setName(profile.name || '');
    if (field === 'email') setEmail(profile.email || '');
    if (field === 'phone') setPhone(profile.phone || '');
    setEditingFields(prev => ({ ...prev, [field]: false }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    try {
      await onSave({ name, email, phone });
      setEditingFields({});
    } catch (e) {
      // Keep in editing mode if error occurs
    } finally {
      setIsSavingAll(false);
    }
  };

  const isNameChanged = name.trim() !== (profile.name || '').trim();
  const isEmailChanged = email.trim() !== (profile.email || '').trim();
  const isPhoneChanged = phone.trim() !== (profile.phone || '').trim();
  const isAnyFieldEditing = !!(editingFields.name || editingFields.email || editingFields.phone);
  const hasPendingChanges = isNameChanged || isEmailChanged || isPhoneChanged || isAnyFieldEditing;
  const isBusy = isSavingAll || isSavingField !== null;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md relative overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-2xl">
          <User size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">المعلومات الشخصية</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">الاسم الكامل</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!editingFields.name}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (name.trim()) handleFieldSave('name');
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleFieldCancel('name');
                }
              }}
              className={`w-full border rounded-2xl py-3.5 pr-5 transition-all outline-none font-medium ${
                editingFields.name
                  ? 'bg-white border-blue-400 ring-2 ring-blue-100 text-gray-800 pl-24'
                  : 'bg-[#EAEFEF] border-gray-100 text-gray-800 cursor-default select-none pl-12'
              }`}
              required
            />
            {editingFields.name ? (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleFieldSave('name')}
                  disabled={isBusy || !name.trim()}
                  className="bg-[#0f62fe] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="حفظ الاسم"
                >
                  {isSavingField === 'name' ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>حفظ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldCancel('name')}
                  disabled={isBusy}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  title="إلغاء"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingFields(prev => ({ ...prev, name: true }))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="تعديل الاسم"
              >
                <Pencil size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">البريد الإلكتروني</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editingFields.email}
              dir="ltr"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (email.trim()) handleFieldSave('email');
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleFieldCancel('email');
                }
              }}
              className={`w-full border rounded-2xl py-3.5 pr-5 text-right transition-all outline-none font-medium ${
                editingFields.email
                  ? 'bg-white border-blue-400 ring-2 ring-blue-100 text-gray-800 pl-24'
                  : 'bg-[#EAEFEF] border-gray-100 text-gray-800 cursor-default select-none pl-12'
              }`}
              required
            />
            {editingFields.email ? (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleFieldSave('email')}
                  disabled={isBusy || !email.trim()}
                  className="bg-[#0f62fe] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="حفظ البريد الإلكتروني"
                >
                  {isSavingField === 'email' ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>حفظ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldCancel('email')}
                  disabled={isBusy}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  title="إلغاء"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingFields(prev => ({ ...prev, email: true }))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="تعديل البريد الإلكتروني"
              >
                <Pencil size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 mr-2">رقم الهاتف</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!editingFields.phone}
              dir="ltr"
              placeholder={editingFields.phone ? 'أدخل رقم الهاتف...' : '—'}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFieldSave('phone');
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleFieldCancel('phone');
                }
              }}
              className={`w-full border rounded-2xl py-3.5 pr-5 text-right transition-all outline-none font-medium ${
                editingFields.phone
                  ? 'bg-white border-blue-400 ring-2 ring-blue-100 text-gray-800 pl-24'
                  : 'bg-[#EAEFEF] border-gray-100 text-gray-800 cursor-default select-none pl-12'
              }`}
            />
            {editingFields.phone ? (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleFieldSave('phone')}
                  disabled={isBusy}
                  className="bg-[#0f62fe] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="حفظ رقم الهاتف"
                >
                  {isSavingField === 'phone' ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>حفظ</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldCancel('phone')}
                  disabled={isBusy}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  title="إلغاء"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingFields(prev => ({ ...prev, phone: true }))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="تعديل رقم الهاتف"
              >
                <Pencil size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save All Changes Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isBusy || !hasPendingChanges}
          className="bg-[#0f62fe] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSavingAll && <Loader2 size={16} className="animate-spin" />}
          <span>حفظ التغييرات</span>
        </button>
      </div>
    </div>
  );
};
