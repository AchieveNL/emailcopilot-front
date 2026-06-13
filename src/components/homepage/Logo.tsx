import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <div className=" px-0 lg:px-6 py-5 flex items-center gap-3">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logos/emailCopilotLogo.png"
          alt="Logo"
          width={208}
          height={40}
        />
      </Link>
    </div>
  );
}

export default Logo;
