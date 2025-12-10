import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function RestoringAgriSolutionEnterprises() {
  const [restoringAgri, setRestoringAgri] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch('/data/coaching-partners.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setRestoringAgri(data[0]);
      });
    fetch('/data/gallery.json')
      .then((res) => res.json())
      .then((data) => setGallery(data));
  }, []);

  if (!restoringAgri) return null;

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title={restoringAgri.name}
            subtitle="Community-based organization we're supporting to drive transformation"
          />
          <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <img
              src={restoringAgri.logo}
              alt={restoringAgri.name + ' logo'}
              className="w-32 h-32 object-cover rounded-full border mb-4 md:mb-0"
            />
            <div className="flex-1">
              <div className="inline-block px-3 py-1 mb-2 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Affiliate Partner</div>
              <p className="mb-2 text-muted-foreground">{restoringAgri.description}</p>
              <div className="text-sm text-muted-foreground mb-1"><b>Focus:</b> {restoringAgri.focus}</div>
              <div className="text-sm text-muted-foreground mb-1"><b>Established:</b> {restoringAgri.established}</div>
              <div className="text-sm text-muted-foreground mb-1"><b>Location:</b> {restoringAgri.location}</div>
              <div className="text-sm text-muted-foreground mb-1"><b>Mission:</b> {restoringAgri.mission}</div>
            </div>
          </div>
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
