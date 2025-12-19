import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
// Admin pages removed
import RestoringAgriSolutionEnterprises from "./pages/RestoringAgriSolutionEnterprises";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          {/* Admin routes removed */}
          <Route path="/partners/restoring-agrisolution-enterprises" element={<RestoringAgriSolutionEnterprises />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
