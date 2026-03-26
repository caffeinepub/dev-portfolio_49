import { Progress } from "@/components/ui/progress";

const skillCategories = [
  {
    name: "Frontend",
    color: "oklch(0.65 0.25 280)",
    skills: [
      { name: "React / React Native", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Three.js / WebGL", level: 70 },
    ],
  },
  {
    name: "Backend",
    color: "oklch(0.72 0.18 15)",
    skills: [
      { name: "Node.js / Express", level: 88 },
      { name: "Python / FastAPI", level: 80 },
      { name: "Motoko / ICP", level: 75 },
      { name: "PostgreSQL", level: 82 },
      { name: "GraphQL", level: 78 },
    ],
  },
  {
    name: "Tools & DevOps",
    color: "oklch(0.70 0.18 200)",
    skills: [
      { name: "Git / GitHub", level: 95 },
      { name: "Docker", level: 78 },
      { name: "Figma / Design", level: 80 },
      { name: "CI/CD Pipelines", level: 72 },
      { name: "Web3 / Blockchain", level: 68 },
    ],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 md:py-32 section-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, cIdx) => (
            <div
              key={category.name}
              className="glass rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${cIdx * 0.15}s` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: category.color,
                    boxShadow: `0 0 10px ${category.color}`,
                  }}
                />
                <h3 className="font-display text-xl font-bold">
                  {category.name}
                </h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground/80">
                        {skill.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ background: "oklch(0.20 0.03 265)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${category.color}, ${category.color}99)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
