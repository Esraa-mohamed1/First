'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import BagWizardPage from '@/components/Academic/Market/BagWizardPage';

/**
 * Edit Market Bag Page
 * Full page route: /academic/market/edit/[id]
 */
export default function EditMarketBagPage() {
  const params = useParams();
  const editId = params?.id ? Number(params.id) : undefined;

  return <BagWizardPage editBagId={editId} />;
}
