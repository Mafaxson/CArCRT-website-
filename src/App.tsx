import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import MissionVision from "./pages/MissionVision";
import History from "./pages/History";
import Leadership from "./pages/Leadership";
import Programs from "./pages/Programs";
import ImpactStories from "./pages/ImpactStories";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import GetInvolved from "./pages/GetInvolved";
import Partners from "./pages/Partners";
import CoachingPartnerDetail from "./pages/CoachingPartnerDetail";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import Accessibility from "./pages/Accessibility";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStats from "./pages/admin/stats";
import AdminPartners from "./pages/admin/partners";
import AdminCoachingPartners from "./pages/admin/coaching";
import AdminAffiliates from "./pages/admin/affiliates";
import AdminGallery from "./pages/admin/gallery";
import AdminLeadership from "./pages/admin/leadership";
import AdminPrograms from "./pages/admin/programs";
import AdminNews from "./pages/admin/news";
import AdminEvents from "./pages/admin/events";
import RestoringAgriSolutionEnterprises from "./pages/RestoringAgriSolutionEnterprises";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/mission-vision" element={<MissionVision />} />
          <Route path="/history" element={<History />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact-stories" element={<ImpactStories />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/coaching-partners/:slug" element={<CoachingPartnerDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/accessibility" element={<Accessibility />} />
          {/* Admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          <Route path="/admin/partners" element={<AdminPartners />} />
          <Route path="/admin/coaching" element={<AdminCoachingPartners />} />
          <Route path="/admin/affiliates" element={<AdminAffiliates />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/leadership" element={<AdminLeadership />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/partners/restoring-agrisolution-enterprises" element={<RestoringAgriSolutionEnterprises />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
