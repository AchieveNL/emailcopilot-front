"use client";
import { motion } from 'motion/react';

export default function TermsPage() {
    const sections = [
        {
            title: "1. Introduction",
            content: "These General Terms & Conditions apply to the use of EmailCopilot, a software product operated by Achieve. By using EmailCopilot, you agree to these Terms. EmailCopilot is a software platform designed to automate outbound outreach workflows, including lead discovery, email automation, and campaign management."
        },
        {
            title: "2. Company Information",
            content: "EmailCopilot is a product operated by:\n\nAchieve.nl\nChamber of Commerce: 76815889\nVAT number: NL003153126B65\nRegistered in the Netherlands"
        },
        {
            title: "3. Definitions",
            content: "In these Terms:\n\n• “EmailCopilot” refers to the software platform and related services.\n• “User” refers to any person or business using the platform.\n• “Subscription” refers to a paid monthly plan.\n• “Platform” refers to the EmailCopilot software environment."
        },
        {
            title: "4. Nature of the Service",
            content: "EmailCopilot is a software tool intended to assist businesses with outbound outreach automation.\n\nEmailCopilot does not guarantee:\n• replies\n• meetings\n• conversions\n• sales\n• deliverability\n• inbox placement\n• campaign performance\n\nResults depend on many external factors including domain reputation, email configuration, offer quality, targeting, and user behavior."
        },
        {
            title: "5. User Responsibility",
            content: "Users remain fully responsible for:\n• all emails sent through the platform\n• connected email accounts\n• campaign content\n• outreach practices\n• compliance with local laws and regulations\n• data usage\n• recipient handling\n\nAny data found, generated, discovered, or processed by AI or scraping systems is used entirely at the user’s own responsibility.\n\nEmailCopilot is intended to be used as a marketing tool to amplify outreach within the user’s niche."
        },
        {
            title: "6. Prohibited Use",
            content: "Users may not use EmailCopilot for:\n• illegal outreach\n• phishing\n• scams\n• malware distribution\n• impersonation\n• harassment\n• misleading campaigns\n• spam campaigns\n• unlawful marketing activities\n• sending harmful or deceptive content\n\nEmailCopilot reserves the right to suspend or terminate accounts immediately if abuse, spam, or illegal activity is suspected."
        },
        {
            title: "7. Email Deliverability",
            content: "EmailCopilot is designed with deliverability best practices in mind, including:\n• sending limits\n• sending intervals\n• smart automation behavior\n\nHowever, EmailCopilot cannot guarantee inbox placement, domain reputation, sender reputation, or email deliverability outcomes.\n\nUsers remain responsible for maintaining healthy domains and properly configured email accounts."
        },
        {
            title: "8. AI Generated Content",
            content: "The platform may use AI systems to assist with lead discovery, automation, and email generation.\n\nUsers remain fully responsible for reviewing, approving, and using generated content.\n\nEmailCopilot is not responsible for inaccuracies, generated statements, or campaign outcomes resulting from AI generated content."
        },
        {
            title: "9. Subscriptions",
            content: "EmailCopilot subscriptions are billed monthly.\n\nSubscriptions renew automatically unless canceled before the next billing cycle.\n\nUsers may cancel at any time.\n\nAfter cancellation, the subscription remains active until the end of the current paid billing period."
        },
        {
            title: "10. Payments",
            content: "All prices are displayed excluding VAT unless stated otherwise.\n\nFailure to complete payment may result in account suspension or restricted platform access."
        },
        {
            title: "11. Refund Policy",
            content: "Due to the digital nature of the platform, payments are generally non refundable.\n\nRefunds may only be granted if:\n• a major technical issue caused by EmailCopilot prevents normal platform usage\n• the issue is verifiably caused by EmailCopilot\n• support could not reasonably resolve the issue\n\nRefunds will not be granted for:\n• poor campaign performance\n• low reply rates\n• low conversions\n• deliverability issues\n• spam folder placement\n• user setup mistakes\n• domain reputation issues\n• dissatisfaction with results\n• misuse of the platform"
        },
        {
            title: "12. Platform Availability",
            content: "EmailCopilot aims to provide stable uptime and availability but does not guarantee uninterrupted access.\n\nTemporary outages, maintenance, updates, or technical interruptions may occur."
        },
        {
            title: "13. Limitation of Liability",
            content: "To the maximum extent permitted by law, EmailCopilot and Achieve shall not be liable for:\n• indirect damages\n• loss of revenue\n• lost profits\n• lost leads\n• business interruption\n• reputational damage\n• email deliverability issues\n• blacklisting\n• third party service interruptions\n\nTotal liability shall never exceed the amount paid by the user during the previous 30 days."
        },
        {
            title: "14. Intellectual Property",
            content: "All platform software, branding, visuals, systems, designs, and technology remain the intellectual property of EmailCopilot and Achieve.\n\nUsers may not:\n• copy\n• resell\n• reverse engineer\n• redistribute\n• reproduce\n• exploit\n\nany part of the platform without written permission."
        },
        {
            title: "15. Account Suspension & Termination",
            content: "EmailCopilot reserves the right to suspend or terminate accounts without prior notice in cases involving:\n• spam\n• abuse\n• illegal activities\n• suspicious usage\n• platform misuse\n• violation of these Terms"
        },
        {
            title: "16. Third Party Services",
            content: "EmailCopilot may integrate with third party services such as email providers and infrastructure platforms.\n\nEmailCopilot is not responsible for outages, restrictions, suspensions, or failures caused by third party providers."
        },
        {
            title: "17. Privacy",
            content: "Use of EmailCopilot may involve the processing of business and contact data.\n\nUsers are responsible for ensuring they use the platform in compliance with applicable privacy and data protection laws."
        },
        {
            title: "18. Governing Law",
            content: "These Terms are governed exclusively by Dutch law.\n\nAny disputes shall be submitted to the competent court in the Netherlands."
        },
        {
            title: "19. Changes to These Terms",
            content: "EmailCopilot reserves the right to update or modify these Terms at any time.\n\nContinued use of the platform after changes are published constitutes acceptance of the updated Terms."
        },
        {
            title: "20. Contact",
            content: "For questions regarding these Terms, users may contact:\nhttps://achieve.nl/contact"
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
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {section.content}
                        </p>
                    </section>
                ))}
            </div>
        </motion.div>
    );
}