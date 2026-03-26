import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Loader2, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitContact } from "../hooks/useQueries";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const submitContact = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await submitContact.mutateAsync(form);
      toast.success("Message sent! I'll get back to you soon.");
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@yourname.dev" },
    { icon: MapPin, label: "Location", value: "Remote — Worldwide" },
    { icon: Clock, label: "Response Time", value: "Within 24 hours" },
  ];

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a project in mind? Let's discuss how we can bring your vision
            to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-6 animate-fade-up">
            <div className="glass rounded-2xl p-8">
              <h3 className="font-display text-2xl font-bold mb-6">
                Ready to build something great?
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                I'm currently accepting new projects. Whether you need a
                full-stack web app, a redesign, or a blockchain integration —
                let's talk.
              </p>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{ background: "oklch(0.65 0.25 280 / 0.15)" }}
                    >
                      <info.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {info.label}
                      </p>
                      <p className="text-sm font-medium">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-fade-up-delay-1">
            {submitted ? (
              <div
                className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]"
                data-ocid="contact.success_state"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.65 0.25 280 / 0.2)" }}
                >
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for reaching out. I'll respond within 24 hours.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSubmitted(false)}
                  className="btn-outline-primary"
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-8 space-y-5"
                data-ocid="contact.form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground/80">Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="John Doe"
                      data-ocid="contact.name.input"
                      className="glass border-border/50 bg-transparent text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground/80">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                      data-ocid="contact.email.input"
                      className="glass border-border/50 bg-transparent text-foreground"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Message</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell me about your project..."
                    data-ocid="contact.message.textarea"
                    className="glass border-border/50 bg-transparent text-foreground min-h-[150px]"
                  />
                </div>
                {submitContact.isError && (
                  <p
                    className="text-destructive text-sm"
                    data-ocid="contact.error_state"
                  >
                    Failed to send. Please try again.
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={submitContact.isPending}
                  data-ocid="contact.submit_button"
                  className="btn-primary w-full py-3 gap-2"
                >
                  {submitContact.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
