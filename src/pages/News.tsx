import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ImageLightbox";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

const categories = ["All", "Announcements", "Programs", "Impact", "Partnerships", "Events", "Reports"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allNews, setAllNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const getVideoThumbnail = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }
    // For Facebook, return null to show iframe directly
    return null;
  };

  const getEmbedUrl = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    const fbMatch = url.match(/facebook\.com\/.*\/v\/(\w+)/);
    if (fbMatch) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734`;
    }
    return url;
  };

  useEffect(() => {
    fetch('/data/news.json')
      .then((res) => res.json())
      .then((data) => {
        setAllNews(data);
        setFilteredNews(data);
      })
      .catch((error) => {
        console.error('Failed to fetch news:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredNews(allNews);
    } else {
      const filtered = allNews.filter(news => {
        const categories = Array.isArray(news.category) ? news.category : [news.category];
        return categories.includes(selectedCategory);
      });
      setFilteredNews(filtered);
    }
  }, [selectedCategory, allNews]);

  const featuredPost = filteredNews.length > 0 ? filteredNews[0] : null;
  const posts = filteredNews;
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
              News & <span className="gradient-text">Updates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay informed about our latest activities, achievements, and community impact
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {featuredPost ? (
            <Card className="overflow-hidden border-none shadow-card animate-fade-up">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <a href={featuredPost.videoUrl || `/news/${featuredPost.id}`} target={featuredPost.videoUrl ? "_blank" : "_self"} rel={featuredPost.videoUrl ? "noopener noreferrer" : undefined} className="bg-gradient-to-br from-primary to-primary/70 p-8 md:p-12 text-primary-foreground min-h-[350px] flex flex-col justify-end relative cursor-pointer">
                    {featuredPost.videoUrl && getVideoThumbnail(featuredPost.videoUrl) && !featuredPost.image && (
                      <>
                        <img 
                          src={getVideoThumbnail(featuredPost.videoUrl)!} 
                          alt={featuredPost.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    {featuredPost.videoUrl && !getVideoThumbnail(featuredPost.videoUrl) && !featuredPost.image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {featuredPost.image && (
                      <img 
                        src={getImageUrl(featuredPost.image)} 
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-25 transition-opacity"
                        onClick={(e) => { e.preventDefault(); setLightboxImage({ src: getImageUrl(featuredPost.image), alt: featuredPost.title }); }}
                      />
                    )}
                    <div className="relative z-10">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">{featuredPost.title}</h2>
                      <span className="inline-flex items-center gap-2 text-sm opacity-80">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </span>
                    </div>
                  </a>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <span className="text-primary font-medium text-sm mb-2">Featured Article</span>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/news/${featuredPost.id}`}>
                        <Button className="w-fit gap-2">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      {featuredPost.videoUrl && (
                        <a 
                          href={featuredPost.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" className="w-fit gap-2">
                            Watch Video →
                          </Button>
                        </a>
                      )}
                      {featuredPost.link && (
                        <a 
                          href={featuredPost.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                        >
                          View external source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news articles available</p>
            </div>
          )}
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <SectionHeader
            title="Latest News"
            subtitle="Recent updates from our programs and initiatives"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="card-hover border-none shadow-card animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      {post.image && (
                        <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden rounded-t-lg cursor-pointer" onClick={() => setLightboxImage({ src: getImageUrl(post.image), alt: post.title })}>
                          <img 
                            src={getImageUrl(post.image)} 
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {post.videoUrl && !post.image && getVideoThumbnail(post.videoUrl) && (
                        <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden rounded-t-lg cursor-pointer relative group" onClick={() => window.open(post.videoUrl, '_blank')}>
                          <img 
                            src={getVideoThumbnail(post.videoUrl)!} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                      {post.videoUrl && !post.image && !getVideoThumbnail(post.videoUrl) && (
                        <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center cursor-pointer group" onClick={() => window.open(post.videoUrl, '_blank')}>
                          <div className="text-center text-white">
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-sm font-semibold">Click to Watch</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Link to={`/news/${post.id}`}>
                          <Button variant="link" className="p-0 h-auto gap-1 text-primary">
                            Read More
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                        {post.videoUrl && (
                          <a 
                            href={post.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            Watch Video →
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedCategory === "All" ? "No news articles yet" : `No ${selectedCategory} articles yet`}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
