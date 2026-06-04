import { Send, Search, Mail, ListChecks, Settings, Zap, MapPin, MessageSquare, Database, Link as LinkIcon, ChartSpline, Rocket } from "lucide-react";

export const FEATURES = [
    {
        icon: Search,
        title: "Smart lead scraping",
        desc: "Automatically finds businesses on Google Maps that match your target. Name, email, website — all collected without lifting a finger.",
    },
    {
        icon: Mail,
        title: "Personalised cold emails",
        desc: "Sends tailored emails from your own inbox, at the right time, with natural delays between each send so it always feels human.",
    },
    {
        icon: ListChecks,
        title: "Simple pipeline dashboard",
        desc: "Track every lead from first contact to booked meeting. Filter by status, update notes, and see exactly what was sent and when.",
    },
    {
        icon: Settings,
        title: "Full control, zero lock-in",
        desc: "Your SMTP, your data, your rules. Set daily limits, schedule scrapes, edit templates — everything from one clean dashboard.",
    },
];

export const STEPS = [
    { num: "01", title: "Set your target", desc: "Tell EmailCopilot what kind of businesses to find. A search query is all it takes." },
    { num: "02", title: "We find & contact them", desc: "The system scrapes leads and sends personalised cold emails automatically — every day." },
    { num: "03", title: "You close the meetings", desc: "Replies land in your inbox. Your team qualifies and books. You focus on what matters." },
];

export const STATS = [
    { value: "10–50", label: "emails per day" },
    { value: "2×", label: "daily scrape runs" },
    { value: "100%", label: "your own data" },
    { value: "€9", label: "starting price" },
];

export const TESTIMONIALS = [
    {
        quote: "EmailCopilot has completely transformed our outbound process. We book more meetings with less manual work.",
        name: "Karim Saber",
        role: "Founder, Achieve",
        avatar: "KS",
        color: "#6366f1",
    },
    {
        quote: "We went from zero outbound to 15 qualified meetings a month in just 6 weeks. The ROI is insane for the price.",
        name: "Laura Meijer",
        role: "Head of Sales, Bloom Agency",
        avatar: "LM",
        color: "#0ea5e9",
    },
    {
        quote: "Finally a tool that doesn't require a sales ops team to run. I set it up in an afternoon and it just works.",
        name: "Tomas Varga",
        role: "CEO, ScaleStack",
        avatar: "TV",
        color: "#22c55e",
    },
    {
        quote: "The personalisation is surprisingly good. Our open rates jumped from 18% to 41% in the first month.",
        name: "Nina Hofmann",
        role: "Marketing Lead, Pureform",
        avatar: "NH",
        color: "#f59e0b",
    },
];

export const FAQS = [
    {
        q: "Do I really need my own email account?",
        a: "Yes. EmailCopilot sends emails from your own business email account, like hello@yourbusiness.com. Gmail, Outlook, and other providers work too. That means your emails take off from your own runway instead of some suspicious airport that immediately gets redirected to the spam folder.",
    },

    {
        q: "How does the magic work?",
        a: "We can’t reveal all our secrets, but don’t worry, we trained our copilot very well. You set your target audience, EmailCopilot finds the right businesses, sends personalised emails from your own address, and lands replies straight in your inbox every single day.",
    },

    {
        q: "Will this get my domain blacklisted?",
        a: "No worries. Your copilot isn’t a kamikaze pilot. We use daily sending limits, natural delays, and smart sending behaviour to keep your domain healthy while your outreach quietly flies in the background.",
    },

    {
        q: "Can I customize the email templates?",
        a: "Absolutely. Your copilot works for you, not the other way around. You control every template and can use dynamic variables like {{company}}, {{city}}, and {{website}} to make each email feel personal while your outbound quietly runs in the background.",
    },

    {
        q: "What happens when someone replies?",
        a: "Congratulations. The reply goes straight to your inbox, exactly where it belongs. Your copilot handled the outreach. Our work is done here. The rest is up to you, captain, to close the deal.",
    },

    {
        q: "Is there a free test flight?",
        a: "Yes. We figured asking people to trust an AI copilot without a test flight would be slightly insane. You can explore the dashboard for free before spending a single euro. Paid plans start at €9/month.",
    },
];

export const INTEGRATIONS = [
    { name: "Gmail", icon: Mail, color: "#ea4335" },
    { name: "Outlook", icon: Mail, color: "#0078d4" },
    { name: "Google Maps", icon: MapPin, color: "#34a853" },
    { name: "Slack", icon: MessageSquare, color: "#4a154b" },
    { name: "Zapier", icon: Zap, color: "#ff4a00" },
    { name: "HubSpot", icon: Database, color: "#ff7a59" },
    { name: "Notion", icon: Database, color: "#000000" },
    { name: "Webhooks", icon: LinkIcon, color: "#6366f1" },
];

export const PLANS = [
    {
        name: "Starter",
        description: "Perfect for beginners",
        icon: Send,
        bgcolor: "#F5F3FF",
        textcolor: "#4F46E5",
        price: "€9",
        estimated: "250 emails (~8/days)",
        tag: null,
        volume: "250 emails · ~8/day",
        features: ["1 SMTP account", "Standard delivery speed", "No data export"],
        cta: "Subscribe now",
    },
    {
        name: "Growth",
        description: "Best for growing business",
        icon: ChartSpline,
        bgcolor: "#EFF6FF",
        textcolor: "#2563EB",
        price: "€19",
        estimated: "750 emails (~25/days)",
        tag: "Most popular",
        volume: "750 emails · ~25/day",
        features: ["3 Copilots", "3 SMTP accounts", "Faster delivery speed", "Limited data export"],
        cta: "Subscribe now",
        highlight: true,
    },
    {
        name: "Scale",
        description: "For large teams & agencies",
        icon: Rocket,
        bgcolor: "#F0FDFF",
        textcolor: "#06B6D4",
        price: "€39",
        estimated: "2,000 emails (~65/days)",
        tag: null,
        volume: "2,000 emails · ~65/day",
        features: ["Unlimited Copilots", "Unlimited SMTP accounts", "Priority delivery speed", "Full data export"],
        cta: "Subscribe now",
    },
];
