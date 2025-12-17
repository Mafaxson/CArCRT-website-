import { useState } from "react";
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

const programs = [
  {
    icon: Target,
    title: "Child Sponsorship Program",
    description: "Our program enhances the well-being of vulnerable children by partnering with families, communities, and stakeholders to break the cycle of poverty and drive sustainable change. We are dedicated to ensuring every child has access to quality education, good health, protection, and the opportunity to thrive and actively contribute to their community.",
    details: [
      "Quality education access",
      "Healthcare and nutrition support",
      "Child protection services",
      "Family and community partnerships",
      "Sustainable development initiatives",
      "Teaching and Learning Resources",
    ],
    color: "bg-secondary",
    image: "/lovable-uploads/child-sponsorship.jpg",
  },
  {
    icon: Shield,
    title: "Drug Abuse Prevention & Community Resilience",
    description: "We implement community-based rehabilitation, awareness campaigns, and capacity-building programs to reduce drug abuse and strengthen resilience.",
    details: [
      "Community-based rehabilitation programs",
      "Awareness campaigns and education",
      "Peer support networks",
      "Spiritual & Psychosocial counseling",
      "Drug abuse prevention initiatives",
      "reintegration",
      "Skills Training",
      "Financial Inclusion",
      "Entreprenuership",
    ],
    color: "bg-primary",
    image: "/lovable-uploads/drug-abuse-image.jpg",
  },
  {
    icon: Users,
    title: "Women & Youth Empowerment",
    description: "Empowering women and youth through leadership training, skill development, livelihood support, and participation in decision-making.",
    details: [
      "Leadership training programs",
      "Vocational skill development",
      "Livelihood support and microfinance",
      "Mentorship programs",
      "Civic engagement initiatives",
      "Women's Enterprise Empowerment Circles (WEECS)",
      "Mobile Business Clinics",
      "Financial Inclusion Advocacy Labs",
      "Faith and Finance Fellowships",
    ],
    color: "bg-accent",
    image: "/lovable-uploads/women-youth.jpg",
  },
  {
    icon: Sprout,
    title: "Food Security & Nutrition",
    description: "Promoting sustainable farming practices, nutrition awareness, and community-based food resilience models.",
    details: [
      "Sustainable agriculture training",
      "Community gardens and farming",
      "Nutrition education programs",
      "Food storage and preservation",
      "Market access support",
      "Enterprenuership",
      "Financial Incltsion",
      "Agric-Entrepreneurship & Technical Supports for AgricBusiness",
    ],
    color: "bg-secondary",
    image: "/lovable-uploads/food-security.jpg",
  },
  {
    icon: GraduationCap,
    title: "Education & Child Protection",
    description: "Advocating for safe learning environments, child protection systems, and opportunities for vulnerable children.",
    details: [
      "School infrastructure support",
      "Child protection training",
      "Educational scholarships",
      "After-school programs",
      "Teaching and Coaching Programs",
      "Reading School Clubs",
      "Caregiver & Community Engagement",
      "Teacher & Coaching",
      "System Strengthening",
    ],
    color: "bg-primary",
    image: "/lovable-uploads/education-child-protection.jpg",
  },
  {
    icon: Droplets,
    title: "Integrated Health & WASH",
    description: "Improving access to healthcare services, safe water, sanitation & hygiene education.",
    details: [
      "Community health education",
      "Water point construction",
      "Sanitation facility support",
      "Hygiene promotion campaigns",
      "Health worker training",
      "School Health Clubs",
      "Social Services & Public Health",
      "Maternal Newborn Child Health Programs",
      "Health Systems Strengthening",
    ],
    color: "bg-accent",
    image: "/lovable-uploads/health-wash.jpg",
  },
  {
    icon: Leaf,
    title: "Environment & Climate Change",
    description: "Supporting climate adaptation, environmental protection, and community eco-solutions.",
    details: [
      "Climate adaptation programs",
      "Reforestation initiatives",
      "Waste management programs",
      "Environmental education",
      "Sustainable energy solutions",
      "Promote Green Energy through Enterprenuership",
    ],
    color: "bg-secondary",
    image: "/lovable-uploads/environment-climate.jpg",
  },
  {
    icon: Heart,
    title: "GEDSI (Gender Equality, Disability & Social Inclusion)",
    description: "Ensuring inclusive access, equal opportunities, and community representation for all.",
    details: [
      "Gender equality advocacy",
      "Disability inclusion programs",
      "Social inclusion initiatives",
      "Anti-discrimination campaigns",
      "Inclusive policy development",
    ],
    color: "bg-primary",
    image: "/lovable-uploads/gedsi.jpg",
  },
  {
    icon: Scale,
    title: "Governance, Human Rights & Accountability",
    description: "Strengthening community voices, transparency, and participation in governance processes.",
    details: [
      "Civic education programs",
      "Human rights awareness",
      "Community governance support",
      "Accountability mechanisms",
      "Policy advocacy",
      "Migration, Women & Child Trafficking, and Resettlement Programs",
      "Court & Prison Monitoring",
      "Dignity Support",
      "Family Tracing",
      "Safe life after prisons (structured reintegration)",
    ],
    color: "bg-accent",
    image: "/lovable-uploads/governance.jpg",
  },
];

export default function Programs() {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

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
          <div className="space-y-12">
            {programs.map((program, index) => (
              <Card
                key={index}
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
                          onClick={() => setLightboxImage({ src: program.image!, alt: program.title })}
                        />
                      ) : (
                        <div className={`${program.color} p-8 rounded-full mb-6`}>
                          <program.icon className="h-16 w-16 text-primary-foreground" />
                        </div>
                      )}
                      <h3 className="font-heading text-lg font-bold text-center text-foreground px-4">{program.title}</h3>
                    </div>
                    <div className="md:col-span-1 p-8">
                      <p className="text-muted-foreground mb-6 leading-relaxed">{program.description}</p>
                      <h4 className="font-heading font-semibold text-foreground mb-4">Key Activities:</h4>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {program.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${program.color} mt-1.5 flex-shrink-0`} />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
