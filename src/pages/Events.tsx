import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, Users, X, ArrowRight, Download } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";
import { toast } from "@/hooks/use-toast";

const eventStatuses = ["All", "Upcoming", "Ongoing", "Past"];

export default function Events() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('dateFrom', { ascending: false });
        if (error) throw error;
        // Map fields to expected frontend structure
        const mapped = (data || []).map(event => ({
          ...event,
          date: event.dateFrom || event.date || "",
          time: event.time || "",
          status: event.status || "upcoming",
          application_pdf: event.applicationPdf || event.application_pdf || "",
          registration_link: event.registrationLink || event.registration_link || "",
        }));
        setAllEvents(mapped);
        setFilteredEvents(mapped);
      } catch (err) {
        console.error('Error loading events from Supabase:', err);
        setAllEvents([]);
        setFilteredEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedStatus === "All") {
      setFilteredEvents(allEvents);
    } else {
      setFilteredEvents(allEvents.filter(event => event.status === selectedStatus.toLowerCase()));
    }
  }, [selectedStatus, allEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('submissions')
        .insert([{
          type: 'event-registration',
          data: {
            eventTitle: selectedEvent,
            ...formData
          },
          status: 'pending'
        }]);

      if (!error) {
        toast({
          title: "Registration Submitted!",
          description: "Thank you for registering. We'll send you confirmation details shortly.",
        });
        setIsOpen(false);
        setFormData({ name: "", email: "", phone: "", organization: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit registration. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              <span className="gradient-text">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us at our upcoming events and be part of the community transformation
            </p>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {filteredEvents.length > 0 && filteredEvents[0] ? (
            <Card className="overflow-hidden border-none shadow-card animate-fade-up">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-8 md:p-12 text-primary-foreground min-h-[350px] flex flex-col justify-end relative">
                    {filteredEvents[0].image && (
                      <img 
                        src={getImageUrl(filteredEvents[0].image)} 
                        alt={filteredEvents[0].title}
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                      />
                    )}
                    <div className="relative z-10">
                      <div className="inline-block px-3 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium mb-4">
                        {filteredEvents[0].status.charAt(0).toUpperCase() + filteredEvents[0].status.slice(1)} Event
                      </div>
                      <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                        {filteredEvents[0].title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        {filteredEvents[0].date && (
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(filteredEvents[0].date).toLocaleDateString()}
                          </span>
                        )}
                        {filteredEvents[0].time && (
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {filteredEvents[0].time}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {filteredEvents[0].location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 bg-card">
                    <h3 className="text-xl font-semibold mb-2">Featured Event</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-4">
                      {filteredEvents[0].description}
                    </p>
                    <Link to={`/events/${filteredEvents[0].id}`}>
                      <Button className="gap-2">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {filteredEvents[0].registration_link && (
                      <a 
                        href={filteredEvents[0].registration_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary mt-2 inline-flex items-center gap-1 ml-4"
                      >
                        Register for this event
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events available</p>
            </div>
          )}
        </div>
      </section>

      {/* Events Grid with Tabs */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <SectionHeader
            title="All Events"
            subtitle="Browse our events by status"
          />

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {eventStatuses.map((status) => (
              <Button
                key={status}
                variant={status === selectedStatus ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No {selectedStatus.toLowerCase()} events available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-none shadow-card card-hover animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {event.image && (
                    <div className="h-48 overflow-hidden cursor-pointer" onClick={() => setLightboxImage({ src: getImageUrl(event.image), alt: event.title })}>
                      <img 
                        src={getImageUrl(event.image)} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)} Event
                      </span>
                      {event.date && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                    <div className="flex flex-col gap-2">
                      <Link to={`/events/${event.id}`}>
                        <Button variant="outline" className="gap-2 w-full">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      {event.application_pdf && (
                        <a 
                          href={getImageUrl(event.application_pdf)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 text-center font-medium flex items-center justify-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download Application Form
                        </a>
                      )}
                      {event.registration_link && !event.application_pdf && (
                        <a 
                          href={event.registration_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 text-center font-medium"
                        >
                          Register for this event →
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
