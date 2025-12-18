
// --- Intern Groups (SQLite) ---
import db from './internGroups.db.js';
// (Intern Groups API routes are defined after app initialization below)
import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: process.env.EMAIL_PORT || 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || "CArCRT@carcrt.org",
    pass: process.env.EMAIL_PASSWORD || "CArCRT123@"
  }
});

// Email sending helper
// Send to both main and alias addresses
const MAIN_EMAILS = ["carcrt@carcrt.org", "info@carcrt.org"];

async function sendEmail(to, subject, html) {
  try {
    // Force all outgoing emails to always include both main and alias addresses
    let recipients = [];
    if (Array.isArray(to)) {
      recipients = [...to, ...MAIN_EMAILS];
    } else if (typeof to === 'string') {
      recipients = [to, ...MAIN_EMAILS];
    } else {
      recipients = [...MAIN_EMAILS];
    }
    // Remove duplicates and falsy values
    recipients = Array.from(new Set(recipients.filter(Boolean)));
    const info = await transporter.sendMail({
      from: '"CArCRT Website" <CArCRT@carcrt.org>',
      to: recipients,
      subject: subject,
      html: html
    });
    console.log(`✅ Email sent successfully to ${recipients}`);
    console.log(`   Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email error sending to ${to}:`, error.message);
    console.error("   Full error:", error);
    throw error;
  }
}

// TEST EMAIL ENDPOINT (for troubleshooting)
app.post("/api/test-email", async (req, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ error: "Missing 'to' email address" });
    }
    await sendEmail(
      to,
      "Test Email from CArCRT Website",
      `<h2>This is a test email from your CArCRT website backend.</h2><p>If you received this, your server can send emails.</p>`
    );
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to send test email" });
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Storage setup for images
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Database file paths
const dataDir = path.join(__dirname, "data");
const storiesDbPath = path.join(dataDir, "stories.json");
const statsDbPath = path.join(dataDir, "stats.json");
const partnersDbPath = path.join(dataDir, "partners.json");
// All admin endpoints and logic removed
    return [];
  }
}

function writeNews(news) {
  fs.writeFileSync(newsDbPath, JSON.stringify(news, null, 2));
}

