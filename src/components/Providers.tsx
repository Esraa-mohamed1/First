"use client";

import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CountryProvider } from '@/providers/CountryProvider';
import QueryProvider from '@/providers/QueryProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "000000000000-dummy.apps.googleusercontent.com";

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tenant = localStorage.getItem('academy_link_name');
            if (tenant) {
                document.cookie = `academy_link_name=${tenant}; path=/; max-age=31536000; SameSite=Lax`;
            }
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <QueryProvider>
                <CountryProvider>
                    {children}
                </CountryProvider>
            </QueryProvider>
        </GoogleOAuthProvider>
    );
}
