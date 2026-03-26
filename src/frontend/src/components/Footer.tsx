import { SiDribbble, SiGithub, SiLinkedin, SiX } from "react-icons/si";

interface FooterProps {
  onAdminClick: () => void;
}

const socialLinks = [
  { icon: SiGithub, href: "#", label: "GitHub" },
  { icon: SiLinkedin, href: "#", label: "LinkedIn" },
  { icon: SiX, href: "#", label: "X (Twitter)" },
  { icon: SiDribbble, href: "#", label: "Dribbble" },
];

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ onAdminClick }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      className="border-t border-border/30"
      style={{ background: "oklch(0.08 0.02 265)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl font-bold gradient-text mb-3">
              YourName.
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting digital experiences that inspire and perform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground/50 mb-4">
              Navigation
            </h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid={`footer.${link.label.toLowerCase()}.link`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-foreground/50 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  data-ocid={`footer.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <button
            type="button"
            onClick={onAdminClick}
            data-ocid="footer.admin.button"
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
