
import Link from "next/link";

interface OutlineBtnProps {
    href: string;
}

export default function OutlineBtn({ href }: OutlineBtnProps) {
    return (
        <Link
            href={href}
            className="btn-outline"
        >
            How it works
        </Link>
    );
}