import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                </div>
                <h3 className="text-xl font-black text-gray-800">جاري التحميل...</h3>
                <p className="text-sm font-bold text-gray-500">يرجى الانتظار لحظات</p>
            </div>
        </div>
    );
}