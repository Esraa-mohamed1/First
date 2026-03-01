import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import LoginModal from "@/components/Modals/LoginModal";
import { Toaster } from "react-hot-toast";

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
        <html lang="ar" dir="rtl">
            <body>
                <ModalProvider>
                    {children}
                    <RegistrationModal />
                    <LoginModal />
                    <Toaster position="top-center" />
                </ModalProvider>
            </body>
        </html>
    );
}
