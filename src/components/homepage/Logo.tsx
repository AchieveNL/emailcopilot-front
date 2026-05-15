import Link from "next/link"

function Logo() {
    return (
        <div className="px-6 py-5 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
                <img src="/Emailcopilot2.svg" alt="Logo" className="w-52" />
            </Link>
        </div>
    )
}

export default Logo