import React from 'react'
import Logo from './Logo'
import Link from 'next/link'

function Footer() {
    return (
        <footer style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }} className='max-w-315 w-full m-auto px-6 py-12'>
            <div className="">
                <div className='flex flex-wrap gap-8 mb-10 items-center justify-center'>
                    <div>
                        <Logo />
                    </div>
                    <div className='flex justify-between w-full'>

                        <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Powered by <a href="https://www.achieve.nl" target="_blank" rel="noopener noreferrer" style={{ color: "#a0a0b0" }}>Achieve.nl</a> © 2026</span>
                        <div className='flex gap-6'>

                            <Link href="/terms">
                                <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>General terms</span>
                            </Link>
                            <Link href="/disclaimer">
                                <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Disclaimer</span>
                            </Link>
                            <Link href="/privacy">
                                <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>Privacy Statement</span>
                            </Link>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>2026 © EmailCopilot. All rights reserved.</span>
                    </div>

                </div>

            </div>
        </footer>
    )
}

export default Footer