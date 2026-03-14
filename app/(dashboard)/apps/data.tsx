import {
  BarChart3,
  Camera,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Music,
  Phone,
  ShoppingCart,
  Video,
  Zap,
} from "lucide-react";

export type App = {
  name: string;
  logo: React.ReactNode;
  connected: boolean;
  desc: string;
};

export const apps: App[] = [
  {
    name: "Stripe",
    logo: <CreditCard className="size-6" />,
    connected: true,
    desc: "Payment processing platform for online businesses.",
  },
  {
    name: "Slack",
    logo: <MessageSquare className="size-6" />,
    connected: true,
    desc: "Team communication and collaboration platform.",
  },
  {
    name: "Google Analytics",
    logo: <BarChart3 className="size-6" />,
    connected: true,
    desc: "Web analytics service for tracking website traffic.",
  },
  {
    name: "Mailchimp",
    logo: <Mail className="size-6" />,
    connected: false,
    desc: "Marketing automation and email marketing platform.",
  },
  {
    name: "Shopify",
    logo: <ShoppingCart className="size-6" />,
    connected: false,
    desc: "E-commerce platform for online stores.",
  },
  {
    name: "Zoom",
    logo: <Video className="size-6" />,
    connected: true,
    desc: "Video conferencing and online meeting platform.",
  },
  {
    name: "Notion",
    logo: <FileText className="size-6" />,
    connected: false,
    desc: "All-in-one workspace for notes, docs, and projects.",
  },
  {
    name: "Twilio",
    logo: <Phone className="size-6" />,
    connected: false,
    desc: "Cloud communications platform for SMS and voice.",
  },
  {
    name: "Cloudflare",
    logo: <Globe className="size-6" />,
    connected: true,
    desc: "Web security and performance optimization service.",
  },
  {
    name: "Spotify",
    logo: <Music className="size-6" />,
    connected: false,
    desc: "Music streaming and podcast platform.",
  },
  {
    name: "Unsplash",
    logo: <Camera className="size-6" />,
    connected: false,
    desc: "Free high-resolution photography platform.",
  },
  {
    name: "Zapier",
    logo: <Zap className="size-6" />,
    connected: true,
    desc: "Workflow automation connecting web applications.",
  },
];
