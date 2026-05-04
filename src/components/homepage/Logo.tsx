import { Send } from "lucide-react"

function Logo() {
    return (
        <div className="px-6 py-5 flex items-center gap-3">
            <Send size={20} className="text-gray-900" />
            <span className="text-xl font-bold tracking-tight">Emailcopilot.io</span>
        </div>
    )
}

export default Logo