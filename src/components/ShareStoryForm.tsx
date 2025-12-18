import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import type { SubmittedStory } from "@/pages/ImpactStories";

interface ShareStoryFormProps {
  onStorySubmit?: (story: SubmittedStory) => void;
}

export function ShareStoryForm({ onStorySubmit }: ShareStoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    story: "",
    category: "General",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.story.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image with your story");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        // Upload image to Supabase Storage
        const fileExt = image.name.split('.').pop();
        const fileName = `${formData.name.replace(/\s+/g, "_")}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("story-images")
          .upload(fileName, image, { upsert: false });
        if (uploadError) throw uploadError;
        imageUrl = uploadData?.path ? supabase.storage.from("story-images").getPublicUrl(uploadData.path).data.publicUrl : "";
      }

      // Insert submission as 'pending' into Supabase
      const { error: insertError } = await supabase.from("submissions").insert([
        {
          type: "story",
          status: "pending",
          data: {
            name: formData.name,
            email: formData.email,
            story: formData.story,
            category: formData.category,
            imageUrl,
          },
        },
      ]);
      if (insertError) throw insertError;

      toast.success("Story submitted successfully! Thank you for sharing your impact.");
      setFormData({
        name: "",
        email: "",
        story: "",
        category: "General",
      });
      handleRemoveImage();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Share Your Story
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Have you been impacted by CArCRT's programs? We'd love to hear your story
              and share it with others. Upload your photo and tell us how we've made a
              difference in your life.
            </p>
          </div>

          <Card className="border-none shadow-lg bg-background">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-foreground"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-foreground"
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Program Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General">General Impact</option>
                    <option value="Drug Abuse Prevention">Drug Abuse Prevention</option>
                    <option value="Food Security & Women Empowerment">Food Security & Women Empowerment</option>
                    <option value="WASH">WASH (Water, Sanitation & Hygiene)</option>
                    <option value="Youth Development">Youth Development</option>
                    <option value="Community Health">Community Health</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                {/* Story Textarea */}
                <div>
                  <label htmlFor="story" className="block text-sm font-medium text-foreground mb-2">
                    Your Story *
                  </label>
                  <Textarea
                    id="story"
                    name="story"
                    placeholder="Tell us your story... (min 50 characters)"
                    value={formData.story}
                    onChange={handleInputChange}
                    className="text-foreground min-h-[150px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.story.length} characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Your Photo *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {!preview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-primary/40 rounded-lg p-8 text-center hover:border-primary/60 transition-colors cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-primary/60 mx-auto mb-2" />
                      <p className="text-foreground font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </button>
                  ) : (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-destructive text-primary-foreground p-2 rounded-full hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-sm text-muted-foreground mt-2">
                        {image?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Submit Your Story
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to allow CArCRT to share your story and photo
                  on our website and promotional materials.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
