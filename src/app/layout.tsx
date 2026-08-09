import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import RegistrationModal from "@/components/Modals/RegistrationModal";
import LoginModal from "@/components/Modals/LoginModal";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import PageLoader from "@/components/PageLoader";
import Script from "next/script";

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
        <html lang="ar" dir="rtl" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Script id="clarity-script" strategy="afterInteractive">
                    {`
                        (function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "xzm1689tnx");
                    `}
                </Script>
                <Providers>
                    <ModalProvider>
                        {children}
                        <PageLoader />
                        <RegistrationModal />
                        <LoginModal />
                        <Toaster position="top-center" />
                    </ModalProvider>
                </Providers>
            </body>
        </html>
    );
}

