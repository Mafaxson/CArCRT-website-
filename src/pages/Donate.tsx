import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, Shield, Users, Sprout, GraduationCap, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

const impactAreas = [
  { icon: Shield, label: "Drug Prevention", amount: "50", impact: "Supports 5 youth in rehabilitation" },
  { icon: Users, label: "Women Empowerment", amount: "100", impact: "Trains 2 women entrepreneurs" },
  { icon: Sprout, label: "Food Security", amount: "75", impact: "Provides seeds for 10 families" },
  { icon: GraduationCap, label: "Education", amount: "150", impact: "Sponsors 1 child for a year" },
];

const supportTypes = [
  { value: "one-time", label: "One-Time Donation" },
  { value: "recurring", label: "Recurring Donation" },
  { value: "in-kind", label: "In-Kind Donation" },
  { value: "partnership", label: "Partnership" },
  { value: "sponsorship", label: "Sponsorship" },
];

export default function Donate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    frequency: "one-time",
    method: "bank",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/submit/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        toast({
          title: "Donation Request Received!",
          description: "Thank you for your interest in supporting CArCRT. Our team will contact you shortly.",
        });
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

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding bg-background min-h-[60vh] flex items-center">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center animate-scale-in">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Thank You for Your Generosity!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your interest in supporting CArCRT. Our team will contact you shortly
                to complete your donation and provide you with a receipt.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Make Another Donation
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-accent text-accent-foreground">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Support Our Mission
            </h1>
            <p className="text-lg text-accent-foreground/90">
              Support CArCRT in building stronger, more resilient communities across Sierra Leone.
              Your contribution helps fund programs that transform lives and create long-term impact.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <SectionHeader
            title="Your Impact"
            subtitle="See how your donation can make a difference"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impactAreas.map((area, index) => (
              <Card
                key={index}
                className="card-hover border-none shadow-card animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 bg-primary/10 rounded-xl text-primary mb-3">
                    <area.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{area.label}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">${area.amount}</p>
                  <p className="text-sm text-muted-foreground">{area.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <SectionHeader
              title="Make a Donation"
              subtitle="Fill out the form below to support our programs"
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

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+232 XXX XXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div>
                    <Label>Donation Frequency *</Label>
                    <RadioGroup
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="cursor-pointer">One-Time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="cursor-pointer">Yearly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Payment Method *</Label>
                    <RadioGroup
                      value={formData.method}
                      onValueChange={(value) => setFormData({ ...formData, method: value })}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="cursor-pointer">Bank Transfer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mobile" id="mobile" />
                        <Label htmlFor="mobile" className="cursor-pointer">Mobile Money</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="cursor-pointer">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any additional message or instructions..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 gap-2">
                    <Heart className="h-5 w-5" />
                    Submit Donation Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Ways */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Other Ways to Support
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Besides financial donations, you can support CArCRT by volunteering your time,
            sharing our work, or partnering with us on programs.
          </p>
        </div>
      </section>
    </Layout>
  );
}
