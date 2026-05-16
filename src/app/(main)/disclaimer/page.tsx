"use client";
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
    const sections = [
        {
            title: "General",
            content: "The information on this website and in other communication from EmailCopilot is provided for general informational purposes only. While we carefully maintain the content of our website and platform, we cannot guarantee that all information is complete, accurate, or up to date at all times. No rights can be derived from the content of this website.\n\nEmailCopilot is a product operated by Achieve."
        },
        {
            title: "Use of the Platform",
            content: "Use of the website, platform, and all related information is entirely at your own risk. EmailCopilot accepts no liability for any damages resulting from the use of the platform, temporary unavailability, technical interruptions, or reliance on information provided through the platform."
        },
        {
            title: "Software & Results",
            content: "EmailCopilot is intended as a software tool to assist with outbound outreach automation. Results such as replies, meetings, conversions, sales, or deliverability are never guaranteed.\n\nPerformance depends on multiple external factors including targeting, domain reputation, email configuration, offer quality, campaign setup, and user behavior.\n\nAny data, leads, or business information found, generated, or processed by AI systems or scraping functionality remains the responsibility of the user."
        },
        {
            title: "AI Generated Content",
            content: "Certain features within EmailCopilot may use AI generated suggestions, automation, or content generation. Users remain fully responsible for reviewing, approving, and using any generated content before sending or publishing it.\n\nEmailCopilot is not responsible for inaccuracies, generated statements, or campaign outcomes resulting from AI generated content."
        },
        {
            title: "External Services",
            content: "EmailCopilot may integrate with third party providers such as email services, hosting providers, or infrastructure tools. We are not responsible for outages, delays, suspensions, deliverability issues, or failures caused by third party services."
        },
        {
            title: "Intellectual Property",
            content: "All intellectual property rights relating to the EmailCopilot platform, including but not limited to branding, software, designs, visuals, logos, systems, text, and functionality, remain the property of EmailCopilot and/or Achieve.\n\nIt is not permitted to copy, reproduce, distribute, reverse engineer, or commercially exploit any part of the platform without prior written permission."
        },
        {
            title: "Changes",
            content: "EmailCopilot reserves the right to modify the website, platform, services, pricing, functionality, and this disclaimer at any time without prior notice."
        },
        {
            title: "Liability",
            content: "To the maximum extent permitted by law, EmailCopilot and Achieve shall not be liable for any direct or indirect damages arising from or related to the use of the platform, website, software, AI systems, or related services."
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                    <AlertTriangle className="w-3 h-3" />
                    Disclosure
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Disclaimer
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                    Important information regarding the use and limitations of the EmailCopilot platform.
                </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
                <div className="space-y-12">
                    {sections.map((section, idx) => (
                        <section key={idx}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                                {section.title}
                            </h2>
                            <div className="h-1 w-12 bg-amber-200 mb-4 rounded-full" />
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}