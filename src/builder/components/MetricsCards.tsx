import React from 'react';
import { getIconComponent } from '../utils/icons';
import { useBuilderStore } from '../store/builderStore';
import { getTypographyStyle, hasSectionBackground } from '../utils/typography';


interface MetricsCardsProps {
  title?: string;
  layout?: 'grid' | 'list';
  cardBg?: string;
  metrics?: any[];
  [key: string]: any;
}

export const MOCK_METRICS = [
  { label: 'نسبة النجاح العامة', value: '94.2%', desc: 'بزيادة 1.8% عن الشهر الماضي', icon: 'Sparkles', color: '#f59e0b' },
  { label: 'متوسط إنجاز الدروس', value: '82%', desc: 'معدل متوسط إتمام المواد والدروس', icon: 'BookOpen', color: '#2563eb' },
  { label: 'تقييمات الطلاب ورضاهم', value: '4.9/5', desc: 'بناء على 1,420 تقييماً حقيقياً', icon: 'Star', color: '#10b981' }
];

export default function MetricsCards(props: MetricsCardsProps) {
  const {
    title = 'معدل التقدم العام',
    layout = 'grid',
    cardBg = '#ffffff',
    metrics = MOCK_METRICS,
  } = props;

  // Read deviceMode with a fail-safe fallback
  let deviceMode = 'desktop';
  try {
    deviceMode = useBuilderStore((state) => state.deviceMode);
  } catch (e) {
    // Fallback if rendered outside the store context
  }

  const containerClass = 
    layout === 'list' || deviceMode === 'mobile'
      ? 'flex flex-col gap-4' 
      : 'grid grid-cols-1 sm:grid-cols-3 gap-6';

  const titleTypography = getTypographyStyle(props, 'title', {
    font: 'IBM Plex Sans Arabic',
    size: 'text-base',
    weight: 'font-black',
    color: '#1f2937'
  });

  const isTransparentBg = hasSectionBackground(props);

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <h3 
        style={titleTypography.style}
        className={`mb-2 ${titleTypography.className}`}
      >
        {title}
      </h3>

      <div className={containerClass}>
        {metrics.map((metric, index) => {
          const IconComponent = getIconComponent(metric.icon);
          return (
            <div 
              key={index}
              style={{ backgroundColor: isTransparentBg ? 'rgba(255, 255, 255, 0.7)' : cardBg }}
              className={`p-5 rounded-2xl border ${isTransparentBg ? 'border-white/40 backdrop-blur-md shadow-md' : 'border-slate-100/80 shadow-[0_12px_30px_rgba(25,28,29,0.015)]'} flex items-start gap-4 hover:shadow-md transition-shadow`}
            >
              <div 
                style={{ backgroundColor: `${metric.color}10`, color: metric.color }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              >
                <IconComponent className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 block">{metric.label}</span>
                <span className="text-lg font-black text-slate-800 block">{metric.value}</span>
                <span className="text-[9px] text-slate-400 font-semibold block">{metric.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
