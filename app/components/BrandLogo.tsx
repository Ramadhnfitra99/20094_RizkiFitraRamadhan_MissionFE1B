/* eslint-disable @next/next/no-img-element -- The compact brand asset is served directly. */
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
};

export function BrandLogo({ href = "/home", className = "" }: BrandLogoProps) {
  return (
    <Link href={href} className={`brand-logo ${className}`} aria-label="Chill beranda">
      <img src="/assets/img/Logo.png" alt="Logo Chill" width={150} height={42} />
    </Link>
  );
}
