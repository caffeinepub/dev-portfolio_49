import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(138, 92, 246, ${p.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
        style={{ background: "oklch(0.65 0.25 280)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float"
        style={{ background: "oklch(0.72 0.18 15)", animationDelay: "3s" }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 animate-fade-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            Available for new projects
          </span>
        </div>

        {/* Name */}
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 animate-fade-up-delay-1 leading-none">
          <span className="gradient-text">SURYANSH SWARAJ</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-up-delay-2 font-light">
          Crafting{" "}
          <span className="text-secondary font-medium">
            Digital Experiences
          </span>{" "}
          That Matter
        </p>
        <p className="text-base text-muted-foreground/70 mb-10 animate-fade-up-delay-3 max-w-2xl mx-auto">
          Full-stack developer specializing in modern web technologies, creating
          high-performance applications with elegant interfaces.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-up-delay-4">
          <Button
            onClick={scrollToProjects}
            size="lg"
            data-ocid="hero.view_projects.button"
            className="btn-primary px-8 py-4 text-base font-semibold"
          >
            View Projects
          </Button>
          <Button
            onClick={scrollToContact}
            size="lg"
            variant="outline"
            data-ocid="hero.hire_me.button"
            className="btn-outline-primary px-8 py-4 text-base"
          >
            Hire Me
          </Button>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
