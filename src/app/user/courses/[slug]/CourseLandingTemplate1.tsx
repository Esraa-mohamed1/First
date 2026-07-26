'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play, FileText, CheckCircle2, Clock, ShieldCheck,
  Video, Lock, PlayCircle, BookOpen, User, ChevronDown, X
} from 'lucide-react';
import { PaymentMethodCard } from '@/components/payment/PaymentMethodCard';
import { PaymentMethodModal } from '@/components/payment/PaymentMethodModal';
import { AcademyPaymentMethod } from '@/types/payment';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';
import axios from 'axios';
import { unwrapEncryptedResponseData } from '@/lib/decryption';

interface CourseLandingTemplate1Props {
  course: any;
  onSubscribe: () => Promise<void>;
  isSubscribing: boolean;
  selectedPaymentMethod: AcademyPaymentMethod | null;
  setSelectedPaymentMethod: (pm: AcademyPaymentMethod | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isRetrying: boolean;
  setIsRetrying: (retry: boolean) => void;
}

export default function CourseLandingTemplate1({
  course,
  onSubscribe,
  isSubscribing,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isPaymentModalOpen,
  setIsPaymentModalOpen,
  isRetrying,
  setIsRetrying,
}: CourseLandingTemplate1Props) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [expandedUnits, setExpandedUnits] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    // Sync academy profile
    const cached = localStorage.getItem('darab_academy_profile_full');
    if (cached) {
      try {
        setProfile(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (course?.units && course.units.length > 0) {
      setExpandedUnits([course.units[0].id]);
    }
  }, [course]);

  // Carousel auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  if (!course) return null;

  const totalUnits = course.units?.length || 0;
  const totalLessons = course.units?.reduce((acc: number, u: any) => acc + (u.lessons?.length || 0), 0) || 0;
  const videoUrl = course.units?.[0]?.lessons?.[0]?.video_url;
  const instructorName = course.instructor || 'المدرب المعتمد';
  
  const phoneVal = (profile?.phone || '201000000000').replace(/[\s-+]/g, '');
  const waMessage = `مهتم بدورة ${course.title}`;
  const waLink = `https://wa.me/${phoneVal}?text=${encodeURIComponent(waMessage)}`;

  const toggleUnit = (unitId: number) => {
    setExpandedUnits(prev =>
      prev.includes(unitId) ? prev.filter(uid => uid !== unitId) : [...prev, unitId]
    );
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      toast.error('يرجى كتابة الاسم الكامل');
      return;
    }
    if (!leadPhone.trim() || !/^(\+?\d{8,15})$/.test(leadPhone.replace(/[\s-]/g,''))) {
      toast.error('يرجى كتابة رقم هاتف صحيح');
      return;
    }
    setLeadSuccess(true);
    toast.success('تم تسجيل اهتمامك بنجاح!');
  };

