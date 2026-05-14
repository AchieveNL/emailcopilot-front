import React from 'react'
import Logo from './Logo'

function Footer() {
    return (
        <footer style={{ padding: "48px 2rem 48px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
            <div className="max-w-[1000px] mx-auto">
                <div className='flex flex-wrap gap-8 mb-10 items-center justify-center'>
                    <div>
                        <Logo />
                    </div>
                    <div className='flex justify-between w-full'>

                        <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Powered by Achieve.nl © 2026</span>
                        <div className='flex gap-6'>

                            <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>General terms</span>
                            <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Disclaimer</span>
                            <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Privacy Statement</span>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>2026 © EmailCopilot. All rights reserved.</span>
                    </div>

                </div>

            </div>
        </footer>
    )
}

export default Footer