import Image from "next/image";
import statsBg from "@/assets/stats.jpg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={statsBg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {children}
      </div>
    </div>
  );
}