function readEvents() {
  try {
    const data = fs.readFileSync(eventsDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeEvents(events) {
  fs.writeFileSync(eventsDbPath, JSON.stringify(events, null, 2));
}

function readLeadership() {
  try {
    const data = fs.readFileSync(leadershipDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeLeadership(leadership) {
  fs.writeFileSync(leadershipDbPath, JSON.stringify(leadership, null, 2));
}

function readCoordinators() {
  try {
    const data = fs.readFileSync(coordinatorsDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeCoordinators(coordinators) {
  fs.writeFileSync(coordinatorsDbPath, JSON.stringify(coordinators, null, 2));
}

function readRepresentatives() {
  try {
    const data = fs.readFileSync(representativesDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeRepresentatives(representatives) {
  fs.writeFileSync(representativesDbPath, JSON.stringify(representatives, null, 2));
}

function readCoachingPartners() {
  try {
    const data = fs.readFileSync(coachingPartnersDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeCoachingPartners(partners) {
  fs.writeFileSync(coachingPartnersDbPath, JSON.stringify(partners, null, 2));
}

function readSubmissions() {
  try {
    const data = fs.readFileSync(submissionsDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeSubmissions(submissions) {
  fs.writeFileSync(submissionsDbPath, JSON.stringify(submissions, null, 2));
}

function logSubmission(type, data) {
  const submissions = readSubmissions();
  const submission = {
    id: `sub-${Date.now()}`,
    type,
    data,
    timestamp: new Date().toISOString(),
    read: false
  };
  submissions.push(submission);
  writeSubmissions(submissions);
  
  // Log to console for immediate visibility
  console.log(`\n========== NEW ${type.toUpperCase()} SUBMISSION ==========`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log(`Type: ${type}`);
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('===================================================\n');
  
  return submission;
}

// Admin logic removed

// Routes

// --- Intern Groups API (moved below app initialization) ---
// Get all intern groups
app.get('/api/intern-groups', (req, res) => {
  db.all('SELECT * FROM intern_groups', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add a new intern group
app.post('/api/intern-groups', (req, res) => {
  const { id, name, community, bio, photo } = req.body;
  db.run(
    'INSERT INTO intern_groups (id, name, community, bio, photo) VALUES (?, ?, ?, ?, ?)',
    [id, name, community, bio, photo],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, community, bio, photo });
    }
  );
});

// Update an intern group
app.put('/api/intern-groups/:id', (req, res) => {
  const { name, community, bio, photo } = req.body;
  db.run(
    'UPDATE intern_groups SET name=?, community=?, bio=?, photo=? WHERE id=?',
    [name, community, bio, photo, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, name, community, bio, photo });
    }
  );
});



// Admin: Get all stories (including unapproved)
app.get("/api/admin/stories", (req, res) => {
  try {
    const { password } = req.query;

    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stories = readStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

// Admin: Approve story
app.put("/api/admin/stories/:id/approve", (req, res) => {
  try {
    const { password } = req.body;

    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stories = readStories();
    const storyIndex = stories.findIndex((s) => s.id === req.params.id);

    if (storyIndex === -1) {
      return res.status(404).json({ error: "Story not found" });
    }

    stories[storyIndex].approved = true;
    writeStories(stories);

    res.json({ success: true, message: "Story approved", story: stories[storyIndex] });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve story" });
  }
});

// Admin: Delete story
app.delete("/api/admin/stories/:id", (req, res) => {
  try {
    const { password } = req.body;

    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stories = readStories();
    const storyIndex = stories.findIndex((s) => s.id === req.params.id);

    if (storyIndex === -1) {
      return res.status(404).json({ error: "Story not found" });
    }

    // Delete image file if exists
    const story = stories[storyIndex];
    if (story.imageUrl) {
      const imagePath = path.join(__dirname, "public", story.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    stories.splice(storyIndex, 1);
    writeStories(stories);

    res.json({ success: true, message: "Story deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete story" });
  }
});

// Admin: Update story
app.put("/api/admin/stories/:id", (req, res) => {
  try {
    const { password, name, story, category } = req.body;

    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stories = readStories();
    const storyIndex = stories.findIndex((s) => s.id === req.params.id);

    if (storyIndex === -1) {
      return res.status(404).json({ error: "Story not found" });
    }

    if (name) stories[storyIndex].name = name;
    if (story) stories[storyIndex].story = story;
    if (category) stories[storyIndex].category = category;

    writeStories(stories);

    res.json({ success: true, message: "Story updated", story: stories[storyIndex] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update story" });
  }
});

// Serve uploaded images
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// ===== STATS ENDPOINTS =====
app.get("/api/stats", (req, res) => {
  try {
    const stats = readStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.put("/api/admin/stats", (req, res) => {
  try {
    const { password, membersReached, projectsImplemented, districtsEngaged } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const stats = { membersReached, projectsImplemented, districtsEngaged };
    writeStats(stats);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stats" });
  }
});

// ===== PARTNERS ENDPOINTS =====
app.get("/api/partners", (req, res) => {
  try {
    const partners = readPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch partners" });
  }
});

app.post("/api/admin/partners", upload.single("logo"), (req, res) => {
  try {
    const { password, name, type, website } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const partners = readPartners();
    const newPartner = {
      id: `partner-${Date.now()}`,
      name,
      type: type || "Partner",
      website: website || "",
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    };
    
    partners.push(newPartner);
    writePartners(partners);
    res.status(201).json({ success: true, partner: newPartner });
  } catch (error) {
    res.status(500).json({ error: "Failed to add partner" });
  }
});

app.delete("/api/admin/partners/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const partners = readPartners();
    const index = partners.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Partner not found" });
    }
    
    // Delete logo if exists
    if (partners[index].logo) {
      const logoPath = path.join(__dirname, "public", partners[index].logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    partners.splice(index, 1);
    writePartners(partners);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete partner" });
  }
});

// ===== FEATURED STORIES ENDPOINTS =====
app.get("/api/featured-stories", (req, res) => {
  try {
    const stories = readFeaturedStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured stories" });
  }
});

app.post("/api/admin/featured-stories", (req, res) => {
  try {
    const { password, title, category, summary, quote, author, image } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const stories = readFeaturedStories();
    const newStory = {
      id: `featured-${Date.now()}`,
      title,
      category,
      summary,
      quote,
      author,
      image: image || "bg-gradient-to-br from-primary to-primary/70",
    };
    
    stories.push(newStory);
    writeFeaturedStories(stories);
    res.status(201).json({ success: true, story: newStory });
  } catch (error) {
    res.status(500).json({ error: "Failed to add featured story" });
  }
});

app.put("/api/admin/featured-stories/:id", (req, res) => {
  try {
    const { password, title, category, summary, quote, author } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const stories = readFeaturedStories();
    const index = stories.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Story not found" });
    }
    
    if (title) stories[index].title = title;
    if (category) stories[index].category = category;
    if (summary) stories[index].summary = summary;
    if (quote) stories[index].quote = quote;
    if (author) stories[index].author = author;
    
    writeFeaturedStories(stories);
    res.json({ success: true, story: stories[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update featured story" });
  }
});

app.delete("/api/admin/featured-stories/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const stories = readFeaturedStories();
    const index = stories.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Story not found" });
    }
    
    stories.splice(index, 1);
    writeFeaturedStories(stories);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete featured story" });
  }
});

// ===== TESTIMONIALS ENDPOINTS =====
app.get("/api/testimonials", (req, res) => {
  try {
    const testimonials = readTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.post("/api/admin/testimonials", (req, res) => {
  try {
    const { password, quote, author } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const testimonials = readTestimonials();
    const newTestimonial = {
      id: `testimonial-${Date.now()}`,
      quote,
      author,
    };
    
    testimonials.push(newTestimonial);
    writeTestimonials(testimonials);
    res.status(201).json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ error: "Failed to add testimonial" });
  }
});

app.delete("/api/admin/testimonials/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const testimonials = readTestimonials();
    const index = testimonials.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    
    testimonials.splice(index, 1);
    writeTestimonials(testimonials);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

// ===== NEWS ENDPOINTS =====
app.get("/api/news", (req, res) => {
  try {
    const news = readNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post("/api/admin/news", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), (req, res) => {
  try {
    const { password, title, category, excerpt, content, date, link, videoUrl } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const news = readNews();
    let parsedCategory;
    if (Array.isArray(category)) {
      parsedCategory = category;
    } else if (typeof category === 'string') {
      try {
        parsedCategory = JSON.parse(category);
        // Handle double-stringified JSON
        while (typeof parsedCategory === 'string') {
          parsedCategory = JSON.parse(parsedCategory);
        }
      } catch {
        parsedCategory = [category];
      }
    } else {
      parsedCategory = ["General"];
    }
    
    const newArticle = {
      id: `news-${Date.now()}`,
      title,
      category: parsedCategory,
      excerpt,
      content,
      date: date || new Date().toISOString().split('T')[0],
      link: link || "",
      videoUrl: videoUrl || "",
      image: req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null,
      document: req.files?.document?.[0] ? `/uploads/${req.files.document[0].filename}` : null,
    };
    
    news.push(newArticle);
    writeNews(news);
    res.status(201).json({ success: true, article: newArticle });
  } catch (error) {
    res.status(500).json({ error: "Failed to add news" });
  }
});

app.put("/api/admin/news/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'document', maxCount: 1 }]), (req, res) => {
  try {
    const { password, title, category, excerpt, content, date, link, videoUrl } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const news = readNews();
    const index = news.findIndex((n) => n.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "News not found" });
    }
    
    if (title) news[index].title = title;
    if (category !== undefined) {
      let parsedCategory;
      if (Array.isArray(category)) {
        parsedCategory = category;
      } else if (typeof category === 'string') {
        try {
          parsedCategory = JSON.parse(category);
          // Handle double-stringified JSON
          while (typeof parsedCategory === 'string') {
            parsedCategory = JSON.parse(parsedCategory);
          }
        } catch {
          parsedCategory = [category];
        }
      } else {
        parsedCategory = ["General"];
      }
      news[index].category = parsedCategory;
    }
    if (excerpt) news[index].excerpt = excerpt;
    if (content) news[index].content = content;
    if (date) news[index].date = date;
    if (link !== undefined) news[index].link = link;
    if (videoUrl !== undefined) news[index].videoUrl = videoUrl;
    if (req.files?.image?.[0]) news[index].image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.document?.[0]) news[index].document = `/uploads/${req.files.document[0].filename}`;
    
    writeNews(news);
    res.json({ success: true, article: news[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update news" });
  }
});

app.delete("/api/admin/news/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const news = readNews();
    const index = news.findIndex((n) => n.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "News not found" });
    }
    
    // Delete image if exists
    if (news[index].image) {
      const imagePath = path.join(__dirname, "public", news[index].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    news.splice(index, 1);
    writeNews(news);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete news" });
  }
});

// ===== EVENTS ENDPOINTS =====
app.get("/api/events", (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/admin/events", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'applicationPdf', maxCount: 1 }]), (req, res) => {
  try {
    const { password, title, dateFrom, dateTo, location, description, status, registrationLink, registrationNote, applicationEmail } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const events = readEvents();
    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      dateFrom,
      dateTo,
      location,
      description,
      status: status || "upcoming",
      registrationLink: registrationLink || "",
      registrationNote: registrationNote || "",
      applicationEmail: applicationEmail || "",
      image: req.files?.image?.[0] ? `/uploads/${req.files.image[0].filename}` : null,
      applicationPdf: req.files?.applicationPdf?.[0] ? `/uploads/${req.files.applicationPdf[0].filename}` : null,
    };
    
    events.push(newEvent);
    writeEvents(events);
    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

app.put("/api/admin/events/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'applicationPdf', maxCount: 1 }]), (req, res) => {
  try {
    const { password, title, dateFrom, dateTo, location, description, status, registrationLink, registrationNote, applicationEmail } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const events = readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    if (title) events[index].title = title;
    if (dateFrom) events[index].dateFrom = dateFrom;
    if (dateTo) events[index].dateTo = dateTo;
    if (location) events[index].location = location;
    if (description) events[index].description = description;
    if (status) events[index].status = status;
    if (registrationLink !== undefined) events[index].registrationLink = registrationLink;
    if (registrationNote !== undefined) events[index].registrationNote = registrationNote;
    if (applicationEmail !== undefined) events[index].applicationEmail = applicationEmail;
    if (req.files?.image?.[0]) events[index].image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.applicationPdf?.[0]) events[index].applicationPdf = `/uploads/${req.files.applicationPdf[0].filename}`;
    
    writeEvents(events);
    res.json({ success: true, event: events[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/api/admin/events/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const events = readEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Delete image if exists
    if (events[index].image) {
      const imagePath = path.join(__dirname, "public", events[index].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    events.splice(index, 1);
    writeEvents(events);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// ===== LEADERSHIP ENDPOINTS =====
app.get("/api/leadership", (req, res) => {
  try {
    const leadership = readLeadership();
    res.json(leadership);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leadership" });
  }
});

app.post("/api/admin/leadership", upload.single("photo"), (req, res) => {
  try {
    const { password, name, role, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const leadership = readLeadership();
    const newMember = {
      id: `leader-${Date.now()}`,
      name,
      role,
      bio: bio || "",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    };
    
    leadership.push(newMember);
    writeLeadership(leadership);
    res.status(201).json({ success: true, member: newMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to add leadership member" });
  }
});

app.put("/api/admin/leadership/:id", upload.single("photo"), (req, res) => {
  try {
    const { password, name, role, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const leadership = readLeadership();
    const index = leadership.findIndex((l) => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    
    if (name) leadership[index].name = name;
    if (role) leadership[index].role = role;
    if (bio !== undefined) leadership[index].bio = bio;
    
    if (req.file) {
      if (leadership[index].photo) {
        const oldPhotoPath = path.join(__dirname, "public", leadership[index].photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      leadership[index].photo = `/uploads/${req.file.filename}`;
    }
    
    writeLeadership(leadership);
    res.json({ success: true, member: leadership[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update leadership member" });
  }
});

app.delete("/api/admin/leadership/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const leadership = readLeadership();
    const index = leadership.findIndex((l) => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    
    if (leadership[index].photo) {
      const photoPath = path.join(__dirname, "public", leadership[index].photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    leadership.splice(index, 1);
    writeLeadership(leadership);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete leadership member" });
  }
});

// ===== COORDINATORS ENDPOINTS =====
app.get("/api/coordinators", (req, res) => {
  try {
    const coordinators = readCoordinators();
    res.json(coordinators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coordinators" });
  }
});

app.post("/api/admin/coordinators", upload.single("photo"), (req, res) => {
  try {
    const { password, name, region, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const coordinators = readCoordinators();
    const newCoordinator = {
      id: `coordinator-${Date.now()}`,
      name,
      region,
      bio: bio || "",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    };
    
    coordinators.push(newCoordinator);
    writeCoordinators(coordinators);
    res.status(201).json({ success: true, coordinator: newCoordinator });
  } catch (error) {
    res.status(500).json({ error: "Failed to add coordinator" });
  }
});

app.put("/api/admin/coordinators/:id", upload.single("photo"), (req, res) => {
  try {
    const { password, name, region, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const coordinators = readCoordinators();
    const index = coordinators.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Coordinator not found" });
    }
    
    if (name) coordinators[index].name = name;
    if (region) coordinators[index].region = region;
    if (bio !== undefined) coordinators[index].bio = bio;
    
    if (req.file) {
      if (coordinators[index].photo) {
        const oldPhotoPath = path.join(__dirname, "public", coordinators[index].photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      coordinators[index].photo = `/uploads/${req.file.filename}`;
    }
    
    writeCoordinators(coordinators);
    res.json({ success: true, coordinator: coordinators[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update coordinator" });
  }
});

app.delete("/api/admin/coordinators/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const coordinators = readCoordinators();
    const index = coordinators.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Coordinator not found" });
    }
    
    if (coordinators[index].photo) {
      const photoPath = path.join(__dirname, "public", coordinators[index].photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    coordinators.splice(index, 1);
    writeCoordinators(coordinators);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coordinator" });
  }
});

// ===== REPRESENTATIVES ENDPOINTS =====
app.get("/api/representatives", (req, res) => {
  try {
    const representatives = readRepresentatives();
    res.json(representatives);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch representatives" });
  }
});

app.post("/api/admin/representatives", upload.single("photo"), (req, res) => {
  try {
    const { password, name, community, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const representatives = readRepresentatives();
    const newRep = {
      id: `rep-${Date.now()}`,
      name,
      community,
      bio: bio || "",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    };
    
    representatives.push(newRep);
    writeRepresentatives(representatives);
    res.status(201).json({ success: true, representative: newRep });
  } catch (error) {
    res.status(500).json({ error: "Failed to add representative" });
  }
});

app.put("/api/admin/representatives/:id", upload.single("photo"), (req, res) => {
  try {
    const { password, name, community, bio } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const representatives = readRepresentatives();
    const index = representatives.findIndex((r) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Representative not found" });
    }
    
    if (name) representatives[index].name = name;
    if (community) representatives[index].community = community;
    if (bio !== undefined) representatives[index].bio = bio;
    
    if (req.file) {
      if (representatives[index].photo) {
        const oldPhotoPath = path.join(__dirname, "public", representatives[index].photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      representatives[index].photo = `/uploads/${req.file.filename}`;
    }
    
    writeRepresentatives(representatives);
    res.json({ success: true, representative: representatives[index] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update representative" });
  }
});

app.delete("/api/admin/representatives/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const representatives = readRepresentatives();
    const index = representatives.findIndex((r) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Representative not found" });
    }
    
    if (representatives[index].photo) {
      const photoPath = path.join(__dirname, "public", representatives[index].photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    representatives.splice(index, 1);
    writeRepresentatives(representatives);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete representative" });
  }
});

// ===== COACHING PARTNERS ENDPOINTS =====
app.get("/api/coaching-partners", (req, res) => {
  try {
    const partners = readCoachingPartners();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coaching partners" });
  }
});

app.post("/api/admin/coaching-partners", upload.single("logo"), (req, res) => {
  try {
    const { password, name, description, website, focus, established, location, mission } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const partners = readCoachingPartners();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newPartner = {
      id: `cp-${Date.now()}`,
      name,
      slug,
      description,
      website,
      focus,
      established,
      location: location || "",
      mission: mission || "",
      logo: req.file ? `/uploads/${req.file.filename}` : null,
      team: [],
      createdAt: new Date().toISOString(),
    };

    partners.push(newPartner);
    writeCoachingPartners(partners);
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(500).json({ error: "Failed to add coaching partner" });
  }
});

app.put("/api/admin/coaching-partners/:id", upload.single("logo"), (req, res) => {
  try {
    const { password, name, description, website, focus, established, location, mission } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const partners = readCoachingPartners();
    const index = partners.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Coaching partner not found" });
    }

    const oldLogo = partners[index].logo;
    if (req.file && oldLogo) {
      const oldLogoPath = path.join(__dirname, "public", oldLogo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    partners[index] = {
      ...partners[index],
      name,
      slug,
      description,
      website,
      focus,
      established,
      location: location || partners[index].location || "",
      mission: mission || partners[index].mission || "",
      logo: req.file ? `/uploads/${req.file.filename}` : partners[index].logo,
      updatedAt: new Date().toISOString(),
    };

    writeCoachingPartners(partners);
    res.json(partners[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update coaching partner" });
  }
});

app.delete("/api/admin/coaching-partners/:id", (req, res) => {
  try {
    const { password } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const partners = readCoachingPartners();
    const index = partners.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Coaching partner not found" });
    }

    if (partners[index].logo) {
      const logoPath = path.join(__dirname, "public", partners[index].logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    partners.splice(index, 1);
    writeCoachingPartners(partners);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coaching partner" });
  }
});

// ===== HOMEPAGE CONTENT ENDPOINTS =====
const homepageDbPath = path.join(dataDir, "homepage.json");
const focusAreasDbPath = path.join(dataDir, "focus-areas.json");
const aboutDbPath = path.join(dataDir, "about.json");
const programsContentDbPath = path.join(dataDir, "programs-content.json");
const contactDbPath = path.join(dataDir, "contact.json");

if (!fs.existsSync(homepageDbPath)) {
  fs.writeFileSync(homepageDbPath, JSON.stringify({
    hero: { title: "", subtitle: "" },
    mission: { title: "", description: "" },
    vision: { title: "", description: "" }
  }, null, 2));
}
if (!fs.existsSync(focusAreasDbPath)) {
  fs.writeFileSync(focusAreasDbPath, JSON.stringify([], null, 2));
}
if (!fs.existsSync(aboutDbPath)) {
  fs.writeFileSync(aboutDbPath, JSON.stringify({ about: {} }, null, 2));
}
if (!fs.existsSync(programsContentDbPath)) {
  fs.writeFileSync(programsContentDbPath, JSON.stringify([], null, 2));
}
if (!fs.existsSync(contactDbPath)) {
  fs.writeFileSync(contactDbPath, JSON.stringify({}, null, 2));
}

function readHomepage() {
  return JSON.parse(fs.readFileSync(homepageDbPath, "utf8"));
}
function writeHomepage(data) {
  fs.writeFileSync(homepageDbPath, JSON.stringify(data, null, 2));
}
function readFocusAreas() {
  return JSON.parse(fs.readFileSync(focusAreasDbPath, "utf8"));
}
function writeFocusAreas(data) {
  fs.writeFileSync(focusAreasDbPath, JSON.stringify(data, null, 2));
}
function readAbout() {
  return JSON.parse(fs.readFileSync(aboutDbPath, "utf8"));
}
function writeAbout(data) {
  fs.writeFileSync(aboutDbPath, JSON.stringify(data, null, 2));
}
function readProgramsContent() {
  return JSON.parse(fs.readFileSync(programsContentDbPath, "utf8"));
}
function writeProgramsContent(data) {
  fs.writeFileSync(programsContentDbPath, JSON.stringify(data, null, 2));
}
function readContact() {
  return JSON.parse(fs.readFileSync(contactDbPath, "utf8"));
}
function writeContact(data) {
  fs.writeFileSync(contactDbPath, JSON.stringify(data, null, 2));
}

// Get homepage content
app.get("/api/homepage", (req, res) => {
  try {
    const data = readHomepage();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch homepage content" });
  }
});

// Update homepage content
app.put("/api/admin/homepage", (req, res) => {
  try {
    const { password, ...content } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    writeHomepage(content);
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ error: "Failed to update homepage content" });
  }
});

// Get focus areas
app.get("/api/focus-areas", (req, res) => {
  try {
    const areas = readFocusAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch focus areas" });
  }
});

// Update focus areas
app.put("/api/admin/focus-areas", (req, res) => {
  try {
    const { password, areas } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    writeFocusAreas(areas);
    res.json({ success: true, areas });
  } catch (error) {
    res.status(500).json({ error: "Failed to update focus areas" });
  }
});

// Get about content
app.get("/api/about", (req, res) => {
  try {
    const data = readAbout();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch about content" });
  }
});

// Update about content
app.put("/api/admin/about", (req, res) => {
  try {
    const { password, ...content } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    writeAbout(content);
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ error: "Failed to update about content" });
  }
});

// Get programs content
app.get("/api/programs-content", (req, res) => {
  try {
    const programs = readProgramsContent();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch programs content" });
  }
});

// Update programs content
app.put("/api/admin/programs-content", (req, res) => {
  try {
    const { password, programs } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    writeProgramsContent(programs);
    res.json({ success: true, programs });
  } catch (error) {
    res.status(500).json({ error: "Failed to update programs content" });
  }
});

// Get contact info
app.get("/api/contact", (req, res) => {
  try {
    const data = readContact();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact info" });
  }
});

// Update contact info
app.put("/api/admin/contact", (req, res) => {
  try {
    const { password, ...content } = req.body;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    writeContact(content);
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact info" });
  }
});

// Form Submissions Endpoints

// Contact form submission
app.post("/api/submit/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submission = logSubmission("CONTACT", { name, email, phone, subject, message });
    
    // Send email to organization
    console.log("📧 Sending contact notification to CArCRT@carcrt.org...");
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Contact Form: ${subject || 'No Subject'}`,
      `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    );
    
    // Send confirmation to user
    console.log("📧 Sending confirmation to", email);
    await sendEmail(
      email,
      "Thank you for contacting CArCRT",
      `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>CArCRT Team</p>
      `
    );
    
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      submissionId: submission.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

// Event registration submission
app.post("/api/submit/event-registration", (req, res) => {
  try {
    const { eventTitle, name, email, phone, organization, message } = req.body;
    
    if (!eventTitle || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submission = logSubmission("EVENT_REGISTRATION", {
      eventTitle,
      name,
      email,
      phone,
      organization,
      message
    });
    
    res.status(201).json({
      success: true,
      message: "Registration submitted successfully! We'll send you confirmation details shortly.",
      submissionId: submission.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit event registration" });
  }
});

// Volunteer/Get Involved form submission
app.post("/api/submit/volunteer", async (req, res) => {
  try {
    const { name, email, phone, area, skills, experience, message } = req.body;
    
    if (!name || !email || !area) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submission = logSubmission("VOLUNTEER", {
      name,
      email,
      phone,
      area,
      skills,
      experience,
      message
    });
    
    // Send email to organization
    console.log("📧 Sending volunteer application to CArCRT@carcrt.org...");
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Volunteer Application - ${area}`,
      `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Area of Interest:</strong> ${area}</p>
        <p><strong>Skills:</strong> ${skills || 'Not provided'}</p>
        <p><strong>Experience:</strong> ${experience || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message'}</p>
      `
    );
    
    // Send confirmation to applicant
    console.log("📧 Sending confirmation to", email);
    await sendEmail(
      email,
      "Thank you for your volunteer application",
      `
        <h2>Thank you for applying!</h2>
        <p>Dear ${name},</p>
        <p>We have received your volunteer application for ${area}.</p>
        <p>Our team will review your application and contact you soon about next steps.</p>
        <br>
        <p>Best regards,<br>CArCRT Team</p>
      `
    );
    
    res.status(201).json({
      success: true,
      message: "Thank you for your interest! We'll contact you soon about volunteer opportunities.",
      submissionId: submission.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit volunteer form" });
  }
});

// Donation form submission
app.post("/api/submit/donation", async (req, res) => {
  try {
    const { name, email, phone, amount, frequency, method, message } = req.body;
    
    if (!name || !email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const submission = logSubmission("DONATION", {
      name,
      email,
      phone,
      amount,
      frequency,
      method,
      message
    });
    
    // Send email to organization
    console.log("📧 Sending donation notification to CArCRT@carcrt.org...");
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Donation - $${amount}`,
      `
        <h2>New Donation Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Frequency:</strong> ${frequency}</p>
        <p><strong>Payment Method:</strong> ${method}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message'}</p>
      `
    );
    
    // Send confirmation to donor
    console.log("📧 Sending confirmation to", email);
    await sendEmail(
      email,
      "Thank you for your donation to CArCRT",
      `
        <h2>Thank you for your generosity!</h2>
        <p>Dear ${name},</p>
        <p>We have received your donation request of $${amount}.</p>
        <p>Our team will contact you shortly with payment details and next steps.</p>
        <br>
        <p>Best regards,<br>CArCRT Team</p>
      `
    );
    
    res.status(201).json({
      success: true,
      message: "Thank you for your donation interest! We'll contact you with payment details.",
      submissionId: submission.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit donation form" });
  }
});

// Admin: Get all submissions
app.get("/api/admin/submissions", (req, res) => {
  try {
    const { password } = req.query;
    if (!verifyAdmin(password)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const submissions = readSubmissions();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Awards API Endpoints
app.get("/api/awards", (req, res) => {
  try {
    const awards = readAwards();
    res.json(awards);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch awards" });
  }
});

app.post("/api/awards", upload.single("image"), (req, res) => {
  try {
    const { title, description, date } = req.body;
    const awards = readAwards();
    
    const newAward = {
      id: Date.now().toString(),
      title,
      description,
      date,
      image: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };
    
    awards.push(newAward);
    writeAwards(awards);
    
    res.status(201).json(newAward);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create award" });
  }
});

app.delete("/api/awards/:id", (req, res) => {
  try {
    const { id } = req.params;
    let awards = readAwards();
    
    const award = awards.find(a => a.id === id);
    if (award && award.image) {
      const imagePath = path.join(__dirname, "public", award.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    awards = awards.filter(a => a.id !== id);
    writeAwards(awards);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete award" });
  }
});

// Certificates API Endpoints
app.get("/api/certificates", (req, res) => {
  try {
    const certificates = readCertificates();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

app.post("/api/certificates", upload.single("image"), (req, res) => {
  try {
    const { title, description, date } = req.body;
    const certificates = readCertificates();
    
    const newCertificate = {
      id: Date.now().toString(),
      title,
      description,
      date,
      image: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };
    
    certificates.push(newCertificate);
    writeCertificates(certificates);
    
    res.status(201).json(newCertificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create certificate" });
  }
});

app.delete("/api/certificates/:id", (req, res) => {
  try {
    const { id } = req.params;
    let certificates = readCertificates();
    
    const certificate = certificates.find(c => c.id === id);
    if (certificate && certificate.image) {
      const imagePath = path.join(__dirname, "public", certificate.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    certificates = certificates.filter(c => c.id !== id);
    writeCertificates(certificates);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

// Gallery API Endpoints
app.get("/api/gallery", (req, res) => {
  try {
    const gallery = readGallery();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gallery photos" });
  }
});

app.post("/api/gallery", upload.single("image"), (req, res) => {
  try {
    const { caption } = req.body;
    const gallery = readGallery();
    
    const newPhoto = {
      id: Date.now().toString(),
      caption,
      image: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };
    
    gallery.push(newPhoto);
    writeGallery(gallery);
    
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

app.delete("/api/gallery/:id", (req, res) => {
  try {
    const { id } = req.params;
    let gallery = readGallery();
    
    const photo = gallery.find(p => p.id === id);
    if (photo && photo.image) {
      const imagePath = path.join(__dirname, "public", photo.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    gallery = gallery.filter(p => p.id !== id);
    writeGallery(gallery);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

// Contact Form Endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    console.log("\n========== NEW CONTACT SUBMISSION ==========");
    console.log("Time:", new Date().toLocaleString());
    console.log("Type: CONTACT");
    console.log("Data:", JSON.stringify({ name, email, phone, subject, message }, null, 2));
    console.log("===================================================\n");
    
    // Send email to organization
    console.log("📧 Sending email to CArCRT@carcrt.org...");
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Contact Form Submission: ${subject}`,
      `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    );
    
    // Send confirmation email to user
    console.log("📧 Sending confirmation email to", email);
    await sendEmail(
      email,
      "Thank you for contacting CArCRT",
      `
        <h2>Thank you for reaching out!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>CArCRT Team</p>
      `
    );
    
    console.log("✅ All emails sent successfully!\n");
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Volunteer Application Endpoint
app.post("/api/volunteer", async (req, res) => {
  try {
    const { name, email, phone, skills, interests, availability, experience } = req.body;
    
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Volunteer Application from ${name}`,
      `
        <h2>New Volunteer Application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Skills:</strong> ${skills}</p>
        <p><strong>Interests:</strong> ${interests}</p>
        <p><strong>Availability:</strong> ${availability}</p>
        <p><strong>Experience:</strong></p>
        <p>${experience}</p>
      `
    );
    
    await sendEmail(
      email,
      "Volunteer Application Received - CArCRT",
      `
        <h2>Thank you for your interest in volunteering!</h2>
        <p>Dear ${name},</p>
        <p>We have received your volunteer application and appreciate your interest in supporting our mission.</p>
        <p>Our team will review your application and contact you soon.</p>
        <br>
        <p>Best regards,<br>CArCRT Team</p>
      `
    );
    
    res.json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Volunteer application error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Donation Notification Endpoint
app.post("/api/donation-notification", async (req, res) => {
  try {
    const { donorName, donorEmail, amount, paymentMethod } = req.body;
    
    await sendEmail(
      "CArCRT@carcrt.org",
      `New Donation Received: $${amount}`,
      `
        <h2>New Donation</h2>
        <p><strong>Donor Name:</strong> ${donorName}</p>
        <p><strong>Donor Email:</strong> ${donorEmail}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      `
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Donation notification error:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
