import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { ImageLightbox } from "@/components/ImageLightbox";
import {
  Shield,
  Users,
  Sprout,
  GraduationCap,
  Droplets,
  Leaf,
  Heart,
  Scale,
  Target,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";



const iconMap = {
  Target,
  Shield,
  Users,
  Sprout,
  GraduationCap,
  Droplets,
  Leaf,
  Heart,
  Scale,
};

export default function Programs() {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const { data } = await supabase.from("programs").select("*");
      setPrograms(data || []);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  return (
    <Layout>
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="gradient-text">Programs & Initiatives</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive programs addressing diverse community needs across Sierra Leone
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">Loading programs...</div>
          ) : (
            <div className="space-y-12">
              {programs.map((program, index) => {
                const Icon = iconMap[program.icon as keyof typeof iconMap] || Target;
                let details: string[] = [];
                try {
                  details = typeof program.details === 'string' ? JSON.parse(program.details) : program.details;
                } catch {
                  details = [];
                }
                return (
                  <Card
                    key={program.id || index}
                    className="overflow-hidden border-none shadow-card animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[2fr,3fr]">
                        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center">
                          {program.image ? (
                            <img
                              src={program.image}
                              alt={program.title}
                              className="w-full h-56 rounded-lg mb-6 object-cover shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setLightboxImage({ src: program.image, alt: program.title })}
                            />
                          ) : (
                            <div className={`${program.color || 'bg-secondary'} p-8 rounded-full mb-6`}>
                              <Icon className="h-16 w-16 text-primary-foreground" />
                            </div>
                          )}
                          <h3 className="font-heading text-lg font-bold text-center text-foreground px-4">{program.title}</h3>
                        </div>
                        <div className="md:col-span-1 p-8">
                          <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                          <h4 className="font-heading font-semibold text-foreground mb-4">Key Activities:</h4>
                          <ul className="grid sm:grid-cols-2 gap-3">
                            {details && details.map((detail: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className={`w-2 h-2 rounded-full ${program.color || 'bg-secondary'} mt-1.5 flex-shrink-0`} />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Impact CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            See Our Impact in Action
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Discover how our programs are transforming lives and communities across Sierra Leone
            through real stories of change.
          </p>
        </div>
      </section>
    </Layout>
  );
}
