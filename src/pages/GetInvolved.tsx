import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Handshake, Megaphone, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const involvementOptions = [
  {
    icon: Users,
    title: "Volunteer",
    description: "Contribute your time and skills to support our community programs and initiatives.",
    color: "bg-primary",
  },
  {
    icon: Heart,
    title: "Become a Member",
    description: "Join our coalition and be part of a network dedicated to community transformation.",
    color: "bg-accent",
  },
  {
    icon: Handshake,
    title: "Partnership Opportunities",
    description: "Explore collaboration opportunities for organizations and institutions.",
    color: "bg-secondary",
  },
  {
    icon: Megaphone,
    title: "Advocacy Actions",
    description: "Amplify community voices and advocate for policies that support resilient communities.",
    color: "bg-primary",
  },
];

const areasOfInterest = [
  "Drug Abuse Prevention",
  "Women & Youth Empowerment",
  "Food Security & Nutrition",
  "Education & Child Protection",
  "Health & WASH",
  "Environment & Climate",
  "GEDSI",
  "Governance & Human Rights",
  "General Support",
];

export default function GetInvolved() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    skills: "",
    experience: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/submit/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: "Thank you for your interest!",
          description: "We'll be in touch soon to discuss how you can get involved.",
        });
        setFormData({ name: "", email: "", phone: "", area: "", skills: "", experience: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get <span className="gradient-text">Involved</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us in building resilient communities and transforming futures across Sierra Leone
            </p>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Ways to Get Involved"
            subtitle="Choose how you'd like to contribute to our mission"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {involvementOptions.map((option, index) => (
              <Card
                key={index}
                className="card-hover border-none shadow-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-2xl ${option.color} text-primary-foreground mb-4`}>
                    <option.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Form */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <SectionHeader
              title="Volunteer Application"
              subtitle="Fill out this form to express your interest in volunteering"
            />

            <Card className="border-none shadow-card">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+232 XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Area of Interest *</Label>
                      <Select
                        value={formData.area}
                        onValueChange={(value) => setFormData({ ...formData, area: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areasOfInterest.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills & Expertise</Label>
                    <Input
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g., Teaching, Healthcare, IT, Project Management"
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Previous Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Share any relevant volunteer or work experience..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Why do you want to volunteer?</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your motivation and what you hope to contribute..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="section-padding bg-accent text-accent-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Make a Difference Today
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Your donation helps fund programs that transform lives and create lasting
            impact in communities across Sierra Leone.
          </p>
          <Link to="/donate">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
              <Heart className="h-5 w-5" />
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
