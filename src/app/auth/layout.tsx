import Image from "next/image";
import paymentbg from "@/assets/paymentbg.jpg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={paymentbg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
}
