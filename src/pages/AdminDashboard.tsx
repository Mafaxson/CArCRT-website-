import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

const sections = [
  { key: "stats", label: "Stats", path: "/admin/stats" },
  { key: "partners", label: "Partners & Sponsors", path: "/admin/partners" },
  { key: "coaching", label: "Coaching Partners", path: "/admin/coaching" },
  { key: "affiliates", label: "Affiliate Partners", path: "/admin/affiliates" },
  { key: "gallery", label: "Gallery", path: "/admin/gallery" },
  { key: "leadership", label: "Leadership, Team & Interns", path: "/admin/leadership" },
  { key: "programs", label: "Programs", path: "/admin/programs" },
  { key: "news", label: "News & Updates", path: "/admin/news" },
  { key: "events", label: "Events", path: "/admin/events" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin-login");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <div className="max-w-4xl mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.key} className="bg-white rounded shadow p-6 flex flex-col items-center">
              <span className="text-lg font-semibold mb-2">{section.label}</span>
              <Button onClick={() => navigate(section.path)} className="w-full">Manage</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
