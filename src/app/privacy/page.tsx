"use client";
import { motion } from 'motion/react';

export default function PrivacyPage() {
    const sections = [
        {
            title: "1. Introduction",
            content: "EmailCopilot respects your privacy and is committed to handling personal data responsibly and transparently. This Privacy Statement explains how EmailCopilot collects, uses, stores, and protects information when you use the platform. EmailCopilot is operated by Achieve."
        },
        {
            title: "2. Data Collection",
            content: "We collect information you provide directly to us, such as your name, email address, and company details when you register for an account. Additionally, as an outbound outreach automation tool, we may process contact data from your integrated CRM systems or publicly available sources to facilitate your outreach campaigns."
        },
        {
            title: "3. How We Use Your Data",
            content: "Your data is used to provide, maintain, and improve the EmailCopilot services. This includes personalizing your experience, automating email sequences, tracking outreach performance, and providing customer support. We may also use anonymized data for internal analytics and product optimization."
        },
        {
            title: "4. Data Sharing and Disclosure",
            content: "We do not sell your personal data. We may share information with trusted third-party service providers (such as cloud hosting or secure payment processors) who perform services on our behalf. We ensure these partners adhere to strict confidentiality and security standards."
        },
        {
            title: "5. Data Security",
            content: "EmailCopilot implements industry-standard technical and organizational measures to protect your data against unauthorized access, loss, or alteration. This includes encryption of data in transit and at rest, as well as regular security audits."
        },
        {
            title: "6. Your Rights",
            content: "Depending on your location, you may have rights under data protection laws (such as GDPR or CCPA), including the right to access, correct, or delete your personal data. You can manage your communication preferences through your account settings."
        },
        {
            title: "7. Contact Us",
            content: "If you have questions or concerns about this Privacy Statement, please contact the EmailCopilot privacy team at privacy@achieve.com."
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
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {section.content}
                        </p>
                    </section>
                ))}
            </div>
        </motion.div>
    );
}
