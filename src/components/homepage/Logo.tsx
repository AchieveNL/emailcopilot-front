import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <div className=" px-3 lg:px-6 py-5 flex items-center gap-3">
      <Link href="/" className="flex items-center gap-3 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 active:duration-100">
        <Image src="/EmailcopilotLogo.svg" alt="Logo" loading="eager" width={208} height={40} />
      </Link>
    </div>
  );
}

export default Logo;
