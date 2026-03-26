import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen } from "lucide-react";
import { useProjects } from "../hooks/useQueries";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  const { data: projects = [], isLoading } = useProjects();

  return (
    <section id="projects" className="py-20 md:py-32 section-bg">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A curated selection of my best work — from web apps to full-stack
            platforms.
          </p>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="projects.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none bg-muted/30" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-5 w-3/4 bg-muted/30" />
                  <Skeleton className="h-4 w-full bg-muted/30" />
                  <Skeleton className="h-4 w-2/3 bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="projects.empty_state"
          >
            <div className="glass rounded-2xl p-12 max-w-md">
              <FolderOpen className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-foreground/60 mb-2">
                No Projects Yet
              </h3>
              <p className="text-muted-foreground">
                Projects will appear here once added from the admin panel.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id.toString()}
                project={project}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
