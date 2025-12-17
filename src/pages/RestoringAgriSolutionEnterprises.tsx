import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RestoringAgriSolutionEnterprises() {
  const [restoringAgri, setRestoringAgri] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    // Fetch Restoring AgriSolution Enterprise info (still from static for now)
    fetch('/data/coaching-partners.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setRestoringAgri(data[0]);
      });
    // Fetch gallery images from Supabase
    const fetchGallery = async () => {
      const { data } = await supabase.from("gallery").select("*");
      setGallery(data || []);
    };
    fetchGallery();
  }, []);

  if (!restoringAgri) return null;

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={restoringAgri.logo}
              alt={restoringAgri.name + ' logo'}
              className="w-36 h-36 object-cover rounded-full border-4 border-blue-200 shadow-lg mb-4"
            />
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
              ABOUT RESTORING AGRISOLUTION ENTERPRISE
            </h1>
            <Badge className="mb-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">Affiliate Partner</Badge>
            <div className="text-base text-muted-foreground mb-2 font-medium">
              Community-based organization we're supporting to drive transformation
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
            <p className="mb-4 text-lg leading-relaxed text-gray-800">{restoringAgri.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 justify-items-center">
              <div><span className="font-semibold">Focus:</span> {restoringAgri.focus}</div>
              <div><span className="font-semibold">Established:</span> {restoringAgri.established}</div>
              <div><span className="font-semibold">Location:</span> {restoringAgri.location}</div>
            </div>
            <div className="mt-6">
              <div className="font-semibold text-lg mb-1 text-center">Mission:</div>
              <div className="italic text-center text-gray-800">{restoringAgri.mission}</div>
            </div>
          </div>
          <SectionHeader
            title="Our Work in Action"
            subtitle="Gallery of our community impact"
          />
          {gallery && gallery.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {gallery.map((item: any) => (
                <Card key={item.id} className="card-hover border-none shadow-card animate-fade-up overflow-hidden">
                  <CardContent className="flex flex-col items-center p-4">
                    <img
                      src={item.image_url || item.image}
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
