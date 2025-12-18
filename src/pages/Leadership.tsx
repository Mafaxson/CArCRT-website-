
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ImageLightbox";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

interface InternGroup {
  id: string;
  name: string;
  community: string;
  bio: string;
  photo?: string;
}

interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

interface Coordinator {
  id: string;
  name: string;
  region: string;
  bio: string;
  photo?: string;
}

interface Intern {
  id: string;
  name: string;
  community: string;
  bio: string;
  photo?: string;
}

export default function Leadership() {
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipMember[]>([]);
  const [fieldCoordinators, setFieldCoordinators] = useState<Coordinator[]>([]);
  const [internGroups, setInternGroups] = useState<InternGroup[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all leadership data from Supabase
        const { data, error } = await supabase.from('leadership').select('*');
        if (error) throw error;
        // Leadership team
        const leadership = (data || []).filter((m: any) => m.category === 'Leadership');
        // Coordinators
        const coordinators = (data || []).filter((m: any) => m.category === 'Coordinator').map((c: any) => ({
          ...c,
          region: c.region || c.role || '',
        }));
        // Intern Groups
        const internGroups = (data || []).filter((m: any) => m.category === 'Intern Group');
        setLeadershipTeam(leadership);
        setFieldCoordinators(coordinators);
        setInternGroups(internGroups);
      } catch (error) {
        console.error('Failed to fetch leadership/intern group data from Supabase:', error);
      }
    };
    fetchData();
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
              Our <span className="gradient-text">Leadership</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Meet the dedicated team driving community transformation across Sierra Leone
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Leadership Team"
            subtitle="Our core team bringing expertise and passion to community development"
          />

          {leadershipTeam.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No leadership team data found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadershipTeam.map((member, index) => (
                <Card
                  key={member.id}
                  className="card-hover border-none shadow-card animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    {member.photo ? (
                      <img
                        src={getImageUrl(member.photo)}
                        alt={member.name}
                        className="w-24 h-24 mx-auto mb-4 rounded-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setLightboxImage({ src: getImageUrl(member.photo!), alt: member.name })}
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-primary-foreground" />
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Meet Our Team"
            subtitle="Dedicated coordinators working across regions to drive community transformation"
          />

          {fieldCoordinators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No coordinators found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fieldCoordinators.map((coordinator, index) => (
                <Card
                  key={coordinator.id}
                  className="card-hover border-none shadow-card animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    {coordinator.photo ? (
                      <img
                        src={getImageUrl(coordinator.photo)}
                        alt={coordinator.name}
                        className="w-16 h-16 mx-auto mb-4 rounded-full object-cover object-center cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setLightboxImage({ src: getImageUrl(coordinator.photo!), alt: coordinator.name })}
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-accent" />
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {coordinator.name}
                    </h3>
                    <p className="text-accent font-medium text-sm mb-2">{coordinator.region}</p>
                    {coordinator.bio && (
                      <p className="text-muted-foreground text-sm">{coordinator.bio}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Internship Section - All Groups */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <SectionHeader
            title="Internship"
            subtitle="CArCRT Internship Cohorts by Year"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            {internGroups.length === 0 ? (
              <div className="text-center text-muted-foreground col-span-2">No intern groups found.</div>
            ) : (
              internGroups.map((group) => (
                <div key={group.id} className="flex flex-col items-center justify-center">
                  {group.photo && (
                    <img
                      src={group.photo}
                      alt={group.name}
                      className="w-full max-w-xl rounded shadow mb-4"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <p className="text-center text-lg font-semibold text-primary mt-2">{group.name}</p>
                  <p className="text-center text-sm text-muted-foreground mt-1 max-w-2xl">{group.bio}</p>
                  {group.community && (
                    <p className="text-center text-xs text-muted-foreground mt-1 max-w-2xl">{group.community}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals to join our mission.
            Check our opportunities or volunteer to make a difference.
          </p>
          <Link to="/get-involved">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Apply for Internship
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
