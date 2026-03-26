import { useEffect, useRef } from "react";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import StatsBar from "../components/StatsBar";
import { useActor } from "../hooks/useActor";
import { useRecordVisit } from "../hooks/useQueries";

interface PortfolioProps {
  onNavigateAdmin: () => void;
}

export default function Portfolio({ onNavigateAdmin }: PortfolioProps) {
  const { actor } = useActor();
  const recordVisitMutation = useRecordVisit();
  const visitRecorded = useRef(false);
  const mutateRef = useRef(recordVisitMutation.mutate);
  mutateRef.current = recordVisitMutation.mutate;

  useEffect(() => {
    if (actor && !visitRecorded.current) {
      visitRecorded.current = true;
      const visited = sessionStorage.getItem("visited");
      if (!visited) {
        sessionStorage.setItem("visited", "true");
        mutateRef.current();
      }
    }
  }, [actor]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar onAdminClick={onNavigateAdmin} />
      <main>
        <HeroSection />
        <StatsBar />
        <ProjectsSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer onAdminClick={onNavigateAdmin} />
    </div>
  );
}
