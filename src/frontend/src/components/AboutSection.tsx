import { Code2, Lightbulb, Rocket } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    desc: "Writing maintainable, scalable code is my craft",
  },
  {
    icon: Rocket,
    title: "Performance",
    desc: "Optimizing for speed, accessibility, and UX",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Embracing new technologies to build the future",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Avatar / Visual */}
          <div className="flex justify-center lg:justify-start animate-fade-up">
            <div className="relative">
              <div
                className="w-72 h-72 md:w-96 md:h-96 rounded-3xl flex items-center justify-center overflow-hidden glass animate-pulse-glow"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.25 280 / 0.2), oklch(0.72 0.18 15 / 0.2))",
                }}
              >
                <div className="text-center">
                  <div
                    className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center font-display text-5xl font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.72 0.18 15))",
                    }}
                  >
                    YN
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Your Photo Here
                  </p>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-2 border border-primary/30">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-display text-2xl font-bold text-primary">
                  5+ Years
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 animate-fade-up-delay-1">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
                About Me
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Passionate About{" "}
                <span className="gradient-text">Digital Craft</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              I'm a full-stack web developer with a passion for building
              exceptional digital experiences. With expertise in modern
              frameworks and a keen eye for design, I create applications that
              are both beautiful and performant.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not coding, I'm exploring the latest in web3,
              contributing to open-source projects, and continuously learning to
              stay at the cutting edge of technology.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="glass rounded-xl p-4 text-center hover:border-primary/40 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
