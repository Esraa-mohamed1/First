import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import LoginModal from "@/components/Modals/LoginModal";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
    weight: ["400", "700"], // Normal and Bold
    subsets: ["arabic"] 
});

export const metadata: Metadata = {
    title: "First - Landing Page",
    description: "Create your academy easily",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" className={ibmPlexSansArabic.className}>
            <body suppressHydrationWarning>
                <Providers>
                    <ModalProvider>
                        {children}
                        <RegistrationModal />
                        <LoginModal />
                        <Toaster position="top-center" />
                    </ModalProvider>
                </Providers>
            </body>
        </html>
    );
}
