// DEPRECATED: This legacy AdminDashboard uses insecure custom backend endpoints and password logic.
// Do NOT use. Use the new Supabase-based admin dashboard in pages/AdminDashboardNew.tsx instead.

export default function DeprecatedAdminDashboard() {
  return (
    <div className="p-8 text-red-600 font-bold text-xl">
      This legacy AdminDashboard is deprecated and should not be used. Please use the new Supabase-based admin dashboard.
    </div>
  );
}

// Legacy code below (commented out):
/*

import { useState } from "react";

function Header() {
  return (
    <header className="w-full bg-primary text-white shadow flex items-center px-8 h-16">
      <div className="font-bold text-xl tracking-wide">CArCRT Admin</div>
      <nav className="ml-auto flex gap-6 text-sm">
        <a href="/" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Contact</a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-gray-100 text-gray-500 text-xs py-4 text-center border-t mt-auto">
      &copy; {new Date().getFullYear()} CArCRT. All rights reserved.
    </footer>
  );
}

const sections = [
  { key: "community", label: "Community Stats" },
  { key: "gallery", label: "Gallery" },
  { key: "partners", label: "Partners & Sponsors" },
  { key: "leadership", label: "Leadership Team" },
  { key: "stories", label: "Impact Stories" },
  { key: "news", label: "News & Updates" },
  { key: "events", label: "Events" },
];


export default function AdminDashboard() {
  const [active, setActive] = useState("community");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-gray-100">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-sm flex flex-col p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Admin</h2>
            <p className="text-xs text-gray-400">Dashboard</p>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.key}>
                  <button
                    onClick={() => setActive(s.key)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition font-medium ${active === s.key ? "bg-primary text-white shadow" : "hover:bg-primary/10 text-gray-700"}`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-1">
            <div className="mb-8 border-b pb-4 flex items-center gap-4">
              <h1 className="text-3xl font-bold text-primary tracking-tight">{sections.find(s => s.key === active)?.label}</h1>
              <span className="ml-auto text-xs text-gray-400">Admin Panel</span>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-8">
              {active === "community" && <CommunityStatsAdmin />}
              {active === "gallery" && <GalleryAdmin />}
              {active === "partners" && <PartnersAdmin />}
              {active === "leadership" && <LeadershipAdmin />}
              {active === "stories" && <ImpactStoriesAdmin />}
              {active === "news" && <NewsAdmin />}
              {active === "events" && <EventsAdmin />}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
      formData.append("logo", partnerEditFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/partners/${editingPartner.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setPartners(partners.map((p) => p.id === editingPartner.id ? data.partner : p));
        setEditingPartner(null);
        if (partnerEditFileRef.current) partnerEditFileRef.current.value = "";
        toast.success("Partner updated!");
      }
    } catch (error) {
      toast.error("Failed to update partner");
    }
  };

  const addFeaturedStory = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/featured-stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...newFeaturedStory }),
      });
      if (response.ok) {
        const data = await response.json();
        setFeaturedStories([...featuredStories, data.story]);
        setNewFeaturedStory({ title: "", category: "", summary: "", quote: "", author: "" });
        toast.success("Featured story added!");
      }
    } catch (error) {
      toast.error("Failed to add featured story");
    }
  };

  const deleteFeaturedStory = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/featured-stories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setFeaturedStories(featuredStories.filter((s) => s.id !== id));
        toast.success("Story deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete story");
    }
  };

  const addTestimonial = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...newTestimonial }),
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonials([...testimonials, data.testimonial]);
        setNewTestimonial({ quote: "", author: "" });
        toast.success("Testimonial added!");
      }
    } catch (error) {
      toast.error("Failed to add testimonial");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        toast.success("Testimonial deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const addNews = async () => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("title", newNews.title);
    formData.append("category", JSON.stringify(newNews.category));
    formData.append("excerpt", newNews.excerpt);
    formData.append("content", newNews.content);
    formData.append("date", newNews.date);
    formData.append("link", newNews.link || "");
    formData.append("videoUrl", newNews.videoUrl || "");
    if (newsFileRef.current?.files?.[0]) {
      formData.append("image", newsFileRef.current.files[0]);
    }
    if (newsDocRef.current?.files?.[0]) {
      formData.append("document", newsDocRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/news`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setNews([...news, data.article]);
        setNewNews({ title: "", category: [], excerpt: "", content: "", date: new Date().toISOString().split('T')[0], link: "", videoUrl: "" });
        if (newsFileRef.current) newsFileRef.current.value = "";
        if (newsDocRef.current) newsDocRef.current.value = "";
        toast.success("News added!");
      }
    } catch (error) {
      toast.error("Failed to add news");
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Delete this news?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/news/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setNews(news.filter((n) => n.id !== id));
        toast.success("News deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete news");
    }
  };

  const updateNews = async () => {
    if (!editingNews) return;
    
    const formData = new FormData();
    formData.append("password", password);
    formData.append("title", editingNews.title);
    formData.append("category", JSON.stringify(editingNews.category));
    formData.append("excerpt", editingNews.excerpt);
    formData.append("content", editingNews.content);
    formData.append("date", editingNews.date);
    formData.append("link", editingNews.link || "");
    formData.append("videoUrl", editingNews.videoUrl || "");
    if (newsEditFileRef.current?.files?.[0]) {
      formData.append("image", newsEditFileRef.current.files[0]);
    }
    if (newsEditDocRef.current?.files?.[0]) {
      formData.append("document", newsEditDocRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/news/${editingNews.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setNews(news.map((n) => n.id === editingNews.id ? data.article : n));
        setEditingNews(null);
        if (newsEditFileRef.current) newsEditFileRef.current.value = "";
        if (newsEditDocRef.current) newsEditDocRef.current.value = "";
        toast.success("News updated!");
      }
    } catch (error) {
      toast.error("Failed to update news");
    }
  };

  const addEvent = async () => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("title", newEvent.title);
    formData.append("dateFrom", newEvent.dateFrom);
    formData.append("dateTo", newEvent.dateTo);
    formData.append("location", newEvent.location);
    formData.append("description", newEvent.description);
    formData.append("status", newEvent.status);
    formData.append("registrationLink", newEvent.registrationLink);
    formData.append("registrationNote", newEvent.registrationNote);
    formData.append("applicationEmail", newEvent.applicationEmail);
    if (eventFileRef.current?.files?.[0]) {
      formData.append("image", eventFileRef.current.files[0]);
    }
    if (eventPdfRef.current?.files?.[0]) {
      formData.append("applicationPdf", eventPdfRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/events`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEvents([...events, data.event]);
        setNewEvent({ title: "", dateFrom: "", dateTo: "", location: "", description: "", status: "upcoming", registrationLink: "", registrationNote: "", applicationEmail: "" });
        if (eventFileRef.current) eventFileRef.current.value = "";
        if (eventPdfRef.current) eventPdfRef.current.value = "";
        toast.success("Event added!");
      }
    } catch (error) {
      toast.error("Failed to add event");
    }
  };

  const updateEventStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status }),
      });
      if (response.ok) {
        setEvents(events.map((e) => (e.id === id ? { ...e, status } : e)));
        toast.success("Event status updated!");
      }
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/events/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id));
        toast.success("Event deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const updateEvent = async () => {
    if (!editingEvent) return;
    
    const formData = new FormData();
    formData.append("password", password);
    formData.append("title", editingEvent.title);
    formData.append("dateFrom", editingEvent.dateFrom);
    formData.append("dateTo", editingEvent.dateTo);
    formData.append("location", editingEvent.location);
    formData.append("description", editingEvent.description);
    formData.append("status", editingEvent.status);
    formData.append("registrationLink", editingEvent.registrationLink || "");
    formData.append("registrationNote", editingEvent.registrationNote || "");
    formData.append("applicationEmail", editingEvent.applicationEmail || "");
    if (eventEditFileRef.current?.files?.[0]) {
      formData.append("image", eventEditFileRef.current.files[0]);
    }
    if (eventEditPdfRef.current?.files?.[0]) {
      formData.append("applicationPdf", eventEditPdfRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/events/${editingEvent.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(events.map((e) => e.id === editingEvent.id ? data.event : e));
        setEditingEvent(null);
        if (eventEditFileRef.current) eventEditFileRef.current.value = "";
        if (eventEditPdfRef.current) eventEditPdfRef.current.value = "";
        toast.success("Event updated!");
      } else {
        toast.error("Failed to update event");
      }
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  // ===== LEADERSHIP FUNCTIONS =====
  const addLeader = async () => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", newLeader.name);
    formData.append("role", newLeader.role);
    formData.append("bio", newLeader.bio);
    if (leaderFileRef.current?.files?.[0]) {
      formData.append("photo", leaderFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/leadership`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setLeadership([...leadership, data.member]);
        setNewLeader({ name: "", role: "", bio: "" });
        if (leaderFileRef.current) leaderFileRef.current.value = "";
        toast.success("Leadership member added!");
      }
    } catch (error) {
      toast.error("Failed to add leadership member");
    }
  };

  const updateLeader = async () => {
    if (!editingLeader) return;
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", editingLeader.name);
    formData.append("role", editingLeader.role);
    formData.append("bio", editingLeader.bio);
    if (leaderEditFileRef.current?.files?.[0]) {
      formData.append("photo", leaderEditFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/leadership/${editingLeader.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setLeadership(leadership.map((l) => (l.id === editingLeader.id ? data.member : l)));
        setEditingLeader(null);
        if (leaderEditFileRef.current) leaderEditFileRef.current.value = "";
        toast.success("Leadership member updated!");
      }
    } catch (error) {
      toast.error("Failed to update leadership member");
    }
  };

  const deleteLeader = async (id: string) => {
    if (!confirm("Delete this leadership member?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/leadership/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setLeadership(leadership.filter((l) => l.id !== id));
        toast.success("Leadership member deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete leadership member");
    }
  };

  // ===== COORDINATORS FUNCTIONS =====
  const addCoordinator = async () => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", newCoordinator.name);
    formData.append("region", newCoordinator.region);
    formData.append("bio", newCoordinator.bio);
    if (coordinatorFileRef.current?.files?.[0]) {
      formData.append("photo", coordinatorFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/coordinators`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setCoordinators([...coordinators, data.coordinator]);
        setNewCoordinator({ name: "", region: "", bio: "" });
        if (coordinatorFileRef.current) coordinatorFileRef.current.value = "";
        toast.success("Coordinator added!");
      }
    } catch (error) {
      toast.error("Failed to add coordinator");
    }
  };

  const updateCoordinator = async () => {
    if (!editingCoordinator) return;
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", editingCoordinator.name);
    formData.append("region", editingCoordinator.region);
    formData.append("bio", editingCoordinator.bio);
    if (coordinatorEditFileRef.current?.files?.[0]) {
      formData.append("photo", coordinatorEditFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/coordinators/${editingCoordinator.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setCoordinators(coordinators.map((c) => (c.id === editingCoordinator.id ? data.coordinator : c)));
        setEditingCoordinator(null);
        if (coordinatorEditFileRef.current) coordinatorEditFileRef.current.value = "";
        toast.success("Coordinator updated!");
      }
    } catch (error) {
      toast.error("Failed to update coordinator");
    }
  };

  const deleteCoordinator = async (id: string) => {
    if (!confirm("Delete this coordinator?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/coordinators/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setCoordinators(coordinators.filter((c) => c.id !== id));
        toast.success("Coordinator deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete coordinator");
    }
  };

  // ===== REPRESENTATIVES FUNCTIONS =====
  const addRepresentative = async () => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", newRep.name);
    formData.append("community", newRep.community);
    formData.append("bio", newRep.bio);
    if (repFileRef.current?.files?.[0]) {
      formData.append("photo", repFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/representatives`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setRepresentatives([...representatives, data.representative]);
        setNewRep({ name: "", community: "", bio: "" });
        if (repFileRef.current) repFileRef.current.value = "";
        toast.success("Representative added!");
      }
    } catch (error) {
      toast.error("Failed to add representative");
    }
  };

  const updateRepresentative = async () => {
    if (!editingRep) return;
    const formData = new FormData();
    formData.append("password", password);
    formData.append("name", editingRep.name);
    formData.append("community", editingRep.community);
    formData.append("bio", editingRep.bio);
    if (repEditFileRef.current?.files?.[0]) {
      formData.append("photo", repEditFileRef.current.files[0]);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/admin/representatives/${editingRep.id}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setRepresentatives(representatives.map((r) => (r.id === editingRep.id ? data.representative : r)));
        setEditingRep(null);
        if (repEditFileRef.current) repEditFileRef.current.value = "";
        toast.success("Representative updated!");
      }
    } catch (error) {
      toast.error("Failed to update representative");
    }
  };

  const deleteRepresentative = async (id: string) => {
    if (!confirm("Delete this representative?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/representatives/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setRepresentatives(representatives.filter((r) => r.id !== id));
        toast.success("Representative deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete representative");
    }
  };

  const approveStory = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/stories/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setStories(stories.map((s) => (s.id === id ? { ...s, approved: true } : s)));
        toast.success("Story approved!");
      }
    } catch (error) {
      toast.error("Failed to approve story");
    }
  };

  const deleteStory = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/admin/stories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setStories(stories.filter((s) => s.id !== id));
        toast.success("Story deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete story");
    }
  };

  const addGalleryPhoto = async () => {
    const file = galleryFileRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", newGalleryPhoto.caption);

    try {
      const response = await fetch("http://localhost:3001/api/gallery", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const newPhoto = await response.json();
        setGallery([...gallery, newPhoto]);
        setNewGalleryPhoto({ caption: "" });
        if (galleryFileRef.current) galleryFileRef.current.value = "";
        toast.success("Photo added!");
      }
    } catch (error) {
      toast.error("Failed to add photo");
    }
  };

  const deleteGalleryPhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const response = await fetch(`http://localhost:3001/api/gallery/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setGallery(gallery.filter((p) => p.id !== id));
        toast.success("Photo deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Admin Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => { setAuthenticated(false); setPassword(""); }}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-6 md:grid-cols-12">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="testimonials">Voice</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="submissions">Messages</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="coordinators">Coordinators</TabsTrigger>
            <TabsTrigger value="representatives">Interns</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Community Members Reached</label>
                  <Input value={stats.membersReached} onChange={(e) => setStats({ ...stats, membersReached: e.target.value })} placeholder="e.g., 50,000+" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Projects Implemented</label>
                  <Input value={stats.projectsImplemented} onChange={(e) => setStats({ ...stats, projectsImplemented: e.target.value })} placeholder="e.g., 150+" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Districts Engaged</label>
                  <Input value={stats.districtsEngaged} onChange={(e) => setStats({ ...stats, districtsEngaged: e.target.value })} placeholder="e.g., 12" />
                </div>
                <Button onClick={updateStats}>Update Stats</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Partner/Sponsor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Partner Name" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} />
                <select className="w-full px-3 py-2 border rounded" value={newPartner.type} onChange={(e) => setNewPartner({ ...newPartner, type: e.target.value })}>
                  <option value="Partner">Partner</option>
                  <option value="Sponsor">Sponsor</option>
                </select>
                <Input placeholder="Website URL (optional)" value={newPartner.website} onChange={(e) => setNewPartner({ ...newPartner, website: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium mb-2">Logo Image</label>
                  <input type="file" ref={partnerFileRef} accept="image/*" className="w-full" />
                </div>
                <Button onClick={addPartner}><Plus className="h-4 w-4 mr-2" />Add Partner/Sponsor</Button>
              </CardContent>
            </Card>

            {editingPartner && (
              <Card className="mb-6 border-primary">
                <CardHeader>
                  <CardTitle>Edit Partner/Sponsor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Partner Name" value={editingPartner.name} onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} />
                  <select className="w-full px-3 py-2 border rounded" value={editingPartner.type} onChange={(e) => setEditingPartner({ ...editingPartner, type: e.target.value })}>
                    <option value="Partner">Partner</option>
                    <option value="Sponsor">Sponsor</option>
                  </select>
                  <Input placeholder="Website URL (optional)" value={editingPartner.website || ""} onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Logo</label>
                    {editingPartner.logo && (
                      <img src={`http://localhost:3001${editingPartner.logo}`} alt={editingPartner.name} className="h-20 w-20 object-contain mb-2 border rounded" />
                    )}
                    <label className="block text-sm font-medium mb-2">Upload New Logo (optional)</label>
                    <input type="file" ref={partnerEditFileRef} accept="image/*" className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updatePartner}><Check className="h-4 w-4 mr-2" />Update</Button>
                    <Button variant="outline" onClick={() => setEditingPartner(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {partners.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {p.logo && <img src={`http://localhost:3001${p.logo}`} alt={p.name} className="h-12 w-12 object-contain" />}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.type}</p>
                        {p.website && <p className="text-xs text-blue-600">{p.website}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingPartner(p)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deletePartner(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Featured Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Title" value={newFeaturedStory.title} onChange={(e) => setNewFeaturedStory({ ...newFeaturedStory, title: e.target.value })} />
                <Input placeholder="Category" value={newFeaturedStory.category} onChange={(e) => setNewFeaturedStory({ ...newFeaturedStory, category: e.target.value })} />
                <Textarea placeholder="Summary" value={newFeaturedStory.summary} onChange={(e) => setNewFeaturedStory({ ...newFeaturedStory, summary: e.target.value })} />
                <Textarea placeholder="Quote" value={newFeaturedStory.quote} onChange={(e) => setNewFeaturedStory({ ...newFeaturedStory, quote: e.target.value })} />
                <Input placeholder="Author" value={newFeaturedStory.author} onChange={(e) => setNewFeaturedStory({ ...newFeaturedStory, author: e.target.value })} />
                <Button onClick={addFeaturedStory}><Plus className="h-4 w-4 mr-2" />Add</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {featuredStories.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.category}</p>
                        <p className="text-sm mt-2">{s.summary}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteFeaturedStory(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Testimonial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea placeholder="Quote" value={newTestimonial.quote} onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })} />
                <Input placeholder="Author" value={newTestimonial.author} onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })} />
                <Button onClick={addTestimonial}><Plus className="h-4 w-4 mr-2" />Add</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-4 flex justify-between">
                    <div>
                      <p className="italic">"{t.quote}"</p>
                      <p className="text-sm text-muted-foreground mt-2">— {t.author}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deleteTestimonial(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stories">
            <div className="grid gap-4">
              {stories.map((s) => (
                <Card key={s.id}>
                  <CardContent className="p-4 flex gap-4">
                    {s.imageUrl && <img src={`http://localhost:3001${s.imageUrl}`} alt={s.name} className="h-24 w-24 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-bold">{s.name}</h3>
                      <p className="text-sm text-muted-foreground">{s.category}</p>
                      <p className="text-sm mt-2">{s.story.substring(0, 100)}...</p>
                      <div className="flex gap-2 mt-2">
                        {!s.approved && <Button size="sm" onClick={() => approveStory(s.id)}><Check className="h-4 w-4 mr-1" />Approve</Button>}
                        {s.approved && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">✓ Approved</span>}
                        <Button size="sm" variant="destructive" onClick={() => deleteStory(s.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Form Submissions ({submissions.length})</CardTitle>
                <p className="text-sm text-muted-foreground">All messages from Contact, Event Registration, Volunteer, and Donation forms</p>
              </CardHeader>
            </Card>
            
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No form submissions yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((sub) => (
                  <Card key={sub.id} className={!sub.read ? "border-primary" : ""}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground mb-2">
                            {sub.type.replace(/_/g, ' ')}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sub.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!sub.read && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">NEW</span>
                        )}
                      </div>

                      {sub.type === 'CONTACT' && (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {sub.data.name}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${sub.data.email}`} className="text-primary hover:underline">{sub.data.email}</a></p>
                          {sub.data.phone && <p><strong>Phone:</strong> {sub.data.phone}</p>}
                          {sub.data.subject && <p><strong>Subject:</strong> {sub.data.subject}</p>}
                          <p><strong>Message:</strong></p>
                          <p className="bg-muted p-3 rounded">{sub.data.message}</p>
                        </div>
                      )}

                      {sub.type === 'EVENT_REGISTRATION' && (
                        <div className="space-y-2">
                          <p><strong>Event:</strong> {sub.data.eventTitle}</p>
                          <p><strong>Name:</strong> {sub.data.name}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${sub.data.email}`} className="text-primary hover:underline">{sub.data.email}</a></p>
                          {sub.data.phone && <p><strong>Phone:</strong> {sub.data.phone}</p>}
                          {sub.data.organization && <p><strong>Organization:</strong> {sub.data.organization}</p>}
                          {sub.data.message && (
                            <>
                              <p><strong>Message:</strong></p>
                              <p className="bg-muted p-3 rounded">{sub.data.message}</p>
                            </>
                          )}
                        </div>
                      )}

                      {sub.type === 'VOLUNTEER' && (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {sub.data.name}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${sub.data.email}`} className="text-primary hover:underline">{sub.data.email}</a></p>
                          {sub.data.phone && <p><strong>Phone:</strong> {sub.data.phone}</p>}
                          <p><strong>Area of Interest:</strong> {sub.data.area}</p>
                          {sub.data.skills && <p><strong>Skills:</strong> {sub.data.skills}</p>}
                          {sub.data.experience && (
                            <>
                              <p><strong>Experience:</strong></p>
                              <p className="bg-muted p-3 rounded">{sub.data.experience}</p>
                            </>
                          )}
                          {sub.data.message && (
                            <>
                              <p><strong>Motivation:</strong></p>
                              <p className="bg-muted p-3 rounded">{sub.data.message}</p>
                            </>
                          )}
                        </div>
                      )}

                      {sub.type === 'DONATION' && (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {sub.data.name}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${sub.data.email}`} className="text-primary hover:underline">{sub.data.email}</a></p>
                          {sub.data.phone && <p><strong>Phone:</strong> {sub.data.phone}</p>}
                          <p><strong>Amount:</strong> {sub.data.amount}</p>
                          <p><strong>Frequency:</strong> {sub.data.frequency}</p>
                          {sub.data.method && <p><strong>Payment Method:</strong> {sub.data.method}</p>}
                          {sub.data.message && (
                            <>
                              <p><strong>Message:</strong></p>
                              <p className="bg-muted p-3 rounded">{sub.data.message}</p>
                            </>
                          )}
                        </div>
                      )}

                      {sub.type === 'STORY' && (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {sub.data.name}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${sub.data.email}`} className="text-primary hover:underline">{sub.data.email}</a></p>
                          <p><strong>Category:</strong> {sub.data.category}</p>
                          <p><strong>Story Preview:</strong></p>
                          <p className="bg-muted p-3 rounded">{sub.data.storyPreview}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="news">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add News Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Title" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium mb-2">Categories (Select multiple)</label>
                  <div className="grid grid-cols-2 gap-2 p-3 border rounded">
                    {["Announcements", "Programs", "Impact", "Partnerships", "Events", "Reports"].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newNews.category.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewNews({ ...newNews, category: [...newNews.category, cat] });
                            } else {
                              setNewNews({ ...newNews, category: newNews.category.filter(c => c !== cat) });
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                  {newNews.category.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Selected: {newNews.category.join(", ")}</p>
                  )}
                </div>
                <Input type="date" value={newNews.date} onChange={(e) => setNewNews({ ...newNews, date: e.target.value })} />
                <Textarea placeholder="Excerpt" value={newNews.excerpt} onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })} />
                <Textarea placeholder="Content" value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} className="min-h-[100px]" />
                <Input placeholder="Read More Link (optional)" value={newNews.link} onChange={(e) => setNewNews({ ...newNews, link: e.target.value })} />
                <Input placeholder="Video URL (YouTube, Vimeo, etc.)" value={newNews.videoUrl} onChange={(e) => setNewNews({ ...newNews, videoUrl: e.target.value })} />
                <div>
                  <Label>Image</Label>
                  <input type="file" ref={newsFileRef} accept="image/*" className="w-full" />
                </div>
                <div>
                  <Label>Document (PDF, DOCX, etc.)</Label>
                  <input type="file" ref={newsDocRef} accept=".pdf,.doc,.docx" className="w-full" />
                </div>
                <Button onClick={addNews}><Plus className="h-4 w-4 mr-2" />Add</Button>
              </CardContent>
            </Card>

            {editingNews && (
              <Card className="mb-6 border-primary">
                <CardHeader>
                  <CardTitle>Edit News Article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Title" value={editingNews.title} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium mb-2">Categories (Select multiple)</label>
                    <div className="grid grid-cols-2 gap-2 p-3 border rounded">
                      {["Announcements", "Programs", "Impact", "Partnerships", "Events", "Reports"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(Array.isArray(editingNews.category) ? editingNews.category : [editingNews.category]).includes(cat)}
                            onChange={(e) => {
                              const currentCategories = Array.isArray(editingNews.category) ? editingNews.category : [editingNews.category];
                              if (e.target.checked) {
                                setEditingNews({ ...editingNews, category: [...currentCategories, cat] });
                              } else {
                                setEditingNews({ ...editingNews, category: currentCategories.filter(c => c !== cat) });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                    {((Array.isArray(editingNews.category) ? editingNews.category : [editingNews.category]).length > 0) && (
                      <p className="text-xs text-muted-foreground mt-1">Selected: {(Array.isArray(editingNews.category) ? editingNews.category : [editingNews.category]).join(", ")}</p>
                    )}
                  </div>
                  <Input type="date" value={editingNews.date} onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })} />
                  <Textarea placeholder="Excerpt" value={editingNews.excerpt} onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })} />
                  <Textarea placeholder="Content" value={editingNews.content} onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} className="min-h-[100px]" />
                  <Input placeholder="Read More Link" value={editingNews.link} onChange={(e) => setEditingNews({ ...editingNews, link: e.target.value })} />
                  <Input placeholder="Video URL" value={editingNews.videoUrl} onChange={(e) => setEditingNews({ ...editingNews, videoUrl: e.target.value })} />
                  <div>
                    <Label>Change Image (optional)</Label>
                    <input type="file" ref={newsEditFileRef} accept="image/*" className="w-full" />
                  </div>
                  <div>
                    <Label>Change Document (optional)</Label>
                    <input type="file" ref={newsEditDocRef} accept=".pdf,.doc,.docx" className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateNews}>Update</Button>
                    <Button variant="outline" onClick={() => setEditingNews(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {news.map((n) => (
                <Card key={n.id}>
                  <CardContent className="p-4 flex gap-4">
                    {n.image && <img src={`http://localhost:3001${n.image}`} alt={n.title} className="h-24 w-32 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-bold">{n.title}</h3>
                      <p className="text-sm text-muted-foreground">{n.category} • {n.date}</p>
                      <p className="text-sm mt-2">{n.excerpt}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingNews(n)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteNews(n.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date From *</label>
                    <Input type="date" value={newEvent.dateFrom} onChange={(e) => setNewEvent({ ...newEvent, dateFrom: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date To *</label>
                    <Input type="date" value={newEvent.dateTo} onChange={(e) => setNewEvent({ ...newEvent, dateTo: e.target.value })} />
                  </div>
                </div>
                <Input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                <Textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Link (Optional)</label>
                  <Input placeholder="Google Forms, Eventbrite, etc." value={newEvent.registrationLink} onChange={(e) => setNewEvent({ ...newEvent, registrationLink: e.target.value })} />
                  <p className="text-xs text-muted-foreground mt-1">Add external registration link OR use the note below</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Note (Optional)</label>
                  <Input placeholder="e.g., 'No registration required', 'Open to all'" value={newEvent.registrationNote} onChange={(e) => setNewEvent({ ...newEvent, registrationNote: e.target.value })} />
                  <p className="text-xs text-muted-foreground mt-1">Use this if event doesn't need a registration link</p>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Physical Application Option</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Application Form (PDF, Word, etc.)</label>
                      <input type="file" ref={eventPdfRef} accept=".pdf,.doc,.docx,.txt" className="w-full" />
                      <p className="text-xs text-muted-foreground mt-1">Upload application form (PDF, Word, or text document)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Application Email</label>
                      <Input placeholder="applications@carcrt.org" value={newEvent.applicationEmail} onChange={(e) => setNewEvent({ ...newEvent, applicationEmail: e.target.value })} />
                      <p className="text-xs text-muted-foreground mt-1">Email where filled applications should be sent</p>
                    </div>
                  </div>
                </div>
                <select className="w-full px-3 py-2 border rounded" value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Image</label>
                  <input type="file" ref={eventFileRef} accept="image/*" className="w-full" />
                </div>
                <Button onClick={addEvent}><Plus className="h-4 w-4 mr-2" />Add Event</Button>
              </CardContent>
            </Card>

            {editingEvent && (
              <Card className="mb-6 border-primary">
                <CardHeader>
                  <CardTitle>Edit Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Event Title" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date From *</label>
                      <Input type="date" value={editingEvent.dateFrom} onChange={(e) => setEditingEvent({ ...editingEvent, dateFrom: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date To *</label>
                      <Input type="date" value={editingEvent.dateTo} onChange={(e) => setEditingEvent({ ...editingEvent, dateTo: e.target.value })} />
                    </div>
                  </div>
                  <Input placeholder="Location" value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                  <Textarea placeholder="Description" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} />
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Link (Optional)</label>
                    <Input placeholder="Google Forms, Eventbrite, etc." value={editingEvent.registrationLink || ""} onChange={(e) => setEditingEvent({ ...editingEvent, registrationLink: e.target.value })} />
                    <p className="text-xs text-muted-foreground mt-1">Add external registration link OR use the note below</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Note (Optional)</label>
                    <Input placeholder="e.g., 'No registration required', 'Open to all'" value={editingEvent.registrationNote || ""} onChange={(e) => setEditingEvent({ ...editingEvent, registrationNote: e.target.value })} />
                    <p className="text-xs text-muted-foreground mt-1">Use this if event doesn't need a registration link</p>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Physical Application Option</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Application Form (PDF, Word, etc.)</label>
                        {editingEvent.applicationPdf && (
                          <div className="mb-2 text-sm">
                            Current: <a href={`http://localhost:3001${editingEvent.applicationPdf}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View Document</a>
                          </div>
                        )}
                        <input type="file" ref={eventEditPdfRef} accept=".pdf,.doc,.docx,.txt" className="w-full" />
                        <p className="text-xs text-muted-foreground mt-1">Upload new document to replace current</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Application Email</label>
                        <Input placeholder="applications@carcrt.org" value={editingEvent.applicationEmail || ""} onChange={(e) => setEditingEvent({ ...editingEvent, applicationEmail: e.target.value })} />
                        <p className="text-xs text-muted-foreground mt-1">Email where filled applications should be sent</p>
                      </div>
                    </div>
                  </div>
                  <select className="w-full px-3 py-2 border rounded" value={editingEvent.status} onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}>
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Past</option>
                  </select>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Image</label>
                    {editingEvent.image && (
                      <img src={`http://localhost:3001${editingEvent.image}`} alt={editingEvent.title} className="h-32 w-48 object-cover mb-2 border rounded" />
                    )}
                    <label className="block text-sm font-medium mb-2">Upload New Image (optional)</label>
                    <input type="file" ref={eventEditFileRef} accept="image/*" className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateEvent}><Check className="h-4 w-4 mr-2" />Update</Button>
                    <Button variant="outline" onClick={() => setEditingEvent(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {events.map((e) => (
                <Card key={e.id}>
                  <CardContent className="p-4 flex gap-4">
                    {e.image && <img src={`http://localhost:3001${e.image}`} alt={e.title} className="h-24 w-32 object-cover rounded" />}
                    <div className="flex-1">
                      <h3 className="font-bold">{e.title}</h3>
                      <p className="text-sm text-muted-foreground">{e.date} • {e.location}</p>
                      <p className="text-sm text-muted-foreground">Status: <span className="capitalize font-medium">{e.status}</span></p>
                      <p className="text-sm mt-2">{e.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingEvent(e)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteEvent(e.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leadership">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLeader ? (
                  <div className="space-y-4 p-4 border rounded">
                    <h3 className="font-semibold">Edit Leadership Member</h3>
                    {editingLeader.photo && (
                      <div className="flex items-center gap-4">
                        <img src={`http://localhost:3001${editingLeader.photo}`} alt={editingLeader.name} className="w-20 h-20 rounded object-cover" />
                        <span className="text-sm text-muted-foreground">Current Photo</span>
                      </div>
                    )}
                    <Input
                      placeholder="Name"
                      value={editingLeader.name}
                      onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                    />
                    <Input
                      placeholder="Role/Position"
                      value={editingLeader.role}
                      onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={editingLeader.bio}
                      onChange={(e) => setEditingLeader({ ...editingLeader, bio: e.target.value })}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Change Photo (optional)</label>
                      <Input type="file" ref={leaderEditFileRef} accept="image/*" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateLeader}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditingLeader(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={newLeader.name}
                      onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                    />
                    <Input
                      placeholder="Role/Position (e.g., Executive Director)"
                      value={newLeader.role}
                      onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={newLeader.bio}
                      onChange={(e) => setNewLeader({ ...newLeader, bio: e.target.value })}
                    />
                    <Input type="file" ref={leaderFileRef} accept="image/*" />
                    <Button onClick={addLeader}>
                      <Plus className="mr-2 h-4 w-4" /> Add Leader
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 space-y-4">
              {leadership.map((leader) => (
                <Card key={leader.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {leader.photo && (
                          <img src={`http://localhost:3001${leader.photo}`} alt={leader.name} className="w-20 h-20 rounded object-cover" />
                        )}
                        <div>
                          <h3 className="font-semibold">{leader.name}</h3>
                          <p className="text-sm text-muted-foreground">{leader.role}</p>
                          <p className="mt-2 text-sm">{leader.bio}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingLeader(leader)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteLeader(leader.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coordinators">
            <Card>
              <CardHeader>
                <CardTitle>Field Coordinators Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingCoordinator ? (
                  <div className="space-y-4 p-4 border rounded">
                    <h3 className="font-semibold">Edit Coordinator</h3>
                    {editingCoordinator.photo && (
                      <div className="flex items-center gap-4">
                        <img src={`http://localhost:3001${editingCoordinator.photo}`} alt={editingCoordinator.name} className="w-20 h-20 rounded object-cover" />
                        <span className="text-sm text-muted-foreground">Current Photo</span>
                      </div>
                    )}
                    <Input
                      placeholder="Name"
                      value={editingCoordinator.name}
                      onChange={(e) => setEditingCoordinator({ ...editingCoordinator, name: e.target.value })}
                    />
                    <Input
                      placeholder="Region"
                      value={editingCoordinator.region}
                      onChange={(e) => setEditingCoordinator({ ...editingCoordinator, region: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={editingCoordinator.bio}
                      onChange={(e) => setEditingCoordinator({ ...editingCoordinator, bio: e.target.value })}
                    />
                    <div>
                      <label className="text-sm font-medium mb-2 block">Change Photo (optional)</label>
                      <Input type="file" ref={coordinatorEditFileRef} accept="image/*" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={updateCoordinator}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditingCoordinator(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={newCoordinator.name}
                      onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                    />
                    <Input
                      placeholder="Region (e.g., Northern Region)"
                      value={newCoordinator.region}
                      onChange={(e) => setNewCoordinator({ ...newCoordinator, region: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={newCoordinator.bio}
                      onChange={(e) => setNewCoordinator({ ...newCoordinator, bio: e.target.value })}
                    />
                    <Input type="file" ref={coordinatorFileRef} accept="image/*" />
                    <Button onClick={addCoordinator}>
                      <Plus className="mr-2 h-4 w-4" /> Add Coordinator
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 space-y-4">
              {coordinators.map((coordinator) => (
                <Card key={coordinator.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {coordinator.photo && (
                          <img src={`http://localhost:3001${coordinator.photo}`} alt={coordinator.name} className="w-20 h-20 rounded object-cover" />
                        )}
                        <div>
                          <h3 className="font-semibold">{coordinator.name}</h3>
                          <p className="text-sm text-muted-foreground">{coordinator.region}</p>
                          <p className="mt-2 text-sm">{coordinator.bio}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingCoordinator(coordinator)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCoordinator(coordinator.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="representatives">
            <Card>
              <CardHeader>
                <CardTitle>2020 Interns</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <img
                  src="/uploads/2020-interns.jpg"
                  alt="2020 Interns Group"
                  className="w-full max-w-xl rounded shadow mb-4"
                  style={{ objectFit: 'cover' }}
                />
                <p className="text-center text-lg font-semibold text-primary mt-2">CArCRT 2020 Interns</p>
                <p className="text-center text-sm text-muted-foreground mt-1">Group picture of the 2020 internship cohort</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery - Our Work in Action</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Photo</label>
                    <input type="file" ref={galleryFileRef} accept="image/*" className="block w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption (Optional)</label>
                    <Input
                      value={newGalleryPhoto.caption}
                      onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })}
                      placeholder="Photo caption..."
                    />
                  </div>
                  <Button onClick={addGalleryPhoto}>
                    <Plus className="h-4 w-4 mr-2" /> Add Photo
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {gallery.map((photo) => (
                    <Card key={photo.id}>
                      <CardContent className="p-4">
                        <img
                          src={`http://localhost:3001${photo.image}`}
                          alt={photo.caption || "Gallery photo"}
                          className="w-full h-48 object-cover rounded mb-2"
                        />
                        {photo.caption && (
                          <p className="text-sm text-muted-foreground mb-2">{photo.caption}</p>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteGalleryPhoto(photo.id)}
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