  return (
    <div className="landing-template-1" dir="rtl">
      {/* Dynamic CSS Styling Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');

        .landing-template-1 {
          --emerald: #0D3B33;
          --emerald-deep: #082A24;
          --emerald-soft: #14544A;
          --gold: #C9A24B;
          --gold-light: #E7CE8F;
          --ivory: #FBF7EE;
          --sand: #F1E8D6;
          --ink: #22302B;
          --white: #FFFFFF;
          --whatsapp: #1FA855;
          --radius: 18px;
          --shadow: 0 14px 40px rgba(13,59,51,.12);
          --font-display: 'Tajawal', sans-serif;
          --font-body: 'IBM Plex Sans Arabic', sans-serif;
          
          font-family: var(--font-body);
          background: var(--ivory);
          color: var(--ink);
          line-height: 1.9;
        }

        .landing-template-1 h1, 
        .landing-template-1 h2, 
        .landing-template-1 h3 {
          font-family: var(--font-display);
          line-height: 1.5;
        }

        .landing-template-1 .container {
          width: min(1120px, 92%);
          margin-inline: auto;
        }

        .landing-template-1 .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          width: min(520px, 80%);
          margin: 0 auto;
        }

        .landing-template-1 .divider::before,
        .landing-template-1 .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(to var(--dir, left), transparent, var(--gold));
        }
        .landing-template-1 .divider::after { --dir: right; }

        .landing-template-1 .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: .85rem;
          letter-spacing: .5px;
          color: var(--gold);
        }
        .landing-template-1 .eyebrow::before {
          content: "✦";
          font-size: .7rem;
        }

        .landing-template-1 .section {
          padding: 76px 0;
        }

        .landing-template-1 .section-title {
          font-size: clamp(1.6rem, 3.2vw, 2.3rem);
          font-weight: 800;
          color: var(--emerald);
          margin: 8px 0 14px;
        }

        .landing-template-1 .section-lead {
          color: #5a6a63;
          max-width: 640px;
          font-size: 1.02rem;
        }

        /* ============ الهيرو ============ */
        .landing-template-1 .hero {
          background:
            radial-gradient(1100px 600px at 85% -10%, rgba(201,162,75,.14), transparent 60%),
            linear-gradient(160deg, var(--emerald-deep), var(--emerald) 55%, var(--emerald-soft));
          color: var(--ivory);
          position: relative;
          padding: 56px 0 72px;
          overflow: hidden;
        }

        .landing-template-1 .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .06;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23E7CE8F' stroke-width='1'%3E%3Cpath d='M48 8 L60 36 L88 48 L60 60 L48 88 L36 60 L8 48 L36 36 Z'/%3E%3Ccircle cx='48' cy='48' r='14'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 96px 96px;
        }

        .landing-template-1 .hero-top {
          position: relative;
          text-align: center;
          margin-bottom: 26px;
        }

        .landing-template-1 .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,162,75,0.16);
          border: 1px solid rgba(231,206,143,0.45);
          color: var(--gold-light);
          border-radius: 999px;
          font-size: .85rem;
          font-weight: 600;
          padding: 6px 16px;
        }

        .landing-template-1 .hero-media {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          border-radius: 26px;
          border: 2px solid rgba(231,206,143,0.7);
          box-shadow: 0 34px 70px rgba(0,0,0,0.45), inset 0 0 0 8px rgba(8,42,36,0.35);
          background: linear-gradient(200deg, #14544A, #082A24);
        }

        .landing-template-1 .hero-media::after {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 18px;
          border: 1px solid rgba(231,206,143,0.45);
          pointer-events: none;
        }

        .landing-template-1 .hero-media video,
        .landing-template-1 .hero-media iframe {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 0;
        }

        .landing-template-1 .corner {
          position: absolute;
          width: 34px;
          height: 34px;
          pointer-events: none;
          z-index: 2;
        }

        .landing-template-1 .corner::before {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid var(--gold-light);
        }
        .landing-template-1 .corner.tr { top: -9px; right: -9px; }
        .landing-template-1 .corner.tr::before { border-left: 0; border-bottom: 0; border-start-end-radius: 14px; }
        .landing-template-1 .corner.tl { top: -9px; left: -9px; }
        .landing-template-1 .corner.tl::before { border-right: 0; border-bottom: 0; border-start-start-radius: 14px; }
        .landing-template-1 .corner.br { bottom: -9px; right: -9px; }
        .landing-template-1 .corner.br::before { border-left: 0; border-top: 0; border-end-end-radius: 14px; }
        .landing-template-1 .corner.bl { bottom: -9px; left: -9px; }
        .landing-template-1 .corner.bl::before { border-right: 0; border-top: 0; border-end-start-radius: 14px; }

        .landing-template-1 .media-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--gold-light);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23E7CE8F' stroke-opacity='.12' stroke-width='1'%3E%3Cpath d='M36 6 L45 27 L66 36 L45 45 L36 66 L27 45 L6 36 L27 27 Z'/%3E%3C/g%3E%3C/svg%3E");
        }

        .landing-template-1 .media-placeholder .play {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: rgba(201,162,75,0.18);
          border: 1.5px solid var(--gold-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.9rem;
          transition: transform .2s ease, background .2s ease;
        }

        .landing-template-1 .hero-media:hover .play {
          transform: scale(1.08);
          background: rgba(201,162,75,0.3);
        }

        .landing-template-1 .media-placeholder span {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: .95rem;
          opacity: .85;
        }

        .landing-template-1 .hero-info {
          position: relative;
          z-index: 3;
          background: var(--white);
          color: var(--ink);
          border-radius: 24px;
          border: 1px solid var(--sand);
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
          margin: -64px auto 0;
          width: min(980px, 94%);
          padding: 36px 42px;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 36px;
          align-items: center;
        }

        .landing-template-1 .hero-info::before {
          content: "";
          position: absolute;
          top: 0;
          right: 42px;
          left: 42px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          border-radius: 0 0 6px 6px;
        }

        .landing-template-1 .hero-info h1 {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 900;
          color: var(--emerald);
          margin-bottom: 10px;
        }

        .landing-template-1 .hero-info h1 .gold {
          color: var(--gold);
        }

        .landing-template-1 .hero-desc {
          color: #5a6a63;
          font-size: .98rem;
          margin-bottom: 16px;
        }

        .landing-template-1 .meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: .9rem;
        }

        .landing-template-1 .meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4a5a52;
        }

        .landing-template-1 .stars {
          color: var(--gold);
          letter-spacing: 2px;
          font-size: 1rem;
        }

        .landing-template-1 .meta-item b {
          color: var(--emerald);
        }

        .landing-template-1 .hero-buy {
          background: var(--ivory);
          border: 1px solid var(--sand);
          border-radius: 18px;
          padding: 24px;
          text-align: center;
        }

        .landing-template-1 .hero-buy .price-box {
          background: transparent;
          border: 0;
          padding: 0;
          margin-bottom: 16px;
          justify-content: center;
        }

        .landing-template-1 .hero-buy .price-now {
          color: var(--emerald);
        }

        .landing-template-1 .hero-buy .price-old {
          color: #9aa79f;
        }

        .landing-template-1 .hero-buy .price-note {
          color: #b08a2e;
          justify-content: center;
        }

        .landing-template-1 .hero-buy .cta-row {
          flex-direction: column;
          gap: 10px;
        }

        .landing-template-1 .hero-buy .btn {
          width: 100%;
        }

        .landing-template-1 .price-box {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(231,206,143,0.35);
          border-radius: var(--radius);
          padding: 14px 22px;
          margin-bottom: 26px;
        }

        .landing-template-1 .price-now {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          color: var(--gold-light);
        }

        .landing-template-1 .price-now small {
          font-size: 1rem;
          font-weight: 700;
        }

        .landing-template-1 .price-old {
          color: rgba(251,247,238,0.55);
          text-decoration: line-through;
          font-size: 1.1rem;
        }

        .landing-template-1 .price-save {
          background: var(--gold);
          color: var(--emerald-deep);
          font-weight: 700;
          font-size: .8rem;
          border-radius: 999px;
          padding: 4px 12px;
        }

        .landing-template-1 .price-note {
          width: 100%;
          font-size: .8rem;
          color: var(--gold-light);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .landing-template-1 .cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
        }

        .landing-template-1 .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          border-radius: 14px;
          padding: 15px 34px;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .landing-template-1 .btn:focus-visible {
          outline: 3px solid var(--gold-light);
          outline-offset: 3px;
        }

        .landing-template-1 .btn-gold {
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          color: var(--emerald-deep);
          box-shadow: 0 10px 26px rgba(201,162,75,0.35);
        }

        .landing-template-1 .btn-gold:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(201,162,75,0.45);
        }

        .landing-template-1 .btn-wa {
          background: var(--whatsapp);
          color: #fff;
          box-shadow: 0 10px 26px rgba(31,168,85,0.3);
        }

        .landing-template-1 .btn-wa:hover {
          transform: translateY(-3px);
        }

        .landing-template-1 .btn-outline {
          background: transparent;
          border: 1.5px solid var(--gold);
          color: var(--gold);
        }

        .landing-template-1 .btn-outline:hover {
          background: var(--gold);
          color: var(--emerald-deep);
        }

        .landing-template-1 .students-chip {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 2;
          background: rgba(8,42,36,0.72);
          backdrop-filter: blur(6px);
          color: var(--ivory);
          border: 1px solid rgba(231,206,143,0.4);
          border-radius: 999px;
          padding: 8px 18px;
          font-size: .85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .landing-template-1 .students-chip b {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--gold-light);
        }

        /* ============ شريط الأرقام ============ */
        .landing-template-1 .stats {
          background: var(--white);
          border-block: 1px solid var(--sand);
          padding: 26px 0;
          margin-top: -1px;
        }

        .landing-template-1 .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          text-align: center;
        }

        .landing-template-1 .stat b {
          display: block;
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--emerald);
        }

        .landing-template-1 .stat span {
          font-size: .85rem;
          color: #6b7a72;
        }

        /* ============ نبذة ============ */
        .landing-template-1 .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          max-width: 760px;
          margin-inline: auto;
          text-align: center;
        }

        .landing-template-1 .about-grid p {
          color: #4a5a52;
          font-size: 1.05rem;
        }

        /* ============ كروت الفوائد ============ */
        .landing-template-1 .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 36px;
        }

        .landing-template-1 .card {
          background: var(--white);
          border-radius: var(--radius);
          padding: 30px 26px;
          border: 1px solid var(--sand);
          border-top: 3px solid var(--gold);
          box-shadow: 0 6px 18px rgba(13,59,51,0.05);
          transition: transform .2s ease, box-shadow .2s ease;
          text-align: right;
        }

        .landing-template-1 .card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
        }

        .landing-template-1 .card .icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--emerald), var(--emerald-soft));
          color: var(--gold-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .landing-template-1 .card h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--emerald);
          margin-bottom: 8px;
        }

        .landing-template-1 .card p {
          font-size: .92rem;
          color: #5a6a63;
        }

        /* ============ المخرجات ============ */
        .landing-template-1 .outcomes {
          background: var(--emerald);
          color: var(--ivory);
          position: relative;
          overflow: hidden;
        }

        .landing-template-1 .outcomes::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23E7CE8F' stroke-width='1'%3E%3Cpath d='M48 8 L60 36 L88 48 L60 60 L48 88 L36 60 L8 48 L36 36 Z'/%3E%3C/g%3E%3C/svg%3E");
        }

        .landing-template-1 .outcomes .section-title {
          color: var(--white);
        }

        .landing-template-1 .outcomes .eyebrow {
          color: var(--gold-light);
        }

        .landing-template-1 .check-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 34px;
          margin-top: 32px;
          position: relative;
          text-align: right;
        }

        .landing-template-1 .check {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(231,206,143,0.22);
          border-radius: 14px;
          padding: 16px 18px;
        }

        .landing-template-1 .check .tick {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          margin-top: 4px;
          background: var(--gold);
          color: var(--emerald-deep);
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .85rem;
        }

        .landing-template-1 .check p {
          font-size: .95rem;
          color: rgba(251,247,238,0.92);
        }

        /* ============ لمين الدورة ============ */
        .landing-template-1 .audience {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 34px;
        }

        .landing-template-1 .aud {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: var(--radius);
          padding: 26px 20px;
          text-align: center;
        }

        .landing-template-1 .aud .em {
          font-size: 1.8rem;
          display: block;
          margin-bottom: 10px;
        }

        .landing-template-1 .aud h3 {
          font-size: 1rem;
          color: var(--emerald);
          font-weight: 800;
          margin-bottom: 6px;
        }

        .landing-template-1 .aud p {
          font-size: .85rem;
          color: #6b7a72;
        }

        /* ============ المحاضر ============ */
        .landing-template-1 .trainer {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: 24px;
          box-shadow: var(--shadow);
          padding: 44px;
          margin-top: 36px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
          align-items: center;
          text-align: right;
        }

        .landing-template-1 .trainer-photo {
          width: 200px;
          aspect-ratio: 1;
          justify-self: center;
          border-radius: 50% 50% 24px 24px / 42% 42% 24px 24px;
          overflow: hidden;
          border: 2px solid var(--gold);
          background: linear-gradient(200deg, var(--emerald-soft), var(--emerald-deep));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-light);
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 2.6rem;
        }

        .landing-template-1 .trainer h3 {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--emerald);
        }

        .landing-template-1 .trainer .role {
          color: var(--gold);
          font-weight: 700;
          font-size: .95rem;
          margin-bottom: 12px;
          display: block;
        }

        .landing-template-1 .trainer p {
          color: #5a6a63;
          font-size: .98rem;
          margin-bottom: 16px;
        }

        .landing-template-1 .trainer-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .landing-template-1 .tbadge {
          background: var(--ivory);
          border: 1px solid var(--sand);
          border-radius: 999px;
          font-size: .8rem;
          font-weight: 600;
          color: var(--emerald);
          padding: 6px 14px;
        }

        /* ============ آراء العملاء ============ */
        .landing-template-1 .carousel {
          position: relative;
          margin-top: 40px;
        }

        .landing-template-1 .track-wrap {
          overflow: hidden;
          border-radius: var(--radius);
        }

        .landing-template-1 .track {
          display: flex;
          transition: transform .55s cubic-bezier(.4, 0, .2, 1);
        }

        .landing-template-1 .slide {
          flex: 0 0 100%;
          padding: 6px;
        }

        .landing-template-1 .slide-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          text-align: right;
        }

        .landing-template-1 .review {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: var(--radius);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .landing-template-1 .review .stars {
          color: var(--gold);
          font-size: .95rem;
        }

        .landing-template-1 .review p {
          color: #4a5a52;
          font-size: .95rem;
          flex: 1;
        }

        .landing-template-1 .review .who {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .landing-template-1 .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--emerald), var(--emerald-soft));
          color: var(--gold-light);
          font-weight: 800;
          font-family: var(--font-display);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-template-1 .who b {
          display: block;
          font-size: .9rem;
          color: var(--emerald);
        }

        .landing-template-1 .who span {
          font-size: .78rem;
          color: #8a968f;
        }

        .landing-template-1 .wa-shot {
          background: #EFE7DB;
          border-radius: var(--radius);
          border: 1px solid var(--sand);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23d8ccb8' fill-opacity='.25'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='40' cy='30' r='1.5'/%3E%3Ccircle cx='20' cy='48' r='1.5'/%3E%3C/g%3E%3C/svg%3E");
        }

        .landing-template-1 .wa-head {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: .78rem;
          color: #6b7a72;
          border-bottom: 1px dashed #d5c9b4;
          padding-bottom: 8px;
          margin-bottom: 4px;
        }

        .landing-template-1 .wa-head .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--whatsapp);
        }

        .landing-template-1 .bubble {
          max-width: 88%;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: .88rem;
          line-height: 1.8;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          position: relative;
        }

        .landing-template-1 .bubble.in {
          background: #fff;
          align-self: flex-start;
          border-start-end-radius: 2px;
        }

        .landing-template-1 .bubble.out {
          background: #DCF3D0;
          align-self: flex-end;
          border-start-start-radius: 2px;
        }

        .landing-template-1 .bubble time {
          display: block;
          text-align: left;
          font-size: .65rem;
          color: #93a08f;
          margin-top: 4px;
        }

        .landing-template-1 .car-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-top: 26px;
        }

        .landing-template-1 .car-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: var(--white);
          border: 1.5px solid var(--gold);
          color: var(--emerald);
          font-size: 1.1rem;
          transition: background .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .landing-template-1 .car-btn:hover {
          background: var(--gold);
          color: var(--emerald-deep);
        }

        .landing-template-1 .dots {
          display: flex;
          gap: 8px;
        }

        .landing-template-1 .dot-btn {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d8ccb0;
          transition: all .2s;
          padding: 0;
          border: none;
          cursor: pointer;
        }

        .landing-template-1 .dot-btn.active {
          background: var(--gold);
          width: 26px;
          border-radius: 99px;
        }

        /* ============ قسم السعر الختامي ============ */
        .landing-template-1 .final-cta {
          background:
            radial-gradient(800px 400px at 15% 120%, rgba(201,162,75,.16), transparent 60%),
            linear-gradient(150deg, var(--emerald-deep), var(--emerald));
          color: var(--ivory);
          text-align: center;
          border-radius: 28px;
          padding: 60px 40px;
          position: relative;
          overflow: hidden;
        }

        .landing-template-1 .final-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%23E7CE8F' stroke-width='1'%3E%3Cpath d='M48 8 L60 36 L88 48 L60 60 L48 88 L36 60 L8 48 L36 36 Z'/%3E%3C/g%3E%3C/svg%3E");
        }

        .landing-template-1 .final-cta h2 {
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 900;
          color: #fff;
          margin-bottom: 12px;
          position: relative;
        }

        .landing-template-1 .final-cta .price-box {
          background: rgba(255,255,255,0.07);
          margin-block: 20px 28px;
        }

        .landing-template-1 .urgency {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,162,75,0.15);
          border: 1px dashed var(--gold);
          color: var(--gold-light);
          border-radius: 999px;
          font-size: .85rem;
          font-weight: 600;
          padding: 7px 18px;
          margin-bottom: 8px;
          position: relative;
        }

        /* ============ فورم الاهتمام ============ */
        .landing-template-1 .lead-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          align-items: center;
          margin-top: 36px;
        }

        .landing-template-1 .lead-text {
          text-align: right;
        }

        .landing-template-1 .lead-text h3 {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--emerald);
          margin-bottom: 10px;
        }

        .landing-template-1 .lead-text p {
          color: #5a6a63;
          font-size: .98rem;
          margin-bottom: 20px;
        }

        .landing-template-1 .lead-form {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: 24px;
          box-shadow: var(--shadow);
          padding: 38px;
        }

        .landing-template-1 .field {
          margin-bottom: 18px;
          text-align: right;
        }

        .landing-template-1 .field label {
          display: block;
          font-weight: 700;
          font-size: .9rem;
          color: var(--emerald);
          margin-bottom: 8px;
          font-family: var(--font-display);
        }

        .landing-template-1 .field input {
          width: 100%;
          border: 1.5px solid var(--sand);
          border-radius: 12px;
          background: var(--ivory);
          padding: 14px 16px;
          font-family: inherit;
          font-size: .95rem;
          transition: border-color .2s;
        }

        .landing-template-1 .field input:focus {
          outline: none;
          border-color: var(--gold);
          background: #fff;
        }

        .landing-template-1 .form-note {
          font-size: .78rem;
          color: #8a968f;
          margin-top: 12px;
          text-align: center;
        }

        .landing-template-1 .form-success {
          text-align: center;
          padding: 30px 10px;
        }

        .landing-template-1 .form-success .big {
          font-size: 2.4rem;
          margin-bottom: 10px;
        }

        .landing-template-1 .form-success h4 {
          font-family: var(--font-display);
          color: var(--emerald);
          font-size: 1.2rem;
          margin-bottom: 6px;
        }

        .landing-template-1 .form-success p {
          color: #5a6a63;
          font-size: .9rem;
        }

        /* ============ واتساب عائم ============ */
        .landing-template-1 .wa-float {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 60;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--whatsapp);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(31,168,85,0.4);
          transition: transform .2s;
        }

        .landing-template-1 .wa-float:hover {
          transform: scale(1.08);
        }

        .landing-template-1 .wa-float svg {
          width: 30px;
          height: 30px;
        }

        /* Curriculums / Accordions */
        .landing-template-1 .accordion-section {
          max-width: 860px;
          margin: 0 auto;
        }

        .landing-template-1 .accordion-item {
          background: var(--white);
          border-radius: 16px;
          border: 1px solid var(--sand);
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .landing-template-1 .accordion-trigger {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          text-align: right;
          cursor: pointer;
        }

        .landing-template-1 .accordion-content {
          border-top: 1px solid var(--sand);
          background: #FCFAF6;
        }

        .landing-template-1 .lesson-row {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--sand);
          text-align: right;
        }
        .landing-template-1 .lesson-row:last-child {
          border-bottom: none;
        }

        @media(max-width:980px){
          .landing-template-1 .hero-info {
            grid-template-columns: 1fr;
            gap: 26px;
            text-align: center;
            padding: 30px 26px;
            margin-top: -46px;
          }
          .landing-template-1 .hero-desc { margin-inline: auto; }
          .landing-template-1 .meta-row { justify-content: center; }
          .landing-template-1 .cards { grid-template-columns: 1fr 1fr; }
          .landing-template-1 .audience { grid-template-columns: 1fr 1fr; }
          .landing-template-1 .trainer { grid-template-columns: 1fr; text-align: center; }
          .landing-template-1 .trainer-badges { justify-content: center; }
          .landing-template-1 .lead-grid { grid-template-columns: 1fr; }
          .landing-template-1 .check-grid { grid-template-columns: 1fr; }
        }

        @media(max-width:600px){
          .landing-template-1 .section { padding: 56px 0; }
          .landing-template-1 .cards { grid-template-columns: 1fr; }
          .landing-template-1 .audience { grid-template-columns: 1fr; }
          .landing-template-1 .stats-grid { grid-template-columns: 1fr 1fr; gap: 22px; }
          .landing-template-1 .btn { width: 100%; }
          .landing-template-1 .hero-media { border-radius: 18px; }
          .landing-template-1 .students-chip { top: 12px; right: 12px; font-size: .75rem; padding: 6px 12px; }
          .landing-template-1 .media-placeholder .play { width: 64px; height: 64px; font-size: 1.3rem; }
          .landing-template-1 .hero-info { margin-top: -30px; }
          .landing-template-1 .trainer { padding: 30px 22px; }
          .landing-template-1 .lead-form { padding: 26px 20px; }
          .landing-template-1 .final-cta { padding: 44px 22px; }
        }
      ` }} />

      {/* ==================== الهيرو ==================== */}
      <header className="hero">
        <div className="container">
          <div className="hero-top">
            <span className="hero-badge">✦ &nbsp;الدفعة الجديدة — التسجيل مفتوح الآن</span>
          </div>

          <div className="hero-media relative">
            <span className="corner tr"></span><span className="corner tl"></span>
            <span className="corner br"></span><span className="corner bl"></span>
            <div className="students-chip">🎓 <b>+{course.students_count || '2,450'}</b> طالب انضموا بالفعل</div>
            
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={course.image}
              />
            ) : (
              <div className="media-placeholder">
                <div className="play">▶</div>
                <span>صورة / فيديو تعريفي بالدورة</span>
              </div>
            )}
          </div>

          {/* بطاقة معلومات الدورة */}
          <div className="hero-info">
            <div>
              <h1 className="text-right">
                {course.title.split('—')[0]}
                {course.title.split('—')[1] && (
                  <>
                    <br />
                    <span className="gold">{course.title.split('—')[1]}</span>
                  </>
                )}
              </h1>
              
              <div
                className="hero-desc text-right ql-editor !p-0 text-slate-500 font-medium"
                dangerouslySetInnerHTML={{ __html: course.description || 'برنامج عملي مكثّف، تتعلم فيه بناء المهارات خطوة بخطوة، وتطبّق على مشاريع حقيقية.' }}
              />

              <div className="meta-row">
                <div className="meta-item"><span className="stars" aria-label="التقييم 4.9 من 5">★★★★★</span> <b>4.9</b> (312 تقييم)</div>
                <div className="meta-item">👥 <b>+{course.students_count || '2,450'}</b> مشترك</div>
                <div className="meta-item">🎥 <b>{totalLessons * 1.5}</b> ساعة تدريبية</div>
                <div className="meta-item">👨‍🏫 <b>{instructorName}</b></div>
              </div>
            </div>

            <div className="hero-buy">
              <div className="price-box">
                {course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0 ? (
                  <span className="price-now">مجاني بالكامل</span>
                ) : (
                  <>
                    <span className="price-now">{course.final_price || course.price} <small>{course.currency || 'SAR'}</small></span>
                    {course.final_price && course.price && course.final_price !== course.price && (
                      <span className="price-old">{course.price} {course.currency || 'SAR'}</span>
                    )}
                    <span className="price-save">خصم 50%</span>
                  </>
                )}
                <span className="price-note">⏳ الخصم ساري لفترة محدودة</span>
              </div>

              {/* Payment Methods selector inside the checkout container */}
              {!(course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0) && !course.is_subscribed && (
                <div className="space-y-2 mb-4 w-full">
                  <div className="text-right">
                    <span className="text-slate-900 font-black text-xs">اختر وسيلة الدفع</span>
                  </div>
                  {course.payment_methods && course.payment_methods.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {course.payment_methods.map((pm: any) => (
                        <PaymentMethodCard
                          key={pm.methodId}
                          id={pm.methodId}
                          name={pm.methodName}
                          type={pm.type}
                          isSelected={selectedPaymentMethod?.methodId === pm.methodId}
                          onSelect={() => setSelectedPaymentMethod(pm)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-[10px] text-gray-400 font-bold">لا تتوفر وسائل دفع مفعلة حالياً.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="cta-row">
                {course.is_subscribed ? (
                  <button
                    onClick={() => router.push(`/student/courses/${course.id}/learn`)}
                    className="btn btn-gold w-full text-center"
                  >
                    ابدأ التعلم الآن ←
                  </button>
                ) : (course.subscription_status === 'pending' || course.subscription_status === 'penidng') ? (
                  <button
                    disabled
                    className="btn btn-gold w-full text-center opacity-70 cursor-not-allowed"
                  >
                    قيد المراجعة...
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const isFree = course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0;
                      if (isFree) {
                        onSubscribe();
                        return;
                      }
                      if (!selectedPaymentMethod) {
                        toast.error('يرجى اختيار وسيلة دفع أولاً');
                        return;
                      }
                      setIsPaymentModalOpen(true);
                    }}
                    disabled={isSubscribing}
                    className="btn btn-gold w-full text-center"
                  >
                    {isSubscribing ? 'جاري التحميل...' : (course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0) ? 'التحاق مجاني بالدورة' : 'اشترك في الدورة الآن ←'}
                  </button>
                )}
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  استفسر عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== شريط الأرقام ==================== */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat"><b>{totalLessons * 1.5} ساعة</b><span>محتوى عملي مسجّل</span></div>
          <div className="stat"><b>{totalUnits * 2} مشروع</b><span>تطبيقي تنفّذه بنفسك</span></div>
          <div className="stat"><b>شهادة معتمدة</b><span>باسمك بعد الإتمام</span></div>
          <div className="stat"><b>وصول دائم</b><span>مدى الحياة + تحديثات</span></div>
        </div>
      </section>

      {/* ==================== نبذة عن الدورة ==================== */}
      <section className="section">
        <div className="container about-grid">
          <span className="eyebrow" style={{ marginInline: 'auto' }}>عن الدورة</span>
          <h2 className="section-title">إيه اللي هتتعلمه بالظبط؟</h2>
          <p>
            الدورة مصممة لكل من يريد دخول المجال التعليمي والمهني بطريقة عملية بعيدة عن الحشو النظري. تبدأ معك من الأساسيات الحقيقية وحتى بناء المهارات المتقدمة وقياس النتائج والتطبيق العملي — كل قسم ينتهي بتطبيق فعلي على مشروع حقيقي.
          </p>
        </div>
      </section>

      <div className="divider" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 0 L11 7 L18 9 L11 11 L9 18 L7 11 L0 9 L7 7 Z" fill="#C9A24B"/></svg>
      </div>

      {/* ==================== ليه تشترك ==================== */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">ليه الدورة دي تحديدًا؟</span>
          <h2 className="section-title">6 أسباب تخليك تحجز مكانك النهارده</h2>
          <p className="section-lead">مش مجرد فيديوهات مسجلة — منظومة تعلّم كاملة مصممة لتوصلك لنتيجة.</p>
          <div className="cards">
            <div className="card"><div className="icon">🛠️</div><h3>تطبيق عملي 100%</h3><p>كل محاضرة تنتهي بمهمة تنفذها بنفسك، وتستلم عليها ملاحظات مباشرة من فريق الدورة.</p></div>
            <div className="card"><div className="icon">💬</div><h3>متابعة ودعم مستمر</h3><p>جروب خاص للمشتركين + جلسة أسئلة وأجوبة مباشرة كل أسبوع مع المحاضر.</p></div>
            <div className="card"><div className="icon">🇪🇬</div><h3>محتوى بالعربي لسوقنا</h3><p>أمثلة وحالات حقيقية من السوق العربي والمحلي، مش ترجمة لكورسات أجنبية.</p></div>
            <div className="card"><div className="icon">📈</div><h3>قوالب جاهزة توفر وقتك</h3><p>ملفات خطط إعلانية، شيتات تحليل، ونصوص إعلانات جاهزة للتعديل والاستخدام فورًا.</p></div>
            <div className="card"><div className="icon">🎓</div><h3>شهادة إتمام معتمدة</h3><p>شهادة باسمك تضيفها لسيرتك الذاتية وحسابك على لينكدإن بعد اجتياز المشروع النهائي.</p></div>
            <div className="card"><div className="icon">♾️</div><h3>وصول مدى الحياة</h3><p>تشترك مرة واحدة وتحصل على كل التحديثات والإضافات الجديدة بدون أي رسوم إضافية.</p></div>
          </div>
        </div>
      </section>

      {/* ==================== هتخرج بإيه ==================== */}
      <section className="section outcomes">
        <div className="container">
          <span className="eyebrow">النتيجة</span>
          <h2 className="section-title">هتخرج من الدورة وأنت قادر على:</h2>
          <div className="check-grid">
            <div className="check"><span className="tick">✓</span><p>إطلاق المشاريع وتطبيق ما تعلمته من الصفر وبميزانية محدودة.</p></div>
            <div className="check"><span className="tick">✓</span><p>بناء قمع مبيعات (Funnel) متكامل يحوّل الزوار إلى عملاء يدفعون.</p></div>
            <div className="check"><span className="tick">✓</span><p>قراءة الأرقام والتقارير واتخاذ قرارات تحسين الأداء بثقة.</p></div>
            <div className="check"><span className="tick">✓</span><p>كتابة استراتيجيات تسويق وتطوير متكاملة مصممة للعميل العربي.</p></div>
            <div className="check"><span className="tick">✓</span><p>تسعير خدماتك كمستقل والحصول على أول فرصة عمل خلال 60 يوم.</p></div>
            <div className="check"><span className="tick">✓</span><p>تنفيذ مشروع تخرج حقيقي تضيفه فورًا إلى معرض أعمالك الاحترافي.</p></div>
          </div>
        </div>
      </section>

      {/* ==================== محتوى المادة العلمية ==================== */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">مخطط المنهج</span>
          <h2 className="section-title">محتوى الدورة بالتفصيل</h2>
          <p className="section-lead mb-8">شاهد كيف يتم تقسيم المنهج التعليمي إلى أقسام ودروس واضحة.</p>
          
          <div className="accordion-section">
            {course.units && course.units.length > 0 ? (
              course.units.map((unit: any) => (
                <div key={unit.id} className="accordion-item">
                  <button
                    onClick={() => !unit.isLocked && toggleUnit(unit.id)}
                    className="accordion-trigger"
                    disabled={unit.isLocked}
                  >
                    <div className="flex items-center gap-4">
                      <ChevronDown size={18} className={twMerge("text-slate-400 transition-transform duration-300", expandedUnits.includes(unit.id) ? "rotate-180" : "rotate-0")} />
                      <span className="text-slate-400 text-xs font-bold">
                        {unit.lessons?.length || 0} دروس
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <h3 className={twMerge("text-sm md:text-base font-black", unit.isLocked ? "text-slate-400" : "text-slate-800")}>{unit.title}</h3>
                      {unit.isLocked && <Lock size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {!unit.isLocked && expandedUnits.includes(unit.id) && (
                    <div className="accordion-content">
                      {unit.lessons?.map((lesson: any) => (
                        <div key={lesson.id} className="lesson-row">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400">{lesson.duration || '10:00'}</span>
                            {lesson.isPreview && (
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black">معاينة مجانية</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-xs md:text-sm">{lesson.title}</span>
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <PlayCircle size={14} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 font-bold">لا يوجد محتوى متاح حالياً.</p>
            )}
          </div>
        </div>
      </section>

      {/* ==================== الدورة لمين ==================== */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">هل الدورة مناسبة لك؟</span>
          <h2 className="section-title">الدورة موجّهة لـ:</h2>
          <div className="audience">
            <div className="aud"><span className="em">🚀</span><h3>المبتدئين تمامًا</h3><p>لا تحتاج أي خبرة سابقة — نبدأ معك من الصفر الحقيقي.</p></div>
            <div className="aud"><span className="em">🏪</span><h3>أصحاب المشاريع</h3><p>تريد تسويق مشروعك بنفسك بدل دفع آلاف للوكالات.</p></div>
            <div className="aud"><span className="em">💼</span><h3>الموظفين</h3><p>تبحث عن مصدر دخل إضافي أو تغيير مسارك المهني.</p></div>
            <div className="aud"><span className="em">🧑‍💻</span><h3>الفريلانسرز</h3><p>تريد إضافة خدمة مربحة جديدة لعملائك الحاليين.</p></div>
          </div>
        </div>
      </section>

      <div className="divider" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 0 L11 7 L18 9 L11 11 L9 18 L7 11 L0 9 L7 7 Z" fill="#C9A24B"/></svg>
      </div>

      {/* ==================== المحاضر ==================== */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">تتعلم مع مين؟</span>
          <h2 className="section-title">محاضر الدورة</h2>
          <div className="trainer">
            <div className="trainer-photo">{instructorName[0] || 'م'}</div>
            <div>
              <h3>{instructorName}</h3>
              <span className="role">خبير معتمد — خبرة في الأسواق المحلية والخليجية</span>
              <p>
                درّب أكثر من 4,000 متدرب أطلق كثير منهم مشاريعهم الخاصة أو حصلوا على وظائف في كبرى الوكالات والشركات. أسلوبه عملي مباشر: «اللي مش هتطبقه النهارده، مش هشرحهولك أصلًا».
              </p>
              <div className="trainer-badges">
                <span className="tbadge">✦ شريك معتمد</span>
                <span className="tbadge">✦ +120 عميل محلي</span>
                <span className="tbadge">✦ +4,000 متدرب</span>
                <span className="tbadge">✦ متحدث في مؤتمرات كبرى</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== آراء العملاء ==================== */}
      <section className="section" style={{ background: 'var(--white)', borderBlock: '1px solid var(--sand)' }}>
        <div className="container">
          <span className="eyebrow">قالوا عن الدورة</span>
          <h2 className="section-title">آراء المشتركين الحقيقية</h2>
          <p className="section-lead">تقييمات مكتوبة ورسائل وصلتنا من طلاب الدفعات السابقة.</p>

          <div className="carousel" id="carousel">
            <div className="track-wrap">
              <div className="track" style={{ transform: `translateX(${currentSlide * 100}%)` }}>
                {/* شريحة 1 */}
                <div className="slide">
                  <div className="slide-inner">
                    <div className="review">
                      <span className="stars">★★★★★</span>
                      <p>«كنت خايف تكون زي أي كورس نظري، لكن من تاني أسبوع كنت مطلّق أول حملة إعلانية لمشروعي وجبت مبيعات فعلية. أحسن استثمار عملته في نفسي.»</p>
                      <div className="who"><div className="avatar">م</div><div><b>محمد السيد</b><span>صاحب متجر إلكتروني — القاهرة</span></div></div>
                    </div>
                    <div className="wa-shot" aria-label="لقطة شاشة من محادثة واتساب لأحد المشتركين">
                      <div className="wa-head"><span className="dot"></span> واتساب — رسالة من مشتركة</div>
                      <div className="bubble in">أستاذ أحمد أنا قفلت أول عميل فريلانس بـ 4,000 ريال 🎉 كل اللي عملته طبقت اللي في الأسبوع الخامس حرفيًا<time>9:42 م ✓✓</time></div>
                      <div className="bubble out">ألف مبروك يا سارة 👏 دي بداية بس، كملي على نفس الخطة<time>9:45 م</time></div>
                    </div>
                  </div>
                </div>

                {/* شريحة 2 */}
                <div className="slide">
                  <div className="slide-inner">
                    <div className="review">
                      <span className="stars">★★★★★</span>
                      <p>«المحتوى بالعربي وبأمثلة من السوق السعودي، وهذا الشيء ما لقيته في أي دورة ثانية. القوالب الجاهزة وحدها تسوى سعر الدورة.»</p>
                      <div className="who"><div className="avatar">ع</div><div><b>عبدالله القحطاني</b><span>مسوّق مستقل — الرياض</span></div></div>
                    </div>
                    <div className="review">
                      <span className="stars">★★★★★</span>
                      <p>«جلسات الأسئلة الأسبوعية فرقت معايا جدًا. أي حاجة بقف فيها بلاقي إجابة مباشرة من المحاضر نفسه مش من مساعدين.»</p>
                      <div className="who"><div className="avatar">ن</div><div><b>نورهان عادل</b><span>موظفة بدأت فريلانس — الإسكندرية</span></div></div>
                    </div>
                  </div>
                </div>

                {/* شريحة 3 */}
                <div className="slide">
                  <div className="slide-inner">
                    <div className="wa-shot" aria-label="لقطة شاشة من محادثة واتساب لأحد المشتركين">
                      <div className="wa-head"><span className="dot"></span> واتساب — رسالة من مشترك</div>
                      <div className="bubble in">حبيت أشكرك، اترقيت في شغلي بعد ما طبقت خطة الحملات اللي في الدورة على براند الشركة 🙏<time>3:18 م ✓✓</time></div>
                      <div className="bubble in">المدير طلب مني أدرّب الفريق كله عليها 😂<time>3:19 م ✓✓</time></div>
                    </div>
                    <div className="review">
                      <span className="stars">★★★★★</span>
                      <p>«صاحب مشروع صغير وكنت بصرف على وكالة 8,000 جنيه شهريًا. بعد الدورة بقيت بدير إعلاناتي بنفسي بنتائج أحسن وبنص التكلفة.»</p>
                      <div className="who"><div className="avatar">ك</div><div><b>كريم فتحي</b><span>صاحب مطعم — الجيزة</span></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="car-nav">
              <button className="car-btn" onClick={() => setCurrentSlide(prev => (prev - 1 + 3) % 3)} aria-label="الرأي السابق">‹</button>
              <div className="dots">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={twMerge("dot-btn", currentSlide === idx && "active")}
                    aria-label={`الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
              <button className="car-btn" onClick={() => setCurrentSlide(prev => (prev + 1) % 3)} aria-label="الرأي التالي">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== السعر الختامي ==================== */}
      <section className="section" id="buy">
        <div className="container">
          <div className="final-cta">
            <span className="urgency">⏳ الخصم متاح لفترة محدودة — الأماكن في المتابعة المباشرة محدودة</span>
            <h2>احجز مكانك في الدفعة الجديدة الآن</h2>
            
            <div className="price-box" style={{ justifyContent: 'center' }}>
              {course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0 ? (
                <span className="price-now">مجاني بالكامل</span>
              ) : (
                <>
                  <span className="price-now">{course.final_price || course.price} <small>{course.currency || 'SAR'}</small></span>
                  {course.final_price && course.price && course.final_price !== course.price && (
                    <span className="price-old" style={{ textDecoration: 'line-through' }}>{course.price} {course.currency || 'SAR'}</span>
                  )}
                  <span className="price-save">خصم 50%</span>
                </>
              )}
            </div>

            {/* Payment Methods selector inside final checkout block too */}
            {!(course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0) && !course.is_subscribed && (
              <div className="max-w-[420px] mx-auto space-y-2 mb-6 w-full bg-slate-900/40 p-4 rounded-3xl border border-white/10">
                <div className="text-right">
                  <span className="text-white font-black text-xs">اختر وسيلة الدفع</span>
                </div>
                {course.payment_methods && course.payment_methods.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {course.payment_methods.map((pm: any) => (
                      <PaymentMethodCard
                        key={pm.methodId}
                        id={pm.methodId}
                        name={pm.methodName}
                        type={pm.type}
                        isSelected={selectedPaymentMethod?.methodId === pm.methodId}
                        onSelect={() => setSelectedPaymentMethod(pm)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                    <p className="text-[10px] text-slate-400 font-bold">لا تتوفر وسائل دفع مفعلة حالياً.</p>
                  </div>
                )}
              </div>
            )}

            <div className="cta-row" style={{ justifyContent: 'center' }}>
              {course.is_subscribed ? (
                <button
                  onClick={() => router.push(`/student/courses/${course.id}/learn`)}
                  className="btn btn-gold"
                >
                  ابدأ التعلم الآن ←
                </button>
              ) : (course.subscription_status === 'pending' || course.subscription_status === 'penidng') ? (
                <button
                  disabled
                  className="btn btn-gold opacity-70 cursor-not-allowed"
                >
                  طلبك قيد المراجعة...
                </button>
              ) : (
                <button
                  onClick={() => {
                    const isFree = course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0;
                    if (isFree) {
                      onSubscribe();
                      return;
                    }
                    if (!selectedPaymentMethod) {
                      toast.error('يرجى اختيار وسيلة دفع أولاً');
                      return;
                    }
                    setIsPaymentModalOpen(true);
                  }}
                  disabled={isSubscribing}
                  className="btn btn-gold"
                >
                  {isSubscribing ? 'جاري التحميل...' : (course.price_type === 'free' || Number(course.final_price || course.price || 0) === 0) ? 'التحاق مجاني بالدورة' : 'اشترِ الدورة الآن ←'}
                </button>
              )}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.5-.8-2-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 15.7 15.7 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>
                كلّم المدرب واتساب
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== فورم تسجيل الاهتمام ==================== */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container lead-grid">
          <div className="lead-text">
            <span className="eyebrow">لسه محتار؟</span>
            <h3>سجّل اهتمامك وهنكلمك بنفسنا</h3>
            <p>سيب اسمك ورقم موبايلك، وفريق الدورة هيتواصل معاك خلال 24 ساعة يجاوب على كل أسئلتك ويساعدك تقرر إذا كانت الدورة مناسبة لك — بدون أي التزام.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.5-.8-2-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 15.7 15.7 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>
              أو ابعت لنا واتساب مباشرة
            </a>
          </div>

          <div className="lead-form">
            {!leadSuccess ? (
              <form onSubmit={handleLeadSubmit}>
                <div className="field">
                  <label htmlFor="lead-name">الاسم الكامل</label>
                  <input
                    type="text"
                    id="lead-name"
                    placeholder="اكتب اسمك هنا"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="lead-phone">رقم الموبايل (واتساب)</label>
                  <input
                    type="tel"
                    id="lead-phone"
                    placeholder="01xxxxxxxxx أو 05xxxxxxxx"
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>سجّل اهتمامك مجانًا</button>
                <p className="form-note">🔒 بياناتك في أمان تام ولن تُستخدم إلا للتواصل بخصوص الدورة.</p>
              </form>
            ) : (
              <div className="form-success">
                <div className="big">🎉</div>
                <h4>تم استلام بياناتك بنجاح!</h4>
                <p>فريقنا هيتواصل معاك خلال 24 ساعة على الواتساب.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* زر واتساب عائم */}
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="تواصل مع المدرب عبر واتساب">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5-.6-1.5-.8-2-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4 15.7 15.7 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>
      </a>

      {/* PaymentModal popup rendering */}
      {selectedPaymentMethod && (
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          method={selectedPaymentMethod}
          courseId={course.id}
          coursePrice={course.final_price || course.price}
          courseCurrency={course.currency || 'SAR'}
        />
      )}
    </div>
  );
}
