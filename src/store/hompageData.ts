import { Send, Search, Mail, ListChecks, Settings, Zap, MapPin, MessageSquare, Database, Link as LinkIcon, ChevronRight, Plus, ChevronDown, Check, X, Coffee } from "lucide-react";

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
        q: "Do I need my own email account?",
        a: "Yes — EmailCopilot connects to your own SMTP (Gmail, Outlook, or any provider). This means emails come from your real domain, boosting deliverability and keeping your sender reputation safe.",
    },
    {
        q: "How does the lead scraping work?",
        a: "You give us a search query (e.g. 'dental practices in London') and we scrape Google Maps to find matching businesses with contact details. The system runs automatically twice a day.",
    },
    {
        q: "Will this get my domain blacklisted?",
        a: "We built EmailCopilot with deliverability in mind. We enforce daily sending limits, add natural delays between emails, and never share sending infrastructure across customers.",
    },
    {
        q: "Can I customise the email templates?",
        a: "Absolutely. You have full control over every template. You can use dynamic variables like business name, location, and website to make each email feel genuinely personal.",
    },
    {
        q: "What happens when someone replies?",
        a: "Replies land directly in your inbox — we never intercept them. You can also log the reply status in the dashboard so your team knows which leads are warm.",
    },
    {
        q: "Is there a free trial?",
        a: "Yes, you can start for free and explore the dashboard. Paid plans start at €9/month — no credit card required to get started.",
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
        price: "€9",
        tag: null,
        volume: "250 emails · ~8/day",
        features: ["1 Copilot", "1 SMTP account", "Strong value to get started"],
        cta: "Start free",
    },
    {
        name: "Growth",
        price: "€19",
        tag: "Most popular",
        volume: "750 emails · ~25/day",
        features: ["3 Copilots", "Up to 3 SMTP accounts", "Export your data"],
        cta: "Start free",
        highlight: true,
    },
    {
        name: "Scale",
        price: "€39",
        tag: null,
        volume: "2,000 emails · ~65/day",
        features: ["Unlimited Copilots", "Unlimited SMTP accounts", "Full data ownership + export"],
        cta: "Start free",
    },
];
