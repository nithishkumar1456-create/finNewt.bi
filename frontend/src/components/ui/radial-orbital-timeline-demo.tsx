"use client";

import { Calendar, Code, FileText, User, Clock, Rocket, Zap, Globe, Cpu, Users } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "About FinNewt",
    date: "2024",
    content: "Born from the concept of zero-gravity finance, FinNewt is a revolutionary platform for asset visualization.",
    category: "About",
    icon: Globe,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Our Mission",
    date: "Core",
    content: "To simplify complex financial data through fluid, intuitive simulations that empower decision making.",
    category: "Mission",
    icon: Rocket,
    relatedIds: [1, 4],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Technology",
    date: "Stack",
    content: "Powered by high-performance neural engines and frictionless asset modeling for real-time intelligence.",
    category: "Tech",
    icon: Cpu,
    relatedIds: [1, 5],
    status: "in-progress" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "Future Vision",
    date: "2025+",
    content: "Defining the next generation of algorithmic wealth management with predictive simulation layers.",
    category: "Vision",
    icon: Zap,
    relatedIds: [2, 5],
    status: "pending" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "Careers",
    date: "Active",
    content: "Join our team of researchers and engineers building the future of decentralized intelligent finance.",
    category: "Company",
    icon: Users,
    relatedIds: [3, 4],
    status: "pending" as const,
    energy: 50,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default RadialOrbitalTimelineDemo;
