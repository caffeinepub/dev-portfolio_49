import { Eye, FolderOpen, MousePointer } from "lucide-react";
import { useProjects, useVisitorStats } from "../hooks/useQueries";

export default function StatsBar() {
  const { data: stats } = useVisitorStats();
  const { data: projects = [] } = useProjects();

  const items = [
    {
      icon: Eye,
      label: "Total Visits",
      value: stats?.totalVisits?.toString() ?? "...",
      color: "text-primary",
    },
    {
      icon: MousePointer,
      label: "Unique Visitors",
      value: stats?.uniqueVisitors?.toString() ?? "...",
      color: "text-secondary",
    },
    {
      icon: FolderOpen,
      label: "Projects",
      value: projects.length.toString(),
      color: "text-foreground",
    },
  ];

  return (
    <section
      className="py-8 border-y border-border/30"
      style={{ background: "oklch(0.10 0.022 265 / 0.8)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
            >
              <div
                className="p-2 rounded-lg"
                style={{ background: "oklch(0.65 0.25 280 / 0.1)" }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className={`font-display text-2xl font-bold ${item.color}`}>
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
