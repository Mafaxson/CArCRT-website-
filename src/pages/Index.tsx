import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Heart, Users, Target, Sprout, GraduationCap, Droplets, Leaf, Scale, Shield, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import teamPhoto from "@/assets/team-photo.jpg";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

const focusAreas = [{
  icon: Shield,
  title: "Drug Abuse Prevention & Community Resilience",
  color: "bg-carcrt-light-blue text-primary"
}, {
  icon: Users,
  title: "Women and Youth Empowerment",
  color: "bg-carcrt-light-pink text-accent"
}, {
  icon: Sprout,
  title: "Food Security & Nutrition",
  color: "bg-carcrt-light-gold text-secondary"
}, {
  icon: GraduationCap,
  title: "Education & Child Protection Advocacy",
  color: "bg-carcrt-light-blue text-primary"
}, {
  icon: Droplets,
  title: "Integrated Health, WASH",
  color: "bg-carcrt-light-pink text-accent"
}, {
  icon: Leaf,
  title: "Environment & Climate Change",
  color: "bg-carcrt-light-gold text-secondary"
}, {
  icon: Heart,
  title: "GEDSI",
  color: "bg-carcrt-light-blue text-primary"
}, {
  icon: Scale,
  title: "Governance, Human Rights & Accountability",
  color: "bg-carcrt-light-pink text-accent"
}, {
  icon: Target,
  title: "Child Sponsorship Program",
  color: "bg-carcrt-light-gold text-secondary"
}];

