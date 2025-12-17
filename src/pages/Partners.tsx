import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Handshake, ArrowRight, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";
import { useNavigate } from "react-router-dom";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [restoringAgri, setRestoringAgri] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Show local JSON immediately
    fetch('/data/partners.json')
      .then((res) => res.json())
      .then((json) => {
        setPartners(json.filter(p => p.type === 'Partner' || p.type === 'Sponsor'));
      })
      .catch((err) => {
        console.error('Error loading partners.json:', err);
        setPartners([]);
      });

    // 2. Fetch from Supabase in background and update if available
    const fetchPartners = async () => {
      const { data, error } = await supabase.from('partners').select('*');
      if (!error && data && data.length > 0) {
        setPartners(data.filter(p => p.type === 'Partner' || p.type === 'Sponsor'));
      }
    };
    fetchPartners();

    // Fetch gallery from local JSON (can be migrated to Supabase if needed)
    fetch('/data/gallery.json')
      .then((res) => res.json())
      .then((data) => setGallery(data))
      .catch((err) => console.error('Error loading gallery.json:', err));
    // Fetch affiliate/Restoring AgriSolution from local JSON (can be migrated to Supabase if needed)
    fetch('/data/coaching-partners.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setRestoringAgri(data[0]);
      })
      .catch((err) => console.error('Error loading coaching-partners.json:', err));
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

      {/* Restoring AgriSolution Enterprises Section (Affiliate Partner) */}
      {restoringAgri && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <SectionHeader
              title={restoringAgri.name}
              subtitle="Community-based organization we're supporting to drive transformation"
            />
            <div className="flex flex-col md:flex-row gap-8 items-center mb-4">
              {restoringAgri.logo ? (
                <img
                  src={restoringAgri.logo.startsWith('http') ? restoringAgri.logo : getImageUrl(restoringAgri.logo)}
                  alt={restoringAgri.name + ' logo'}
                  className="w-32 h-32 object-cover rounded-full border mb-4 md:mb-0"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-muted rounded-full border mb-4 md:mb-0">
                  <span className="text-xs text-muted-foreground text-center">No Logo</span>
                </div>
              )}
              <div className="flex-1">
                <div className="inline-block px-3 py-1 mb-2 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Affiliate Partner</div>
                <p className="mb-2 text-muted-foreground line-clamp-4">{restoringAgri.description}</p>
                <div className="text-sm text-muted-foreground mb-1"><b>Focus:</b> {restoringAgri.focus}</div>
                <Button className="mt-3" onClick={() => navigate('/partners/restoring-agrisolution-enterprises')}>View Details</Button>
              </div>
            </div>
          </div>
        </section>
      )}

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
                    {partner.logo ? (
                      <img
                        src={partner.logo.startsWith('http') ? partner.logo : getImageUrl(partner.logo)}
                        alt={partner.name + ' logo'}
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full border">
                        <span className="text-xs text-muted-foreground text-center">No Logo</span>
                      </div>
                    )}
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
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo.startsWith('http') ? sponsor.logo : getImageUrl(sponsor.logo)}
                        alt={sponsor.name + ' logo'}
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-full border">
                        <span className="text-xs text-muted-foreground text-center">No Logo</span>
                      </div>
                    )}
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
    </Layout>
  );
}
