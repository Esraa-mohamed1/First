import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import LoginModal from "@/components/Modals/LoginModal";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

const inter = Inter({ weight: "400", subsets: ["latin-ext"] });

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
        <html lang="ar" dir="rtl" className={inter.className}>
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
