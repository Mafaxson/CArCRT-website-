import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
  // Auth protection: redirect if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin-login");
      }
    });
  }, [navigate]);
import { Pencil, Trash2, Plus, Check, X, Eye } from "lucide-react";

export default function AdminDashboardNew() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Stats
  const [stats, setStats] = useState({
    partners: 0,
    news: 0,
    events: 0,
    leadership: 0,
    submissions: 0,
    testimonials: 0,
  });

  // Data states
  const [partners, setPartners] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTable, setCurrentTable] = useState("");

  // Fetch stats on load
  useEffect(() => {
    fetchStats();
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [partnersData, newsData, eventsData, testimonialsData, submissionsData] = await Promise.all([
        supabase.from("partners").select("*").order("created_at", { ascending: false }),
        supabase.from("news").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("date", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("submissions").select("*").order("created_at", { ascending: false }),
      ]);

      setPartners(partnersData.data || []);
      setNews(newsData.data || []);
      setEvents(eventsData.data || []);
      setTestimonials(testimonialsData.data || []);
      setSubmissions(submissionsData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [partnersRes, newsRes, eventsRes, leadershipRes, submissionsRes, testimonialsRes] = await Promise.all([
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("leadership").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("testimonials").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        partners: partnersRes.count || 0,
        news: newsRes.count || 0,
        events: eventsRes.count || 0,
        leadership: leadershipRes.count || 0,
        submissions: submissionsRes.count || 0,
        testimonials: testimonialsRes.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete functions
  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      fetchAllData();
      fetchStats();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Approve testimonial
  const handleApproveTestimonial = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ featured: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: currentStatus ? "Testimonial hidden" : "Testimonial approved and featured",
      });

      fetchAllData();
    } catch (error) {
      console.error("Error updating testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  // Edit Item
  const handleEdit = (table: string, item: any) => {
    setCurrentTable(table);
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingItem || !currentTable) return;

    try {
      const { error } = await supabase
        .from(currentTable)
        .update(editingItem)
        .eq("id", editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      setIsDialogOpen(false);
      setEditingItem(null);
      setCurrentTable("");
      fetchAllData();
      fetchStats();
    } catch (error) {
      console.error("Error updating:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  // Update form field
  const updateField = (field: string, value: any) => {
    setEditingItem((prev: any) => ({ ...prev, [field]: value }));
  };

  // Dashboard Screen
  return (
    <Layout>
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {currentTable.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              {/* Partners Form */}
              {currentTable === "partners" && (
                <>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editingItem.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingItem.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={editingItem.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Input
                      value={editingItem.type || ""}
                      onChange={(e) => updateField("type", e.target.value)}
                      placeholder="partner or sponsor"
                    />
                  </div>
                </>
              )}

              {/* News Form */}
              {currentTable === "news" && (
                <>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={editingItem.content || ""}
                      onChange={(e) => updateField("content", e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={editingItem.category || ""}
                      onChange={(e) => updateField("category", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Author</Label>
                    <Input
                      value={editingItem.author || ""}
                      onChange={(e) => updateField("author", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editingItem.date || ""}
                      onChange={(e) => updateField("date", e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Events Form */}
              {currentTable === "events" && (
                <>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => updateField("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingItem.description || ""}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editingItem.date || ""}
                      onChange={(e) => updateField("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input
                      value={editingItem.time || ""}
                      onChange={(e) => updateField("time", e.target.value)}
                      placeholder="e.g. 2:00 PM - 5:00 PM"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editingItem.location || ""}
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input
                      value={editingItem.status || ""}
                      onChange={(e) => updateField("status", e.target.value)}
                      placeholder="upcoming, ongoing, or past"
                    />
                  </div>
                  <div>
                    <Label>Registration Link</Label>
                    <Input
                      value={editingItem.registration_link || ""}
                      onChange={(e) => updateField("registration_link", e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Testimonials Form */}
              {currentTable === "testimonials" && (
                <>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={editingItem.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={editingItem.role || ""}
                      onChange={(e) => updateField("role", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={editingItem.quote || ""}
                      onChange={(e) => updateField("quote", e.target.value)}
                      rows={4}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <section className="section-padding bg-muted/50">
        <div className="container-custom px-2 sm:px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.partners}</div>
                <div className="text-sm text-muted-foreground">Partners</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.news}</div>
                <div className="text-sm text-muted-foreground">News Articles</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.events}</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.leadership}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.submissions}</div>
                <div className="text-sm text-muted-foreground">Form Submissions</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="partners">Partners</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Welcome to the CArCRT Admin Dashboard. Manage all website content directly from here.</p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">✅ Website Status: LIVE</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>{stats.partners} Partner Organizations</li>
                      <li>{stats.news} News Articles Published</li>
                      <li>{stats.events} Events Posted</li>
                      <li>{stats.leadership} Leadership Team Members</li>
                      <li>{stats.testimonials} Testimonials</li>
                      <li>{stats.submissions} Form Submissions Received</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">📊 Quick Actions</h3>
                    <p className="text-sm mb-2">Use the tabs above to manage content:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Partners - Add/edit partner organizations</li>
                      <li>News - Publish news articles</li>
                      <li>Events - Manage events calendar</li>
                      <li>Testimonials - Approve/reject user testimonials</li>
                      <li>Submissions - View contact form submissions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PARTNERS TAB */}
            <TabsContent value="partners" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Partners & Sponsors</CardTitle>
                  <Button onClick={() => window.open('https://supabase.com/dashboard/project/rbxrelsauoqytwifdteq/editor', '_blank')}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Partner
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell className="font-medium">{partner.name}</TableCell>
                          <TableCell>
                            <Badge variant={partner.type === 'partner' ? 'default' : 'secondary'}>
                              {partner.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {partner.website || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit('partners', partner)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete('partners', partner.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NEWS TAB */}
            <TabsContent value="news" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>News & Updates</CardTitle>
                  <Button onClick={() => window.open('https://supabase.com/dashboard/project/rbxrelsauoqytwifdteq/editor', '_blank')}>
                    <Plus className="w-4 h-4 mr-2" /> Add News Article
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>
                            <Badge>{article.category}</Badge>
                          </TableCell>
                          <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{article.author}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit('news', article)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete('news', article.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* EVENTS TAB */}
            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Events Calendar</CardTitle>
                  <Button onClick={() => window.open('https://supabase.com/dashboard/project/rbxrelsauoqytwifdteq/editor', '_blank')}>
                    <Plus className="w-4 h-4 mr-2" /> Add Event
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">{event.location}</TableCell>
                          <TableCell>
                            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit('events', event)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete('events', event.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TESTIMONIALS TAB */}
            <TabsContent value="testimonials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Testimonial Approvals</CardTitle>
                  <p className="text-sm text-muted-foreground">Review and approve user testimonials before they appear on the website</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Quote</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials.map((testimonial) => (
                        <TableRow key={testimonial.id}>
                          <TableCell className="font-medium">{testimonial.name}</TableCell>
                          <TableCell className="text-sm">{testimonial.role}</TableCell>
                          <TableCell className="text-sm max-w-md truncate">{testimonial.quote}</TableCell>
                          <TableCell>
                            {testimonial.featured ? (
                              <Badge className="bg-green-500">Approved</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {testimonial.featured ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveTestimonial(testimonial.id, testimonial.featured)}
                                >
                                  <X className="w-4 h-4 mr-1" /> Hide
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveTestimonial(testimonial.id, testimonial.featured)}
                                >
                                  <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit('testimonials', testimonial)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete('testimonials', testimonial.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SUBMISSIONS TAB */}
            <TabsContent value="submissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Form Submissions</CardTitle>
                  <p className="text-sm text-muted-foreground">View all contact, volunteer, and donation form submissions</p>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <Badge>{submission.type}</Badge>
                          </TableCell>
                          <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">
                            {submission.data?.name || submission.data?.email || 'View details'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={submission.status === 'new' ? 'default' : 'secondary'}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" /> View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>{submission.type} Submission</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-2">
                                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                                      {JSON.stringify(submission.data, null, 2)}
                                    </pre>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete('submissions', submission.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
