import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #f0fdf4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background orbs */}
            <div style={{
                position: "absolute", top: "-80px", right: "-80px",
                width: 320, height: 320, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute", bottom: "-60px", left: "-60px",
                width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
                    }}>
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.12-.45a2 2 0 0 1 2.11.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#111118", letterSpacing: "-0.02em" }}>EmailCopilot</div>
                        <div style={{ fontSize: "0.65rem", color: "#a0a0b0", marginTop: 1 }}>Lead generation</div>
                    </div>
                </div>
                <SignIn />
            </div>
        </div>
    );
}