export default function Index() {
  const [currentPartner, setCurrentPartner] = useState(0);
  const [partners, setPartners] = useState<any[]>([]);
  const [featuredStories, setFeaturedStories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    membersReached: "15,000+",
    projectsImplemented: "15",
    districtsEngaged: "5"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch partners and sponsors from Supabase
        const { data: partnersData, error } = await supabase
          .from('partners')
          .select('*')
          .order('created_at', { ascending: true });
        if (error || !partnersData || partnersData.length === 0) {
          // Fallback to local JSON if Supabase is empty or errors
          fetch('/data/partners.json')
            .then((res) => res.json())
            .then((json) => {
              setPartners(json.filter(p => p.type === 'Partner' || p.type === 'Sponsor'));
            })
            .catch((err) => {
              console.error('Error loading partners.json:', err);
              setPartners([]);
            });
        } else {
          setPartners(partnersData.filter(p => p.type === 'Partner' || p.type === 'Sponsor'));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      setCurrentPartner(prev => (prev + 1) % Math.max(partners.length, 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [partners.length]);
  return <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-hero overflow-hidden py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 sm:w-72 sm:h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-56 h-56 sm:w-96 sm:h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-fade-up">
              <h1 className="font-heading text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight text-left sm:text-left">
                Building Resilient Communities,{" "}
                <span className="gradient-text">Transforming Futures</span>
              </h1>
              <p className="text-base xs:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl text-left">
                CArCRT is a community rooted and nationally engaged non-profit organization
                dedicated to building resilient, inclusive, and empowered communities we work.
              </p>
              {/* Mobile-only CTA buttons */}
              <div className="flex flex-col gap-3 w-full max-w-xs justify-center items-center mx-auto sm:hidden">
                <Link to="/programs" className="w-full">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 gap-2">
                    Explore Our Programs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/get-involved" className="w-full">
                  <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Get Involved
                  </Button>
                </Link>
                <Link to="/donate" className="w-full">
                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90 gap-2">
                    <Heart className="h-4 w-4" />
                    Donate Now
                  </Button>
                </Link>
              </div>
              {/* Desktop/Tablet CTA buttons (hidden on mobile) */}
              <div className="hidden sm:flex flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center items-center sm:items-stretch mx-auto">
                <Link to="/programs" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 gap-2">
                    Explore Our Programs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/get-involved" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Get Involved
                  </Button>
                </Link>
                <Link to="/donate" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 gap-2">
                    <Heart className="h-4 w-4" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center animate-fade-up delay-200">
              <img src={teamPhoto} alt="CArCRT Team" className="w-full h-auto max-w-2xl object-contain animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-primary-foreground animate-fade-up">
              <p className="font-heading text-4xl md:text-5xl font-bold mb-2">{stats.membersReached}</p>
              <p className="text-primary-foreground/80">Community Members Reached</p>
            </div>
            <div className="text-center text-primary-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
              <p className="font-heading text-4xl md:text-5xl font-bold mb-2">{stats.projectsImplemented}</p>
              <p className="text-primary-foreground/80">Projects Implemented</p>
            </div>
            <div className="text-center text-primary-foreground animate-fade-up" style={{ animationDelay: "200ms" }}>
              <p className="font-heading text-4xl md:text-5xl font-bold mb-2">{stats.districtsEngaged}</p>
              <p className="text-primary-foreground/80">Districts Engaged</p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader title="Our Thematic Focus Areas" subtitle="We work across multiple sectors to create lasting, positive change in communities" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area, index) => <Card key={index} className="card-hover border-none shadow-card animate-fade-up" style={{
            animationDelay: `${index * 50}ms`
          }}>
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-2xl ${area.color} mb-4`}>
                    <area.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">{area.title}</h3>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-10">
            <Link to="/programs">
              <Button size="lg" variant="outline" className="gap-2">
                View All Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Empowering Communities Across Sierra Leone
              </h2>
              <p className="text-muted-foreground mb-6">
                CArCRT is a community-rooted and nationally engaged non-profit organization
                headquartered in Kenema, Eastern Province, Sierra Leone. We are committed to
                building resilient, inclusive, and empowered communities through strategic
                interventions and multisectoral collaboration.
              </p>
              <p className="text-muted-foreground mb-8">
                Since our establishment, we have grown into a respected national coalition working
                with civil society, local leaders, development partners, and grassroots communities.
              </p>
              <Link to="/about">
                <Button className="gap-2">
                  Learn More About Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <Target className="h-10 w-10 mb-4" />
                <h3 className="font-heading font-semibold text-xl mb-2">Our Mission</h3>
                <p className="text-sm text-primary-foreground/80">
                  Empowering communities to thrive in the face of change
                </p>
              </div>
              <div className="bg-secondary rounded-2xl p-6 text-secondary-foreground">
                <Heart className="h-10 w-10 mb-4" />
                <h3 className="font-heading font-semibold text-xl mb-2">Our Vision</h3>
                <p className="text-sm text-secondary-foreground/80">
                  Building resilient communities, transforming futures
                </p>
              </div>
              <div className="col-span-2 bg-accent rounded-2xl p-6 text-accent-foreground">
                <Users className="h-10 w-10 mb-4" />
                <h3 className="font-heading font-semibold text-xl mb-2">Our Values</h3>
                <p className="text-sm text-accent-foreground/80">
                  Equity, Collaboration, Resilience, Innovation, Integrity, Sustainability, Empowerment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader title="Our Partners" subtitle="Working together with organizations committed to community development" />

          {partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No partners added yet</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center gap-4">
                {partners.length > 3 && (
                  <button onClick={() => setCurrentPartner(prev => (prev - 1 + partners.length) % partners.length)} className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-center gap-8 py-8">
                    {partners.length <= 3 ? (
                      partners.map((partner, index) => (
                        <div key={partner.id} className="flex-shrink-0 w-48 h-24 bg-card rounded-xl flex items-center justify-center shadow-card border">
                          {partner.logo ? (
                            <img 
                              src={partner.logo.startsWith('http') ? partner.logo : getImageUrl(partner.logo)} 
                              alt={partner.name}
                              className="max-w-full max-h-full object-contain p-4"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
                              <span className="text-xs text-muted-foreground text-center">No Logo</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      [0, 1, 2].map(offset => {
                        const index = (currentPartner + offset) % partners.length;
                        const partner = partners[index];
                        return (
                          <div key={index} className="flex-shrink-0 w-48 h-24 bg-card rounded-xl flex items-center justify-center shadow-card transition-all duration-300 border">
                            {partner?.logo ? (
                              <img 
                                src={partner.logo.startsWith('http') ? partner.logo : getImageUrl(partner.logo)} 
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain p-4"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
                                <span className="text-xs text-muted-foreground text-center">No Logo</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {partners.length > 3 && (
                  <button onClick={() => setCurrentPartner(prev => (prev + 1) % partners.length)} className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ChevronRight className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/partners">
              <Button variant="outline" className="gap-2">
                View All Partners
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Join Us in Shaping Resilient, Empowered Communities
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Together, we can create lasting change and build a brighter future for communities
            across Sierra Leone.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-involved">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                Get Involved
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:text-primary gap-2 bg-destructive">
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>;
}