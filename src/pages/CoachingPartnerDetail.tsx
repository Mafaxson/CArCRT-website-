import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Users, Target } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

export default function CoachingPartnerDetail() {
  const { slug } = useParams();
  const [partner, setPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    // Hardcoded affiliate partner data
    const affiliatePartner = {
      id: "cp-1",
      name: "Restoring AgriSolution Enterprises",
      slug: "restoring-agrisolution-enterprises",
      description: "Restoring AgriSolution Enterprises is a social-impact agribusiness dedicated to transforming agriculture and empowering communities in Sierra Leone. Through innovative farming practices, training programs, and market linkages, we work to improve food security, create sustainable livelihoods, and restore hope in rural communities.\n\nOur approach combines modern agricultural techniques with traditional knowledge, ensuring that farming is not only productive but also environmentally sustainable. We focus on empowering youth and women, providing them with the skills and resources needed to become successful agripreneurs.\n\nBy partnering with local communities and organizations like CArCRT, we are building a future where agriculture serves as a pathway out of poverty and a foundation for lasting community development.",
      website: "",
      focus: "Agriculture, Food Security, Youth & Women Empowerment",
      established: "2021",
      location: "Nongowa Chiefdom, Sierra Leone",
      mission: "To nurture hope, restore dignity, and empower communities through sustainable agriculture and inclusive development that transforms lives and builds resilient futures.",
      logo: "/uploads/1764943938537-WhatsApp Image 2025-12-05 at 13.55.47_0022de53.jpg",
      team: []
    };

    if (slug === "restoring-agrisolution-enterprises") {
      setPartner(affiliatePartner);
      fetchGallery();
    }
    setLoading(false);
  }, [slug]);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching gallery:", error);
      } else if (data) {
        setGallery(data);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-padding flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!partner) {
    return (
      <Layout>
        <div className="section-padding flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Organization Not Found</h1>
          <Link to="/partners">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

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
      <section className="relative py-16 bg-gradient-hero">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {partner.logo && (
              <div className="w-48 h-48 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6">
                <img
                  src={partner.logo.startsWith('http') ? partner.logo : getImageUrl(partner.logo)}
                  alt={partner.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                {partner.name}
              </h1>
              {partner.focus && (
                <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full mb-4">
                  {partner.focus}
                </span>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {partner.established && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Established {partner.established}</span>
                  </div>
                )}
                {partner.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{partner.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title="About the Organization"
              subtitle="Our mission and approach to community transformation"
            />
            
            <Card className="border-none shadow-card mb-8">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {partner.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {partner.mission && (
              <Card className="border-none shadow-card mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <Target className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading text-xl font-bold mb-3">Mission</h3>
                      <p className="text-muted-foreground leading-relaxed">{partner.mission}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <SectionHeader
            title="Our Work in Action"
            subtitle="See the impact we're making in communities"
          />
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gallery && gallery.length > 0 ? (
              gallery.map((photo: any, index: number) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                  onClick={() => setLightboxImage({ 
                    src: photo.image.startsWith('http') ? photo.image : getImageUrl(photo.image), 
                    alt: photo.title || 'Gallery Photo' 
                  })}
                >
                  <img
                    src={photo.image.startsWith('http') ? photo.image : getImageUrl(photo.image)}
                    alt={photo.caption || `Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                <p>No photos available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Website Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {partner.website && (
              <div className="text-center">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Button size="lg" className="gap-2">
                    Visit Official Website
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section (if team members exist) */}
      {partner.team && partner.team.length > 0 && (
        <section className="section-padding bg-muted">
          <div className="container-custom">
            <SectionHeader
              title="Our Team"
              subtitle="Meet the people driving this organization forward"
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              {partner.team.map((member: any, index: number) => (
                <Card key={index} className="border-none shadow-card">
                  <CardContent className="p-6 text-center">
                    {member.photo ? (
                      <img
                        src={member.photo?.startsWith('http') ? member.photo : getImageUrl(member.photo)}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-16 w-16 text-primary" />
                      </div>
                    )}
                    <h3 className="font-heading font-bold text-lg">{member.name}</h3>
                    {member.role && (
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Support This Work
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Help us empower organizations like {partner.name} to create lasting impact in their communities.
          </p>
          <Link to="/donate">
            <Button size="lg" variant="secondary" className="gap-2">
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
