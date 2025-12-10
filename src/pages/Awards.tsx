import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Award, Trophy, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

interface AwardItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export default function Awards() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    fetchAwards();
    fetchCertificates();
  }, []);

  const noAwards = awards.length === 0 && certificates.length === 0;

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Awards & Recognition"
            subtitle="Celebrating our achievements and the recognition of our community impact"
          />
          {noAwards ? (
            <div className="text-center py-24">
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 mt-8">No Awards & Recognition</h2>
              <p className="mb-8 text-muted-foreground">There are currently no awards, recognition, or certificates to display. Please check back soon.</p>
            </div>
          ) : (
            <>
              {/* Awards Section */}
              {awards.length > 0 && (
                <>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 mt-8">Our Journey of Recognition</h2>
                  <p className="mb-8 text-muted-foreground">Milestones in our commitment to community transformation</p>
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {awards.map((award) => (
                      <div key={award.id} className="bg-card rounded-xl shadow-card p-6 flex gap-4 items-center animate-fade-up">
                        <div className="flex-shrink-0">
                          <Trophy className="h-10 w-10 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{award.title}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{award.description}</p>
                          <div className="text-xs text-muted-foreground">{new Date(award.date).toLocaleDateString()}</div>
                        </div>
                        {award.image && (
                          <img
                            src={getImageUrl(award.image)}
                            alt={award.title}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer border"
                            onClick={() => setLightboxImage({ src: getImageUrl(award.image), alt: award.title })}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Certificates Section */}
              {certificates.length > 0 && (
                <>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 mt-8">Certificates & Achievements</h2>
                  <p className="mb-8 text-muted-foreground">Documentation of our recognized contributions</p>
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="bg-card rounded-xl shadow-card p-6 flex gap-4 items-center animate-fade-up">
                        <div className="flex-shrink-0">
                          <Award className="h-10 w-10 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{cert.description}</p>
                          <div className="text-xs text-muted-foreground">{new Date(cert.date).toLocaleDateString()}</div>
                        </div>
                        {cert.image && (
                          <img
                            src={getImageUrl(cert.image)}
                            alt={cert.title}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer border"
                            onClick={() => setLightboxImage({ src: getImageUrl(cert.image), alt: cert.title })}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
      {lightboxImage && (
        <ImageLightbox src={lightboxImage.src} alt={lightboxImage.alt} onClose={() => setLightboxImage(null)} />
      )}
    </Layout>
  );
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"} pl-20 md:pl-0`}>
                    <div className="bg-card rounded-2xl p-6 shadow-card">
                      <span className="inline-block px-3 py-1 text-sm font-medium text-primary-foreground bg-primary rounded-full mb-3">
                        {new Date(award.date).getFullYear()}
                      </span>
                      {award.image && (
                        <img 
                          src={getImageUrl(award.image)} 
                          alt={award.title}
                          className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setLightboxImage({ src: getImageUrl(award.image), alt: award.title })}
                        />
                      )}
                      <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                        {award.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">{award.description}</p>
                      <p className="text-sm text-primary font-medium">{award.date}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg z-10">
                    <Trophy className="h-5 w-5 text-primary-foreground" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <SectionHeader
            title="Certificates & Achievements"
            subtitle="Documentation of our recognized contributions"
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {certificates.length > 0 ? (
              certificates.map((cert, i) => (
                <div
                  key={cert.id}
                  className="bg-card rounded-2xl p-8 shadow-card text-center animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img 
                    src={getImageUrl(cert.image)} 
                    alt={cert.title}
                    className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage({ src: getImageUrl(cert.image), alt: cert.title })}
                  />
                  <h3 className="font-semibold text-foreground mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{cert.description}</p>
                  <p className="text-xs text-muted-foreground/60">{cert.date}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground py-8">
                No certificates uploaded yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recognition CTA */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Every Recognition Fuels Our Mission
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
            These awards reflect the dedication of our team, partners, and the communities
            we serve. Together, we continue building resilient futures.
          </p>
        </div>
      </section>
    </Layout>
  );
}
