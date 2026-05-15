"use client";
import { motion } from 'motion/react';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Introduction",
            content: "These General Terms & Conditions apply to the use of EmailCopilot, a software product operated by Achieve. By using EmailCopilot, you agree to these Terms. EmailCopilot is a software platform designed to automate outbound outreach and enhance communication workflows."
        },
        {
            title: "2. Software Use",
            content: "EmailCopilot grants you a limited, non-exclusive, non-transferable, and revocable license to use the software solely for your internal business purposes. You agree not to misuse the platform or assist anyone else in doing so."
        },
        {
            title: "3. User Obligations",
            content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must comply with all applicable anti-spam laws and regulations when using EmailCopilot for outreach."
        },
        {
            title: "4. Intellectual Property",
            content: "All rights, title, and interest in and to the EmailCopilot platform, including all software, design, and branding, are and will remain the exclusive property of Achieve and its licensors."
        },
        {
            title: "5. Data Ownership",
            content: "You retain all rights to the data you upload to the platform. By using the platform, you grant Achieve a worldwide, royalty-free license to use, display, and distribute this data solely for the purpose of providing the services to you."
        },
        {
            title: "6. Termination",
            content: "We may terminate or suspend your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
        },
        {
            title: "7. Governing Law",
            content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Achieve is registered, without regard to its conflict of law provisions."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-315 w-full m-auto mt-32'
        >
            <div className="mb-12">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                    Agreement Terms
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    General Terms & Conditions
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                    Last updated: May 2026. Please read these terms carefully before using the EmailCopilot platform.
                </p>
            </div>

            <div className="grid gap-8">
                {sections.map((section, idx) => (
                    <section key={idx} className="p-6 border border-gray-100 rounded-2xl hover:border-blue-100 transition-colors">
                        <h2 className="text-lg font-bold mb-3">
                            {section.title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {section.content}
                        </p>
                    </section>
                ))}
            </div>
        </motion.div>
    );
}
