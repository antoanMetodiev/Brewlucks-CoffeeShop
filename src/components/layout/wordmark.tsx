import Image from "next/image";
import logo from "../../../public/images/brewlucks-logo.jpg";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src={logo}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover"
        priority
      />
      <span className={`font-display leading-none tracking-tight ${className}`}>
        <span className="text-accent">Brew</span>lucks
      </span>
    </span>
  );
}
