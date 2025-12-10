import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Handshake, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/data/partners.json')
      .then((res) => res.json())
      .then((data) => {
        setPartners(data.filter(p => p.type === 'Partner' || p.type === 'Sponsor'));
        setAffiliates(data.filter(p => p.type === 'Affiliate'));
      })
      .catch((err) => console.error('Error loading partners.json:', err));
    fetch('/data/gallery.json')
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error('Error loading gallery.json:', err));
  }, []);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Partners & <span className="gradient-text">Sponsors</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Working together with organizations committed to community transformation
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Our Partners"
            subtitle="Organizations we collaborate with to achieve our mission"
          />
          {partners && partners.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {partners.filter(p => p.type === 'Partner').map((partner) => (
                <Card key={partner.id} className="card-hover border-none shadow-card animate-fade-up overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-6">
                    <img
                      src={partner.logo}
                      alt={partner.name + ' logo'}
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{partner.name}</h3>
                      {partner.website && partner.website !== 'No website' && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm flex items-center gap-1">
                          Website <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No partners added yet. Please check back soon.</p>
          )}
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Our Sponsors"
            subtitle="Organizations providing financial support for our programs"
          />
          {partners && partners.filter(p => p.type === 'Sponsor').length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {partners.filter(p => p.type === 'Sponsor').map((sponsor) => (
                <Card key={sponsor.id} className="card-hover border-none shadow-card animate-fade-up overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-6">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name + ' logo'}
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{sponsor.name}</h3>
                      {sponsor.website && sponsor.website !== 'no sit' && (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm flex items-center gap-1">
                          Website <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No sponsors added yet. Please check back soon.</p>
          )}
        </div>
      </section>

      {/* Affiliate Partners Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Affiliate Partners"
            subtitle="Organizations affiliated with our mission"
          />
          {affiliates && affiliates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {affiliates.map((affiliate) => (
                <Card key={affiliate.id} className="card-hover border-none shadow-card animate-fade-up overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-6">
                    <img
                      src={affiliate.logo}
                      alt={affiliate.name + ' logo'}
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{affiliate.name}</h3>
                      {affiliate.website && (
                        <a href={affiliate.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm flex items-center gap-1">
                          Website <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No affiliate partners added yet. Please check back soon.</p>
          )}
        </div>
      </section>

      {/* Our Work in Action Gallery */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Our Work in Action"
            subtitle="Gallery of our community impact"
          />
          {gallery && gallery.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {gallery.map((item) => (
                <Card key={item.id} className="card-hover border-none shadow-card animate-fade-up overflow-hidden">
                  <CardContent className="flex flex-col items-center p-4">
                    <img
                      src={item.image}
                      alt={item.caption || 'Gallery image'}
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                    {item.caption && <div className="text-center text-sm text-muted-foreground">{item.caption}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No gallery images yet. Please check back soon.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}
