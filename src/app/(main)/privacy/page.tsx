"use client";
import { motion } from 'motion/react';

export default function PrivacyPage() {
    const sections = [
        {
            title: "1. Introduction",
            content: "EmailCopilot respects your privacy and is committed to handling personal data responsibly and transparently.\n\nThis Privacy Statement explains how EmailCopilot collects, uses, stores, and protects information when you use the platform.\n\nEmailCopilot is a product operated by Achieve."
        },
        {
            title: "2. Company Information",
            content: "Achieve.nl\nChamber of Commerce: 76815889\nVAT number: NL003153126B65\nRegistered in the Netherlands"
        },
        {
            title: "3. What Data We Collect",
            content: "Depending on how you use the platform, EmailCopilot may collect and process:\n\n• account information\n• name and email address\n• billing information\n• connected email account details\n• campaign settings\n• email templates\n• outreach activity\n• usage analytics\n• technical device information\n• IP addresses\n• browser and session data\n\nUsers may also upload or process business related contact information through the platform."
        },
        {
            title: "4. How We Use Data",
            content: "We use collected data to:\n\n• provide and maintain the platform\n• process subscriptions and payments\n• improve platform functionality\n• provide customer support\n• monitor platform security and abuse\n• analyze usage and performance\n• develop new features\n• communicate important service updates"
        },
        {
            title: "5. AI & Automation",
            content: "Certain features within EmailCopilot may use AI systems to assist with automation, lead discovery, template generation, and outreach workflows.\n\nUsers remain responsible for reviewing and approving generated content before use."
        },
        {
            title: "6. Outreach & User Responsibility",
            content: "EmailCopilot is intended as a marketing automation platform.\n\nUsers remain fully responsible for:\n• the emails they send\n• campaign content\n• outreach practices\n• compliance with local laws and regulations\n• lawful use of data\n• recipient handling\n\nEmailCopilot may not be used for spam, phishing, illegal outreach, or deceptive marketing practices."
        },
        {
            title: "7. Third Party Services",
            content: "EmailCopilot may use third party providers for:\n• hosting\n• analytics\n• payments\n• email infrastructure\n• platform functionality\n\nThese providers may process limited data necessary for delivering the service.\n\nEmailCopilot is not responsible for outages, restrictions, or failures caused by third party services."
        },
        {
            title: "8. Cookies & Analytics",
            content: "EmailCopilot may use cookies and analytics technologies to:\n• improve user experience\n• remember preferences\n• analyze website traffic\n• measure platform performance\n\nUsers can manage cookie preferences through their browser settings."
        },
        {
            title: "9. Data Retention",
            content: "We retain data only as long as reasonably necessary for:\n• platform functionality\n• legal obligations\n• security purposes\n• support and operational needs\n\nUsers may request deletion of their account and associated personal data where legally applicable."
        },
        {
            title: "10. Data Security",
            content: "EmailCopilot takes reasonable technical and organizational measures to protect user data against unauthorized access, loss, misuse, or disclosure.\n\nHowever, no online platform can guarantee absolute security."
        },
        {
            title: "11. Your Rights",
            content: "Under applicable privacy laws, users may have the right to:\n• access personal data\n• correct inaccurate data\n• request deletion\n• restrict processing\n• object to processing\n• request data portability\n\nRequests may be submitted through the contact information below."
        },
        {
            title: "12. International Processing",
            content: "Some third party providers used by EmailCopilot may process data outside the European Economic Area.\n\nWhere applicable, reasonable safeguards are implemented."
        },
        {
            title: "13. Changes to This Privacy Statement",
            content: "EmailCopilot reserves the right to modify this Privacy Statement at any time.\n\nContinued use of the platform after updates constitutes acceptance of the revised Privacy Statement."
        },
        {
            title: "14. Contact",
            content: "For questions regarding this Privacy Statement:\n\nachieve.nl/contact"
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
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                    Legal Statement
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Privacy Policy
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                    Last updated: May 2026. This policy outlines how Achieve handles your personal information through the EmailCopilot platform.
                </p>
            </div>

            <div className="space-y-12">
                {sections.map((section, idx) => (
                    <section key={idx} className="group">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-3">
                            <span className="text-blue-200 group-hover:text-blue-500 transition-colors">
                                {section.title.split('.')[0]}.
                            </span>
                            {section.title.split('.').slice(1).join('.').trim()}
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {section.content}
                        </p>
                    </section>
                ))}
            </div>
        </motion.div>
    );
}