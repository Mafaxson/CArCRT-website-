import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText, ExternalLink } from "lucide-react";
import { ImageLightbox } from "@/components/ImageLightbox";
// import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/imageUtils";

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  videoUrl?: string;
  link?: string;
  document?: string;
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const getVideoThumbnail = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
    }
    
    // For Facebook, return null to show iframe directly
    return null;
  };

  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // Facebook - extract video ID
    const fbMatch = url.match(/facebook\.com\/.*\/v\/(\w+)/);
    if (fbMatch) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734`;
    }
    
    return url;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch('/data/news.json');
        const data = await res.json();
        const found = data.find((item: NewsArticle) => item.id === id);
        if (found) {
          setArticle(found);
        } else {
          navigate("/news");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        navigate("/news");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <>
      {lightboxImage && (
        <ImageLightbox 
          src={lightboxImage.src} 
          alt={lightboxImage.alt} 
          onClose={() => setLightboxImage(null)} 
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link to="/news">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Button>
        </Link>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4">{article.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Media Section */}
          {article.videoUrl && (
            <div className="mb-8">
              <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="rounded-lg overflow-hidden shadow-lg relative group cursor-pointer">
                  {getVideoThumbnail(article.videoUrl) ? (
                    <div className="relative aspect-video bg-gray-900">
                      <img 
                        src={getVideoThumbnail(article.videoUrl)!} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <div className="text-center text-white p-8">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-lg font-semibold">Click to Watch Video</p>
                        <p className="text-sm opacity-80 mt-2">Opens in {article.videoUrl.includes('facebook') ? 'Facebook' : article.videoUrl.includes('youtube') ? 'YouTube' : 'new tab'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </a>
              <a
                href={article.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-primary hover:text-primary/80 font-medium"
              >
                Watch on source platform →
              </a>
            </div>
          )}

          {article.image && !article.videoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => setLightboxImage({ src: getImageUrl(article.image), alt: article.title })}>
              <img 
                src={getImageUrl(article.image)}
                alt={article.title}
                className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {article.content}
            </div>
          </div>

          {/* Document Download */}
          {article.document && (
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Attached Document</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.document.split('/').pop()}
                    </p>
                  </div>
                </div>
                <a
                  href={getImageUrl(article.document)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    Download
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* External Link */}
          {article.link && (
            <div className="border-t pt-6">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Read full article at source
              </a>
            </div>
          )}

          {/* Back Button at Bottom */}
          <div className="mt-12 pt-8 border-t">
            <Link to="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NewsDetail;
