import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

export default function CoachingPartners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setPartners(data);
      if (error) console.error('Error fetching coaching partners:', error);
    };
    fetchPartners();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Organizations We <span className="gradient-text">Coach</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Supporting grassroots organizations across Sierra Leone through capacity building,
              technical support, and strategic guidance for sustainable community impact.
            </p>
          </div>
        </div>
      </section>

      {/* Coaching Partners Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Our Coaching Partners"
            subtitle="Local organizations we're empowering to drive community transformation"
          />

          {partners.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No coaching partners listed yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {partners.map((partner, index) => (
                <Card
                  key={partner.id}
                  className="card-hover border-none shadow-card animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6 mb-4">
                      {partner.logo ? (
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                          <img
                            src={partner.logo?.startsWith('http') ? partner.logo : getImageUrl(partner.logo)}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-xl flex items-center justify-center">
                          <Briefcase className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-xl text-foreground mb-1">
                          {partner.name}
                        </h3>
                        {partner.focus && (
                          <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {partner.focus}
                          </span>
                        )}
                        {partner.established && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Established: {partner.established}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {partner.description.substring(0, 200)}...
                    </p>

                    <div className="flex items-center gap-3">
                      <Link to={`/coaching-partners/${partner.slug}`}>
                        <Button variant="default" size="sm" className="gap-2">
                          View Details
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                      
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            Website
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Need Organizational Support?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            If your organization is working to create positive change in Sierra Leone and
            could benefit from capacity building support, we'd love to hear from you.
          </p>
        </div>
      </section>
    </Layout>
  );
}
