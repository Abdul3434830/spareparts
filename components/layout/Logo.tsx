import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  href?: string;
}

export function Logo({ className = "", variant = "full", href = "/" }: LogoProps) {
  const content =
    variant === "icon" ? (
      <div className={`relative flex items-center shrink-0 ${className}`}>
        <Image
          src="/care-icon.svg"
          alt="CARS SPARE PARTS"
          width={40}
          height={40}
          className="h-10 w-10 object-contain rounded-xl"
          priority
        />
      </div>
    ) : (
      <div className={`relative flex items-center shrink-0 ${className}`}>
        <Image
          src="/care-logo-dark.svg"
          alt="CARS SPARE PARTS"
          width={180}
          height={50}
          className="h-10 sm:h-11 w-auto object-contain"
          priority
        />
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center shrink-0 focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
