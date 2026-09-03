'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const FinanceOverview = () => {
  useEffect(() => {
    redirect('/academic/finance/requests');
  }, []);

  return null;
};

export default FinanceOverview;
