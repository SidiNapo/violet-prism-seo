import {
  Search,
  BarChart3,
  ClipboardCheck,
  BookOpenText,
  Code2,
  FileCode,
  Link2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ToolSlug =
  | "serp-preview"
  | "keyword-density"
  | "page-auditor"
  | "readability"
  | "meta-generator"
  | "robots-sitemap"
  | "anchor-audit"
  | "keyword-ideas";

export type ToolCategory = "on-page" | "content" | "technical" | "off-page";

export const TOOLS: { slug: ToolSlug; icon: LucideIcon; category: ToolCategory }[] = [
  { slug: "serp-preview", icon: Search, category: "on-page" },
  { slug: "keyword-density", icon: BarChart3, category: "content" },
  { slug: "page-auditor", icon: ClipboardCheck, category: "on-page" },
  { slug: "readability", icon: BookOpenText, category: "content" },
  { slug: "meta-generator", icon: Code2, category: "technical" },
  { slug: "robots-sitemap", icon: FileCode, category: "technical" },
  { slug: "anchor-audit", icon: Link2, category: "off-page" },
  { slug: "keyword-ideas", icon: Sparkles, category: "content" },
];
