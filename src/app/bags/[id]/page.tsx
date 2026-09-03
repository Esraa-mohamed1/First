'use client';

import { useParams } from 'next/navigation';
import BagGuestView from '@/components/bag/BagGuestView';

export default function GuestBagPage() {
  const params = useParams();
  const bagId = (params?.id as string) || '';

  return <BagGuestView bagId={bagId} />;
}
