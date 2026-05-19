import { motion } from 'framer-motion';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: AcademyPaymentMethod;
  courseId: string;
}

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  method,
  courseId,
}: PaymentMethodModalProps) => {
  const [copied, setCopied] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setRefNumber('');
    setScreenshot(null);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(method.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (refNumber.length < 6) {
      showAlert.error('خطأ في البيانات', 'رقم المرجع يجب أن يكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      console.log('Enrolling student:', { courseId, methodId: method.methodId, refNumber, screenshot });
      await new Promise(resolve => setTimeout(resolve, 1500));
      showAlert.success('تم إرسال طلب التسجيل بنجاح ✅', 'سيتم مراجعة طلبك وتفعيل الدورة في أقرب وقت');
      handleCloseModal(); // Reset and close on success
    } catch (error) {
      showAlert.error('فشل الإرسال', 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (method.type) {
      case 'mobile': return <Smartphone size={24} />;
      case 'email': return <Mail size={24} />;
      case 'account_number': return <Hash size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">{method.methodName}</h2>
              <p className="text-xs text-gray-500 font-bold">إكمال عملية الدفع والتسجيل</p>
            </div>
          </div>
          <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Payment Details */}
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
            <p className="text-sm font-bold text-blue-900 text-center">يرجى تحويل مبلغ الدورة إلى الرقم/الحساب التالي:</p>
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
              <span className="text-lg font-black text-blue-600 tracking-wider">{method.value}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">رقم العملية / المرجع</label>
              <input
                type="text"
                required
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                placeholder="أدخل رقم العملية المكون من 6 أرقام على الأقل"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-bold text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black text-gray-900">صورة إيصال الدفع (اختياري)</label>
              <div 
                className={clsx(
                  "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                  screenshot ? "border-green-400 bg-green-50/30" : "border-gray-200 bg-gray-50 hover:border-blue-400"
                )}
                onClick={() => document.getElementById('screenshot-upload')?.click()}
              >
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />
                <Upload className={screenshot ? "text-green-500" : "text-gray-400"} size={24} />
                <span className="text-xs font-bold text-gray-500">
                  {screenshot ? screenshot.name : 'اضغط لرفع صورة الإيصال'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'تأكيد وإرسال الطلب'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
