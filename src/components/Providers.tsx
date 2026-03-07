'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Provide a dummy ID if missing to prevent GoogleOAuthProvider from crashing
    // while still providing the context for hooks like useGoogleLogin
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "000000000000-dummy.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
