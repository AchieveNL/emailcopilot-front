import { ArrowBigLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PrimaryBtnProps {
    href: string;
    text?: string;
    className?: string;
}

export default function PrimaryBtn({
    href,
    text = "Start Flying",
    className = ""
}: PrimaryBtnProps) {
    return (
        <Link
            href={href}
            className={`btn-primary ${className}`}
            role="button"
        >
            <div className="wrapper">
                <span>{text}</span>
                <ArrowRight size={18} />
            </div>
        </Link>
    );
}