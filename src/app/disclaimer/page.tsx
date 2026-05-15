"use client";
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
    const sections = [
        {
            title: "General Information",
            content: "The information on this website and in other communication from EmailCopilot is provided for general informational purposes only. While we carefully maintain the content of our website and platform, we cannot guarantee that all information is complete, accurate, or up to date at all times."
        },
        {
            title: "No Warranty",
            content: "Achieve provides EmailCopilot on an 'as is' and 'as available' basis. Use of the software and platform is at your own risk. We make no warranties of any kind, whether express, implied, or statutory, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement."
        },
        {
            title: "Limitation of Liability",
            content: "In no event shall Achieve be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform."
        },
        {
            title: "External Links",
            content: "EmailCopilot may contain links to third-party websites or services that are not owned or controlled by Achieve. Achieve has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services."
        },
        {
            title: "Changes to Software",
            content: "We reserve the right to modify, suspend, or discontinue the EmailCopilot platform (or any part or content thereof) at any time without notice. We will not be liable to you or to any third party for any modification, suspension, or discontinuance of the platform."
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
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
