'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';

const SearchParamsHandler = () => {
    const { openModal } = useModal();
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'login') {
            openModal('login');
            router.replace('/');
        }
    }, [searchParams, openModal, router]);

    return null; // This component doesn't render anything visible
};

export default SearchParamsHandler;
