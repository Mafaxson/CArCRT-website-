import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function History() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="gradient-text">History</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              The journey of CArCRT from inception to national impact
            </p>
          </div>
        </div>
      </section>

      {/* History Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none animate-fade-up">
              <div className="bg-muted rounded-3xl p-8 md:p-12 mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Our Beginning
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  CArCRT was founded to address the growing need for community resilience, inclusive
                  leadership, and sustainable development across Sierra Leone. Recognizing the complex
                  challenges facing communities—from health crises to environmental changes, from social
                  inequities to economic vulnerabilities—our founders came together with a shared vision
                  of empowering communities to lead their own transformation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Starting from our base in Kenema, Eastern Province, we began working directly with
                  local communities, listening to their needs, understanding their challenges, and
                  co-creating solutions that would have lasting impact.
                </p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-8 md:p-12 mb-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Growth & Expansion
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Since its establishment, CArCRT has grown into a respected national coalition working
                  with civil society, local leaders, development partners, and grassroots communities.
                  Our work has expanded across multiple thematic areas, reflecting the interconnected
                  nature of community challenges and the need for holistic approaches.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we operate in 15 districts across Sierra Leone, empowering thousands of
                  individuals and strengthening local systems through evidence-based programming,
                  advocacy, and community engagement.
                </p>
              </div>

              <div className="bg-secondary/10 rounded-3xl p-8 md:p-12">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Our Impact
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Through our journey, we have implemented over 50 projects, reached more than 10,000
                  community members, and built lasting partnerships with organizations that share our
                  commitment to community transformation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our approach has always centered on community ownership—ensuring that the initiatives
                  we support are led by community members themselves, creating sustainable change that
                  continues long after our direct involvement ends.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
                      {/* Removed Awards link */}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
